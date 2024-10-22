const request = require('supertest');
const app = require('../../app');
const { sequelize } = require('../../db/models');
jest.mock('../../publishers/inventory.publisher', () => ({}));

const eventSeeder = require('../../db/seeders/eventSeeder');

describe('Event Routes', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
    await eventSeeder.up(sequelize.getQueryInterface(), sequelize.constructor);
  });

  afterAll(async () => {
    await eventSeeder.down(
      sequelize.getQueryInterface(),
      sequelize.constructor,
    );
    await sequelize.close(); // Close the database connection
  });

  describe('/events/:id', () => {
    it('GET should return an event', async () => {
      // Arrange
      // Act
      const response = await request(app).get(
        '/events/1917eb1f-77da-4dec-9eae-a0762aec9fbd',
      );

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toBeTruthy();
      expect(response.body.id).toBe('1917eb1f-77da-4dec-9eae-a0762aec9fbd');
    });

    it('GET should return a 404 error if event does not exist', async () => {
      // Arrange
      // Act
      const response = await request(app).get(
        '/events/ffffffff-ffff-ffff-ffff-ffffffffffff',
      );

      // Assert
      expect(response.status).toBe(404);
    });
  });

  describe('/events', () => {
    it('GET should return a list of events', async () => {
      // Arrange
      // Act
      const response = await request(app).get('/events');

      // Assert
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('POST should create a new event', async () => {
      // Arrange
      const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
      const newEvent = {
        name: 'Cowboys vs Eagles',
        date: tomorrow,
        venue: 'AT&T Stadium',
      };

      // Act
      response = await request(app).post('/events').send(newEvent);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.name).toEqual(newEvent.name);
      expect(new Date(response.body.date)).toEqual(newEvent.date);
      expect(response.body.venue).toEqual(newEvent.venue);
      expect(response.body.total_tickets).toEqual(newEvent.total_tickets);
      expect(response.body.available_tickets).toEqual(newEvent.total_tickets);
    });

    it('POST should return a 400 bad request if missing required fields', async () => {
      // Arrange
      const newEvent = {
        // Mising multiple required fields
        name: 'Not Enough',
      };

      // Act
      response = await request(app).post('/events').send(newEvent);

      // Assert
      expect(response.status).toBe(400);
    });
  });
});
