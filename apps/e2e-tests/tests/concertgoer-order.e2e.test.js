const orderAPIClient = require('../utils/order-api-client');
const inventoryAPIClient = require('../utils/inventory-api-client');

describe('As a concertgoer, when I place an order', () => {
  // As a user, when I place an order for event tickets, then my payment is
  // processed and tickets are reserved for each event that I purchased.
  it('should then create order and reserve tickets', async () => {
    // Arrange
    const newTicketRes1 = await inventoryAPIClient.createTicket({
      type: 'vip',
      event_id: '1917eb1f-77da-4dec-9eae-a0762aec9fbd',
      unit_price: 120.99,
      total_quantity: 100,
    });

    const newTicketRes2 = await inventoryAPIClient.createTicket({
      type: 'general_admission',
      event_id: '1917eb1f-77da-4dec-9eae-a0762aec9fbd',
      unit_price: 12.99,
      total_quantity: 100,
    });

    const newOrder = {
      customer_email: 'test@example.com',
      payment_details: {
        card_number: '1234567890123456',
        state: 'Utah',
      },
      total: 120.99,
      order_items: [
        {
          event_id: '1917eb1f-77da-4dec-9eae-a0762aec9fbd',
          ticket_id: newTicketRes1.data.id,
          quantity: 20,
        },
        {
          event_id: '1917eb1f-77da-4dec-9eae-a0762aec9fbd',
          ticket_id: newTicketRes2.data.id,
          quantity: 20,
        },
      ],
    };

    // Act
    const createResponse = await orderAPIClient.createOrder(newOrder);

    // Assert
    expect(createResponse.status).toEqual(201);
    expect(createResponse).toBeTruthy();
    expect(createResponse.data.id).toEqual(expect.any(String));
    expect(createResponse.data.status).toEqual('pending');

    const sleep = (ms) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };
    // creating an order is an async operation, i.e. the request returns immediately,
    // so we need to allow time for reserving tickets.
    await sleep(1000);

    // Act
    const getResponse = await orderAPIClient.getOrder(createResponse.data.id);

    // Assert
    expect(getResponse).toBeTruthy();
    expect(getResponse.status).toEqual(200);
    expect(getResponse.data.reserved_ticket_ids).toHaveLength(40);
  });
});
