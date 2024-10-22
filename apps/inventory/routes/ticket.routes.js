const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket.controller');
const Joi = require('joi');
const middleware = require('common-middleware');

const ticketPostBodySchema = {
  path: 'body',
  schema: Joi.object({
    type: Joi.string()
      .valid('general_admission', 'vip', 'backstage_pass')
      .required(),
    event_id: Joi.string().max(128).required(),
    unit_price: Joi.number().positive().precision(2).required(),
    total_quantity: Joi.number().min(0).required(),
  }),
};

const ticketGetParamsSchema = {
  path: 'params',
  schema: Joi.object({
    id: Joi.string().min(36).max(36).required(),
  }),
};

const ticketValidationGetParamsSchema = {
  path: 'params',
  schema: Joi.object({
    token: Joi.string().min(36).max(36).required(),
  }),
};

const ticketsGetSchema = {
  path: 'query',
  schema: Joi.object().keys({
    limit: Joi.number(),
  }),
};

router
  .route('/')
  .post(
    middleware.validate(ticketPostBodySchema),
    ticketController.createTicket,
  )
  .get(middleware.validate(ticketsGetSchema), ticketController.listTickets);

router
  .route('/validation/:token')
  .get(
    middleware.validate(ticketValidationGetParamsSchema),
    ticketController.getTicketValidation,
  );

router
  .route('/:id')
  .get(middleware.validate(ticketGetParamsSchema), ticketController.getTicket)
  .delete(
    middleware.validate(ticketGetParamsSchema),
    ticketController.deleteTicket,
  );

module.exports = router;
