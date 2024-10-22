class BadGatewayError extends Error {
  constructor(message) {
    super(message || 'BadGateway');
    this.name = 'BadGatewayError';
    this.status = 502;
  }
}

class BadRequestError extends Error {
  constructor(message) {
    super(message || 'BadRequest');
    this.name = 'BadRequestError';
    this.status = 400;
  }
}

class ForbiddenError extends Error {
  constructor(message) {
    super(message || 'Forbidden');
    this.name = 'ForbiddenError';
    this.status = 403;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message || 'Resource not found');
    this.name = 'NotFoundError';
    this.status = 404;
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message || 'Invalid authentication');
    this.name = 'UnauthorizedError';
    this.status = 401;
  }
}

class TicketAvailabilityError extends Error {
  constructor(message) {
    super(message || 'The requested ticket quanity is not available');
    this.name = 'TicketAvailabilityError';
    this.status = 404;
  }
}

module.exports = {
  BadGatewayError,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  TicketAvailabilityError,
};
