const db = require('../db/models');

async function createOrderItems(orderId, ticketIds) {
  const orderItems = ticketIds.map((ticketId) => {
    return {
      order_id: orderId,
      ticket_id: ticketId,
    };
  });
  return db.order_item.bulkCreate(orderItems);
}

async function getOrderItems(orderId) {
  const orderItems = await db.order_item.findAll({
    where: {
      order_id: orderId,
    },
  });

  if (!orderItems.length) {
    return [];
  }
  return orderItems.map((orderItem) => orderItem.get({ plain: true }));
}

async function deleteOrderItems(ticketIds) {
  return db.order_item.destroy({
    where: {
      ticket_id: {
        [db.Sequelize.Op.in]: ticketIds,
      },
    },
  });
}

module.exports = { createOrderItems, deleteOrderItems, getOrderItems };
