const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket.controller');
const Joi = require('joi');
const middleware = require('common-middleware');

const reservedticketGetParamsSchema = {
  path: 'params',
  schema: Joi.object({
    id: Joi.string().min(36).max(36).required(),
  }),
};

router
  .route('/:id')
  .get(
    middleware.validate(reservedticketGetParamsSchema),
    ticketController.getReservedTicket,
  );

module.exports = router;
