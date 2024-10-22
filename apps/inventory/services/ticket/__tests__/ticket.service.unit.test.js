const ticketService = require('../ticket.service');
const ticketDao = require('../../../dao/ticket.dao');
const { NotFoundError } = require('common-errors');

jest.mock('../../../dao/ticket.dao', () => ({
  listTickets: jest.fn(),
}));
jest.mock('../../../publishers/inventory.publisher', () => ({}));

describe('Ticket Service', () => {
  describe('listTickets', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should list all tickets', async () => {
      // Arrange
      const mockTickets = [
        { id: 'abc123', event_id: '123abc', total_quantity: 120 },
        { id: 'def456', event_id: '456def', total_quantity: 150 },
      ];
      ticketDao.listTickets.mockResolvedValue(mockTickets);

      // Act
      const result = await ticketService.listTickets();

      // Assert
      expect(result).toEqual(mockTickets);
      expect(ticketDao.listTickets).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if no tickets are found', async () => {
      // Arrange
      ticketDao.listTickets.mockResolvedValue([]);

      // Act
      // Assert
      await expect(ticketService.listTickets()).rejects.toThrow(NotFoundError);
      expect(ticketDao.listTickets).toHaveBeenCalledTimes(1);
    });
  });
});
