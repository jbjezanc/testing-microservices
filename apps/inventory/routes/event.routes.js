const express = require('express');
const inventoryController = require('../controllers/event.controller');
const middleware = require('common-middleware');
const Joi = require('joi');

const router = express.Router();

const eventPostBodySchema = {
  path: 'body',
  schema: Joi.object({
    name: Joi.string().max(128).required(),
    date: Joi.date().min('now').required(),
    venue: Joi.string().max(256),
  }),
};

const eventGetParamsSchema = {
  path: 'params',
  schema: Joi.object({
    id: Joi.string().min(36).max(36).required(),
  }),
};

router
  .route('/')
  .post(
    middleware.validate(eventPostBodySchema),
    inventoryController.createEvent,
  )
  .get(inventoryController.listEvents);

router
  .route('/:id')
  .get(middleware.validate(eventGetParamsSchema), inventoryController.getEvent);

module.exports = router;
