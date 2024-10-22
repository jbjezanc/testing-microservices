const db = require('../db/models');

async function listEvents() {
  const events = await db.event.findAll();

  if (!events.length) {
    return [];
  }
  return events.map((event) => event.get({ plain: true }));
}

module.exports = {
  listEvents,
};
