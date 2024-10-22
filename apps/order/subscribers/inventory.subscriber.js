const zmq = require('zeromq');
const orderService = require('../services/order/order.service');

function start() {
  const sock = zmq.socket('sub');
  sock.connect('tcp://127.0.0.1:3006');
  sock.subscribe('inventory.reserved');
  sock.subscribe('inventory.released');
  console.log('📥 Subscriber connected to port 3006');

  sock.on('message', (topic, message) => {
    console.log(
      'received a message related to:',
      topic.toString('utf-8'),
      'containing message:',
      message.toString('utf-8'),
    );

    // TODO: what happens if there's an error thrown? Does it crash this subscriber?
    switch (topic.toString('utf-8')) {
      case 'inventory.reserved': {
        const reservedInventory = JSON.parse(message);

        orderService.createOrderItems(
          reservedInventory.order_id,
          reservedInventory.ticket_ids,
        );
        break;
      }
      case 'inventory.released': {
        const releasedInventory = JSON.parse(message);

        orderService.deleteOrderItems(releasedInventory);
        break;
      }
    }
  });
}

module.exports = { start };
