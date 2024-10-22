const inventoryService = require('../services/event/event.service');

async function getEvent(req, res, next) {
  try {
    const event = await inventoryService.getEvent(req.params.id);
    res.json(event);
  } catch (e) {
    console.log('Error getting an event', e);
    next(e);
  }
}

async function listEvents(req, res, next) {
  try {
    const events = await inventoryService.listEvents();
    res.json(events);
  } catch (e) {
    console.log('Error listing events', e);
    next(e);
  }
}

async function createEvent(req, res, next) {
  try {
    const event = await inventoryService.createEvent(req.body);
    res.status(201).json(event);
  } catch (e) {
    console.log('Error creating an event', e);
    next(e);
  }
}

module.exports = {
  getEvent,
  listEvents,
  createEvent,
};
