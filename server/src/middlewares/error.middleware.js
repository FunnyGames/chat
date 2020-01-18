const logger = require('../common/logger')(__filename);

// In case of unhandled error, it will send 500 and server error
// It should be avoided getting here
// If there's server error it should be fixed right away
module.exports = function (err, req, res, next) {
    logger.error(err.message);
    // We dont' send the error to client as we don't want to reveal any sensitive information
    res.status(500).send({ error: 'Something failed.' });
}