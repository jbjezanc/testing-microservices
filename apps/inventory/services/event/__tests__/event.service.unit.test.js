const eventService = require('../event.service');
const { NotFoundError } = require('common-errors');

jest.mock('../../../dao/event.dao');
const eventDao = require('../../../dao/event.dao');

describe('Event Service', () => {
  describe('listEvents', () => {
    it('should list all events', async () => {
      // Arrange
      eventDao.listEvents.mockResolvedValue([{ id: 'abc123' }]);

      // Act
      const events = await eventService.listEvents();

      // Assert
      expect(events.length).toBeGreaterThan(0);
    });

    it('should throw an error if no events are found', async () => {
      // Arrange
      eventDao.listEvents.mockResolvedValue([]);

      // Act
      // Assert
      expect(eventService.listEvents()).rejects.toThrow(NotFoundError);
    });
  });
});
