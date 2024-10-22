const { sequelize } = require('../../../db/models');
jest.mock('../../../publishers/inventory.publisher', () => ({
  sendTicketsReservedEvent: jest.fn(),
}));

const inventoryPublisher = require('../../../publishers/inventory.publisher');

// We need to run this seeder because we have a foreign key constraint on event
const eventSeeder = require('../../../db/seeders/eventSeeder');
const ticketSeeder = require('../../../db/seeders/ticketSeeder');
const ticketService = require('../ticket.service');
const { TicketAvailabilityError } = require('common-errors');

describe('Ticket Service Integration Tests', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
    await eventSeeder.up(sequelize.getQueryInterface(), sequelize.constructor);
    await ticketSeeder.up(sequelize.getQueryInterface(), sequelize.constructor);
  });

  afterAll(async () => {
    try {
      // We need to delete reserved tickets first because we have a foreign key constraint
      await sequelize.queryInterface.bulkDelete('reserved_tickets', null, {});
      await ticketSeeder.down(
        sequelize.getQueryInterface(),
        sequelize.constructor,
      );
      await eventSeeder.down(
        sequelize.getQueryInterface(),
        sequelize.constructor,
      );
    } catch (e) {
      console.error(e);
    }

    await sequelize.close(); // Close the database connection
  });

  describe('reserveTickets', () => {
    it('should reserve tickets and send tickets reserved message', async () => {
      // Arrange
      const ticketRequest = {
        ticketId: ticketSeeder.testTicket.id,
        quantity: 5,
        orderId: '7989c058-3744-4cdb-9c15-cc4bafe7209a',
      };
      // Act
      const result = await ticketService.reserveTickets(ticketRequest);

      // Assert
      expect(result).toBeTruthy();
      expect(result.length).toEqual(5);
      expect(inventoryPublisher.sendTicketsReservedEvent).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should throw error when no ticket availability', async () => {
      // Arrange
      const ticketRequest = {
        ticketId: ticketSeeder.testTicket.id,
        quantity: 500, // Not enough tickets available for this request
        orderId: '7989c058-3744-4cdb-9c15-cc4bafe7209a',
      };

      // Act
      // Assert
      await expect(ticketService.reserveTickets(ticketRequest)).rejects.toThrow(
        TicketAvailabilityError,
      );
    });
  });
});
