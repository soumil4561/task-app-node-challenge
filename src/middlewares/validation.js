const Joi = require('joi');
const { sendError } = require('../utils/response');
const pick = require('../utils/pick');

const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' } })
    .validate(object);

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');
    return sendError(
      res,
      "VALIDATION_ERROR",
      "Request validation failed.",
      errorMessage,
      400
    );
  }

  Object.assign(req, value); // Add validated values to the request object
  return next();
};

module.exports = validate;
