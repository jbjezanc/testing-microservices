const validate = require('./lib/validate');
const { notFound, errorHandler } = require('./lib/error-handler');

module.exports = {
  notFound,
  errorHandler,
  validate,
};
