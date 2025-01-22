const Joi = require('joi');
const password = require('./custom.validation');

const login = {
    body: Joi.object().keys({
        username: Joi.string().required(),
        password: Joi.string().required(),
    }),
}

const register = {
    body: Joi.object().keys({
        username: Joi.string().required(),
        password: Joi.string().required().custom(password),
    }),
}

module.exports = {
    login,
    register
}