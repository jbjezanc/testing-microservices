const orderDao = require('../../dao/order.dao');
const orderItemsDao = require('../../dao/orderItem.dao');
const paymentGateway = require('payment-gateway');
const orderPublisher = require('../../publishers/order.publisher');
const { NotFoundError } = require('common-errors');

async function createOrder(newOrder) {
  const orderRecord = await orderDao.createOrder(newOrder);
  await paymentGateway.chargeIt({
    total: newOrder.total,
    card_number: newOrder.paymentDetails?.cardNumber,
    state: newOrder.paymentDetails.state,
  });

  // Post message to orderCreated queue
  orderPublisher.sendOrderCreatedEvent({
    id: orderRecord.id,
    orderItems: newOrder.orderItems,
  });

  return orderRecord;
}

async function getOrder(orderId) {
  const order = await orderDao.getOrder(orderId);
  if (!order) {
    throw new NotFoundError(`order not found for id ${orderId}`);
  }
  const orderItems = await orderItemsDao.getOrderItems(orderId);
  const ticketIds = orderItems.map((orderItem) => orderItem.ticket_id);

  return { ...order, reserved_ticket_ids: ticketIds };
}

async function createOrderItems(orderId, ticketIds) {
  await orderDao.updateOrderStatus(orderId, 'complete');
  await orderItemsDao.createOrderItems(orderId, ticketIds);
}

async function deleteOrderItems(releasedInventory) {
  try {
    const ticketIds = releasedInventory.map((inventory) => inventory.ticket_id);
    await orderItemsDao.deleteOrderItems(ticketIds);
  } catch (e) {
    console.log('Error deleting order items for ticketIds', ticketIds);
    throw e;
  }
}

async function listOrders() {
  const orders = await orderDao.listOrders();
  if (!orders.length) {
    throw new NotFoundError(`No orders found`);
  }
  return orders;
}

module.exports = {
  createOrder,
  createOrderItems,
  getOrder,
  deleteOrderItems,
  listOrders,
};
