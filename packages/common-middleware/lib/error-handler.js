const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const { NotFoundError } = require('common-errors');

// API error handler
function errorHandler(err, req, res, next) {
  const response = {
    code: err.status || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || getReasonPhrase[err.status],
  };

  res.status(response.code);
  res.json(response);
  res.end();
}

// Catch 404 and forward to error handler
function notFound(req, res) {
  return errorHandler(new NotFoundError(), req, res);
}

module.exports = { errorHandler, notFound };
