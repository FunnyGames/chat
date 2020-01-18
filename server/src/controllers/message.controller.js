const messageServices = require('../services/message.service');
const logger = require('../common/logger')(__filename);

module.exports.getMessages = async (req, res, next) => {
    logger.info('getMessages');
    const userId = req.decoded.uid;
    const toUserId = req.body.toUserId;

    let response = await messageServices.getMessages(userId, toUserId);
    res.status(response.status).send(response.data);
}