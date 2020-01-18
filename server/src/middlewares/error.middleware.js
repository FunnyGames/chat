const logger = require('../common/logger')(__filename);
const { SERVER_ERROR_HTTP_CODE, SERVER_ERROR_MESSAGE } = require('../common/constants');

module.exports = function (err, req, res, next) {
    logger.error(err.message);
    // We dont' send the error to client as we don't want to reveal any sensitive information
    res.status(SERVER_ERROR_HTTP_CODE).send({ error: true, message: SERVER_ERROR_MESSAGE });
}