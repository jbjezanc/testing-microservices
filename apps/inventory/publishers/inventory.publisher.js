const zmq = require('zeromq');

class InventoryPublisher {
  constructor() {
    this.sock = zmq.socket('pub');
    this.sock.bindSync('tcp://127.0.0.1:3006');
    console.log('Publisher bound to port 3006');
  }

  // Create a single instance of the publisher
  static getInstance() {
    if (!InventoryPublisher.instance) {
      InventoryPublisher.instance = new InventoryPublisher();
    }
    return InventoryPublisher.instance;
  }

  sendTicketsReservedEvent(orderId, reservedTickets) {
    const ticketIds = reservedTickets.map((ticket) => ticket.id);
    const ticketsReservedMessage = {
      order_id: orderId,
      ticket_ids: ticketIds,
    };

    this.sock.send(
      ['inventory.reserved', JSON.stringify(ticketsReservedMessage)],
      undefined,
      (err) => {
        if (err) {
          console.log('error publishing to inventory.reserved', err);
        }
      },
    );
  }

  sendTicketsReleasedEvent(releasedTickets) {
    const ticketsReleasedMessage = releasedTickets.map((releasedTicket) => {
      return {
        ticket_id: releasedTicket.id,
      };
    });

    this.sock.send(
      ['inventory.released', JSON.stringify(ticketsReleasedMessage)],
      undefined,
      (err) => {
        if (err) {
          console.log('error publishing to inventory.released', err);
        }
      },
    );
  }
}

// Export the instance to ensure it remains the same across requires
module.exports = InventoryPublisher.getInstance();
