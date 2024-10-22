const ticketDao = require('../../dao/ticket.dao');
const { TicketAvailabilityError, NotFoundError } = require('common-errors');
const inventoryPublisher = require('../../publishers/inventory.publisher');

async function createTicket(newTicket) {
  const createdTicket = await ticketDao.createTicket(newTicket);

  return {
    id: createdTicket.id,
    eventId: createdTicket.event_id,
    type: createdTicket.type,
    unitPrice: createdTicket.unit_price,
  };
}

async function reserveTickets(ticketsRequest) {
  try {
    const ticket = await ticketDao.getTicket(ticketsRequest.ticketId);
    if (!ticket) {
      return new TicketAvailabilityError('Requested ticket is not found');
    }
    if (
      ticket.available_quantity <= 0 ||
      ticket.available_quantity - ticketsRequest.quantity < 0
    ) {
      throw new TicketAvailabilityError();
    }

    let newTickets = [];
    for (let i = 0; i < ticketsRequest.quantity; i++) {
      newTickets.push({
        orderId: ticketsRequest.orderId,
        ticketId: ticketsRequest.ticketId,
      });
    }

    const reservedTickets = await ticketDao.reserveTickets(newTickets);
    inventoryPublisher.sendTicketsReservedEvent(
      ticketsRequest.orderId,
      reservedTickets,
    );
    return reservedTickets;
  } catch (e) {
    console.log('Error reserving tickets: ', e);
    throw e;
  }
}

async function getTicket(ticketId) {
  const ticket = await ticketDao.getTicket(ticketId);
  if (!ticket) {
    throw new NotFoundError(`ticket not found for id ${ticketId}`);
  }

  return ticket;
}

async function getReservedTicket(reservedTicketId) {
  const reservedTicket = await ticketDao.getReservedTicket(reservedTicketId);
  if (!reservedTicket) {
    throw new NotFoundError(
      `reserved ticket not found for id ${reservedTicketId}`,
    );
  }

  return reservedTicket;
}

async function deleteTicket(ticketId) {
  const reservedTicketsToRelease = await ticketDao.getReservedTickets(ticketId);
  // This will do a cascade delete of all reserved tickets associated to the ticket ID
  await ticketDao.deleteTicket(ticketId);
  inventoryPublisher.sendTicketsReleasedEvent(reservedTicketsToRelease);
}

async function listTickets() {
  const tickets = await ticketDao.listTickets();
  if (!tickets.length) {
    throw new NotFoundError(`No tickets found`);
  }
  return tickets;
}

async function getTicketValidation(token) {
  const validation = await ticketDao.getTicketValidation(token);
  if (!validation) {
    return {
      isValid: false,
    };
  }

  return {
    isValid: true,
    ticketId: validation.ticket_id,
    eventId: validation.ticket.event_id,
  };
}

module.exports = {
  reserveTickets,
  getReservedTicket,
  createTicket,
  getTicket,
  deleteTicket,
  listTickets,
  getTicketValidation,
};
