const ticketService = require('../services/ticket/ticket.service');

async function createTicket(req, res, next) {
  try {
    const ticket = {
      eventId: req.body.event_id,
      type: req.body.type,
      unitPrice: req.body.unit_price,
      totalQuantity: req.body.total_quantity,
    };
    const newTicket = await ticketService.createTicket(ticket);
    res.status(201).json({
      id: newTicket.id,
      event_id: newTicket.eventId,
      type: newTicket.type,
      unit_price: newTicket.unitPrice,
    });
  } catch (e) {
    console.log('error creating ticket', e);
    next(e);
  }
}

async function getTicket(req, res, next) {
  try {
    const ticket = await ticketService.getTicket(req.params.id);
    res.status(200).json(ticket);
  } catch (e) {
    console.log('Error getting a ticket', e);
    next(e);
  }
}

async function getReservedTicket(req, res, next) {
  try {
    const reservedTicket = await ticketService.getReservedTicket(req.params.id);
    res.status(200).json(reservedTicket);
  } catch (e) {
    console.log('Error getting a reserved ticket', e);
    next(e);
  }
}

async function listTickets(req, res, next) {
  try {
    const tickets = await ticketService.listTickets();
    res.status(200).json(tickets);
  } catch (e) {
    console.log('Error getting tickets', e);
    next(e);
  }
}

// Why a separate ticket validation endpoint and not just reuse getTickets with a "token" query param?
// Because we want to encapsulate business logic in one place, ideally in the service layer, as much
// as possible. If we were to reuse getTickets with a token query param then we'd be returning an array
// of tickets to the consumer (UI) and letting the consumer perform the business logic of validating
// that the returned ticket array is only size 1 and, if not, handle the error. This way also enforces
// the Single Responsibility Principle better.
async function getTicketValidation(req, res, next) {
  try {
    const validation = await ticketService.getTicketValidation(
      req.params.token,
    );
    res.status(200).json({
      is_valid: validation.isValid,
      ticket_id: validation.ticketId,
      event_id: validation.eventId,
    });
  } catch (e) {
    console.log('Error getting ticket validation', e);
    next(e);
  }
}

async function deleteTicket(req, res, next) {
  try {
    const ticket = await ticketService.deleteTicket(req.params.id);
    res.status(200).json(ticket);
  } catch (e) {
    console.log('Error deleting a ticket', e);
    next(e);
  }
}

module.exports = {
  createTicket,
  getTicket,
  deleteTicket,
  listTickets,
  getTicketValidation,
  getReservedTicket,
};
