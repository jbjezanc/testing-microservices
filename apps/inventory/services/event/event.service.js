const db = require('../../db/models');
const { NotFoundError } = require('common-errors');
const eventDao = require('../../dao/event.dao');

async function getEvent(id) {
  const event = await db.event.findOne({
    where: {
      id,
    },
  });

  if (!event) {
    throw new NotFoundError(`event not found for id ${id}`);
  }
  return event.get({ plain: true });
}

async function listEvents() {
  const events = await eventDao.listEvents();

  if (!events.length) {
    throw new NotFoundError(`No events found`);
  }
  return events;
}

async function createEvent(newEvent) {
  const event = await db.event.create({
    name: newEvent.name,
    date: newEvent.date,
    venue: newEvent.venue,
  });
  return event.get({ plain: true });
}

module.exports = { getEvent, createEvent, listEvents };
