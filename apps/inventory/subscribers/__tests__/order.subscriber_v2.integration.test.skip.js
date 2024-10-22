const { sequelize } = require('../../db/models');
jest.mock('../../publishers/inventory.publisher', () => ({
  sendTicketsReservedEvent: jest.fn(),
}));
const ticketSeeder = require('../../db/seeders/ticketSeeder');
const eventSeeder = require('../../db/seeders/eventSeeder');
const orderPublisher = require('../../../order/publishers/order.publisher');
const OrderSubscriber = require('../order.subscriber');
const orderSubscriber = new OrderSubscriber();
const ticketService = require('../../services/ticket/ticket.service');

describe.skip('Order Subscriber V2 Tests', () => {
  beforeAll(async () => {
    orderSubscriber.start();
    await sequelize.sync({ force: true });
    await eventSeeder.up(sequelize.getQueryInterface(), sequelize.constructor);
    await ticketSeeder.up(sequelize.getQueryInterface(), sequelize.constructor);
  });

  afterAll(async () => {
    await sequelize.close(); // Close the database connection
    orderPublisher.destroy();
    orderSubscriber.stop();
  });

  it('should handle order.created message', (done) => {
    // Arrange
    const orderDetails = {
      id: '7989c058-3744-4cdb-9c15-cc4bafe7209a',
      orderItems: [
        {
          event_id: ticketSeeder.testTicket.event_id,
          ticket_id: ticketSeeder.testTicket.id,
          quantity: 5,
        },
      ],
    };
    const reserveTicketSpy = jest.spyOn(ticketService, 'reserveTickets');
    orderSubscriber.registerListener(() => {
      expect(reserveTicketSpy).toHaveBeenCalledTimes(1);
      done();
    });

    // Act
    // Assert
    orderPublisher.sendOrderCreatedEvent(
      orderDetails,
      async (error, response) => {
        expect(error).toEqual(null);
        expect(response).toEqual('success');
      },
    );
  });
});
