const inventoryAPIClient = require('../utils/inventory-api-client');
const orderAPIClient = require('../utils/order-api-client');

describe('As a concertgoer, when I lookup reserved tickets', () => {
  // As a concert goer, when I lookup my reserved tickets,
  // then I am able to scan them for entry into an event.
  it('should validate reserved ticket by token', async () => {
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
    const createResponse = await orderAPIClient.createOrder(newOrder);
    const sleep = (ms) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };
    await sleep(1000);
    const getResponse = await orderAPIClient.getOrder(createResponse.data.id);
    const reservedTicketIds = getResponse.data.reserved_ticket_ids;

    // Act
    const reservedTicketRequests = reservedTicketIds.map((id) =>
      inventoryAPIClient.getReservedTicket(id),
    );
    const reservedTicketResponses = await Promise.all(reservedTicketRequests);

    // Assert
    expect(reservedTicketResponses.length).toEqual(40);
    reservedTicketResponses.forEach((response) => {
      expect(response.status).toEqual(200);
    });

    const ticketValidationRequests = reservedTicketResponses.map((response) =>
      inventoryAPIClient.getTicketValidation(response.data.token),
    );

    const ticketValidationResponses = await Promise.all(
      ticketValidationRequests,
    );

    expect(ticketValidationResponses.length).toEqual(40);
    ticketValidationResponses.forEach((response) => {
      expect(response.status).toEqual(200);
      expect(response.data.is_valid).toEqual(true);
    });
  });
});
