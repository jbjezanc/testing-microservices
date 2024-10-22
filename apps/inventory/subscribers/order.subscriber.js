const ticketService = require('../services/ticket/ticket.service');
const zmq = require('zeromq');

class OrderSubscriber {
  constructor() {
    this.sock = zmq.socket('sub');
  }

  start() {
    this.sock.connect('tcp://127.0.0.1:3005');
    this.sock.subscribe('order.created');
    this._initHandler();
    console.log('📥 Subscriber connected to port 3005');
  }

  stop() {
    this.sock.unsubscribe('order.created');
    this.sock.disconnect('tcp://127.0.0.1:3005');
    console.log('order subscriber stopped');
  }

  _initHandler() {
    this.sock.on('message', async (topic, message) => {
      console.log(
        'received a message related to:',
        topic.toString('utf-8'),
        'containing message:',
        message.toString('utf-8'),
      );
      const orderDetails = JSON.parse(message);

      for (const orderItem of orderDetails.order_items) {
        await ticketService.reserveTickets({
          orderId: orderDetails.order_id,
          eventId: orderItem?.event_id,
          ticketId: orderItem?.ticket_id,
          quantity: orderItem?.quantity,
        });
      }

      // Let the listener know we've reserved tickets
      if (this._listener) {
        this._listener.notify();
      }
    });
  }

  registerListener(callback) {
    this._listener = {
      notify: callback,
    };
  }
}

module.exports = OrderSubscriber;
