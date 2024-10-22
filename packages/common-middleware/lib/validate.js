const { BadRequestError } = require('common-errors');

function validate(validationSchema) {
  return (req, res, next) => {
    const { schema, path } = validationSchema;
    const { error } = schema.validate(req[path]);
    if (error) {
      throw new BadRequestError(
        `Validation error: ${error.details[0].message}`,
      );
    }
    next();
  };
}

module.exports = validate;
