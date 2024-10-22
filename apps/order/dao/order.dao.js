const db = require('../db/models');

async function createOrder(order) {
  const newOrder = await db.order.create({
    customer_email: order.customerEmail,
    total: order.total,
  });

  return newOrder.get({ plain: true });
}

async function updateOrderStatus(orderId, updatedStatus) {
  return db.order.update({ status: updatedStatus }, { where: { id: orderId } });
}

async function getOrder(orderId) {
  const order = await db.order.findByPk(orderId);
  if (!order) {
    return null;
  }
  return order.get({ plain: true });
}

async function listOrders() {
  const orders = await db.order.findAll();

  if (!orders.length) {
    return [];
  }
  return orders.map((order) => order.get({ plain: true }));
}

module.exports = { createOrder, updateOrderStatus, getOrder, listOrders };
