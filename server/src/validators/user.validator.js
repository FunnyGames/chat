const logger = require('../common/logger')(__filename);
const { SERVER_BAD_REQUEST_HTTP_CODE } = require('../common/constants');
const Joi = require('joi');

const jUsername = Joi.string().alphanum().min(5).max(120);
const jPassword = Joi.string().min(5).max(120);
const jUserId = Joi.objectId();

module.exports.register = (req, res, next) => {
    logger.info('register');
    const schema = {
        username: jUsername.required(),
        password: jPassword.required()
    };

    const result = Joi.validate(req.body, schema);
    if (result.error) {
        return res.status(SERVER_BAD_REQUEST_HTTP_CODE).send({ error: true, message: result.error.details[0].message });
    }
    next();
}

module.exports.usernameAvailable = (req, res, next) => {
    logger.info('usernameAvailable');
    const schema = {
        username: jUsername.required()
    };

    const result = Joi.validate(req.body, schema);
    if (result.error) {
        return res.status(SERVER_BAD_REQUEST_HTTP_CODE).send({ error: true, message: result.error.details[0].message });
    }
    next();
}

module.exports.getChatDesKey = (req, res, next) => {
    logger.info('getChatDesKey');
    const schema = {
        userId: jUserId.required()
    };

    const result = Joi.validate(req.body, schema);
    if (result.error) {
        return res.status(SERVER_BAD_REQUEST_HTTP_CODE).send({ error: true, message: result.error.details[0].message });
    }
    next();
}