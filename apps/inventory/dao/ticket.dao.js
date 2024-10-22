const db = require('../db/models');

async function createTicket(newTicket) {
  const createdTicket = await db.ticket.create({
    event_id: newTicket.eventId,
    type: newTicket.type,
    unit_price: newTicket.unitPrice,
    total_quantity: newTicket.totalQuantity,
    // Since this is a new ticket we set the available quantity to the total quantity
    available_quantity: newTicket.totalQuantity,
  });

  return createdTicket.get({ plain: true });
}

async function getTicket(ticketId) {
  return db.ticket.findByPk(ticketId);
}

async function getReservedTicket(reservedTicketId) {
  return db.reserved_ticket.findByPk(reservedTicketId);
}

async function deleteTicket(ticketId) {
  // This will also perfrom a cascade delete for reserved tickets associated
  // with this ticket ID
  return db.ticket.destroy({
    where: {
      id: ticketId,
    },
  });
}

async function reserveTickets(tickets) {
  const ticketsToReserve = tickets.map((ticket) => {
    return {
      order_id: ticket.orderId,
      ticket_id: ticket.ticketId,
    };
  });
  const reservedTickets = await db.reserved_ticket.bulkCreate(ticketsToReserve);

  const ticketIds = tickets.map((ticket) => ticket.ticketId);
  await db.ticket.decrement('available_quantity', {
    by: tickets.length,
    where: { id: { [db.Sequelize.Op.in]: ticketIds } },
  });

  return reservedTickets.map((reservedTicket) =>
    reservedTicket.get({ plain: true }),
  );
}

async function getReservedTickets(ticketId) {
  const reservedTickets = await db.reserved_ticket.findAll({
    where: {
      ticket_id: ticketId,
    },
  });

  return reservedTickets.map((reservedTicket) =>
    reservedTicket.get({ plain: true }),
  );
}

async function getTicketValidation(token) {
  const validation = await db.reserved_ticket.findOne({
    attributes: ['id', 'ticket_id'],
    where: {
      token,
    },
    include: [
      {
        model: db.ticket,
        attributes: ['event_id'],
      },
    ],
  });

  return validation?.get({ plain: true });
}

async function listTickets() {
  const tickets = await db.ticket.findAll();

  if (!tickets.length) {
    return [];
  }
  return tickets.map((ticket) => ticket.get({ plain: true }));
}

module.exports = {
  createTicket,
  getTicket,
  reserveTickets,
  deleteTicket,
  getReservedTickets,
  getTicketValidation,
  listTickets,
  getReservedTicket,
};
