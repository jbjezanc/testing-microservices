const zmq = require('zeromq');

class OrderPublisher {
  constructor() {
    this.sock = zmq.socket('pub');
    this.sock.bindSync('tcp://127.0.0.1:3005');
    console.log('Publisher bound to port 3005');
  }

  destroy() {
    this.sock.unbindSync('tcp://127.0.0.1:3005');
    console.log('order publisher is unbound');
    OrderPublisher.instance = null;
  }

  // Create a single instance of the publisher
  static getInstance() {
    if (!OrderPublisher.instance) {
      OrderPublisher.instance = new OrderPublisher();
    }
    return OrderPublisher.instance;
  }

  sendOrderCreatedEvent(orderDetails, callback = () => {}) {
    const orderCreatedMessage = {
      order_id: orderDetails.id,
      order_items: orderDetails.orderItems,
    };

    this.sock.send(
      ['order.created', JSON.stringify(orderCreatedMessage)],
      undefined,
      (err) => {
        if (err) {
          callback(new Error('error publishing to order.created'));
          console.log('error publishing to order.created', err);
        }
        callback(null, 'success');
      },
    );
  }
}

// Export the instance to ensure it remains the same across requires
module.exports = OrderPublisher.getInstance();
