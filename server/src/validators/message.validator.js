const logger = require('../common/logger')(__filename);
const { SERVER_BAD_REQUEST_HTTP_CODE } = require('../common/constants');
const Joi = require('joi');

const jUserId = Joi.objectId();

module.exports.getMessages = (req, res, next) => {
    logger.info('getMessages');
    const schema = {
        toUserId: jUserId.required()
    };

    const result = Joi.validate(req.body, schema);
    if (result.error) {
        return res.status(SERVER_BAD_REQUEST_HTTP_CODE).send({ error: true, message: result.error.details[0].message });
    }
    next();
}