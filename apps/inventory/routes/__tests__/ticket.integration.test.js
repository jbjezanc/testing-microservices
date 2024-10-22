const request = require('supertest');
const app = require('../../app');
const { sequelize } = require('../../db/models');
jest.mock('../../publishers/inventory.publisher', () => ({
  sendTicketsReleasedEvent: jest.fn(),
}));
const inventoryPublisher = require('../../publishers/inventory.publisher');

// We need to run this seeder because we have a foreign key constraint on event
const eventSeeder = require('../../db/seeders/eventSeeder');
const ticketSeeder = require('../../db/seeders/ticketSeeder');

describe('Ticket Routes', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close(); // Close the database connection
  });

  describe('/tickets/:id', () => {
    beforeEach(async () => {
      await eventSeeder.up(
        sequelize.getQueryInterface(),
        sequelize.constructor,
      );
      await ticketSeeder.up(
        sequelize.getQueryInterface(),
        sequelize.constructor,
      );
    });

    afterEach(async () => {
      await ticketSeeder.down(
        sequelize.getQueryInterface(),
        sequelize.constructor,
      );
      await eventSeeder.down(
        sequelize.getQueryInterface(),
        sequelize.constructor,
      );
    });

    it('DELETE should delete a ticket', async () => {
      // Arrange
      // Act
      const response = await request(app).delete(
        `/tickets/${ticketSeeder.testTicket.id}`,
      );

      // Assert
      expect(response.status).toBe(200);
      expect(inventoryPublisher.sendTicketsReleasedEvent).toHaveBeenCalledTimes(
        1,
      );
    });

    it('GET should return a ticket', async () => {
      // Arrange
      // Act
      const response = await request(app).get(
        `/tickets/${ticketSeeder.testTicket.id}`,
      );

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toBeTruthy();
      expect(response.body.id).toBe(ticketSeeder.testTicket.id);
    });
  });
});
