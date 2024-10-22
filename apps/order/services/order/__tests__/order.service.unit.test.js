const orderService = require('../../order/order.service');
const { NotFoundError } = require('common-errors');
const orderDao = require('../../../dao/order.dao');

jest.mock('../../../dao/order.dao');
jest.mock('../../../publishers/order.publisher', () => ({}));

describe('Order Service', () => {
  describe('listOrders', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should list all orders', async () => {
      // Arrange
      const mockOrders = [{ id: 'abc123' }, { id: 'def456' }];
      orderDao.listOrders.mockResolvedValue(mockOrders);

      // Act
      const result = await orderService.listOrders();

      // Assert
      expect(result).toEqual(mockOrders);
      expect(orderDao.listOrders).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if no orders are found', async () => {
      // Arrange
      orderDao.listOrders.mockResolvedValue([]);

      // Act
      // Assert
      await expect(orderService.listOrders()).rejects.toThrow(NotFoundError);
      expect(orderDao.listOrders).toHaveBeenCalledTimes(1);
    });
  });
});
