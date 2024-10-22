const express = require('express');
const middleware = require('common-middleware');
const Joi = require('joi');
const orderController = require('../controllers/order.controller');

const router = express.Router();

const orderPostBodySchema = {
  path: 'body',
  schema: Joi.object({
    customer_email: Joi.string().email().required(),
    payment_details: Joi.object({
      card_number: Joi.string().required(),
      state: Joi.string().required(),
    }).required(),
    total: Joi.number().min(0).required(),
    order_items: Joi.array()
      .items(
        Joi.object({
          event_id: Joi.string().required(),
          ticket_id: Joi.string().required(),
          quantity: Joi.number().min(1).required(),
        }),
      )
      .min(1)
      .required(),
  }),
};

const orderGetParamsSchema = {
  path: 'params',
  schema: Joi.object({
    id: Joi.string().required(),
  }),
};

router
  .route('/')
  .post(middleware.validate(orderPostBodySchema), orderController.createOrder);

router
  .route('/:id')
  .get(middleware.validate(orderGetParamsSchema), orderController.getOrder);

module.exports = router;
