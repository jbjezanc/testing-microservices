const orderService = require('../services/order/order.service');

async function createOrder(req, res, next) {
  try {
    const order = await orderService.createOrder({
      customerEmail: req.body.customer_email,
      total: req.body.total,
      paymentDetails: {
        cardNumber: req.body.payment_details?.card_number,
        state: req.body.paymentDetails?.state,
      },
      orderItems: req.body.order_items,
    });
    res.status(201).json(order);
  } catch (e) {
    console.log('Error creating an order', e);
    next(e);
  }
}

async function getOrder(req, res, next) {
  try {
    const order = await orderService.getOrder(req.params.id);
    res.status(200).json(order);
  } catch (e) {
    console.log('Error getting an order', e);
    next(e);
  }
}

module.exports = {
  createOrder,
  getOrder,
};
