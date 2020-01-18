const logger = require('../common/logger')(__filename);
const messageModel = require('../models/message.model');
const { responseSuccess, responseError } = require('../common/service-response');
const c = require('../common/constants');

module.exports.getMessages = async (userId, toUserId) => {
    logger.info('getMessages - userId: ' + userId + ', toUserId: ' + toUserId);

    let response = {};
    try {
        let condition = {
            $or: [
                {
                    toUserId: userId,
                    fromUserId: toUserId
                },
                {
                    toUserId,
                    fromUserId: userId
                }
            ]
        };
        let messages = await messageModel.find(condition).sort('-createDate');

        response = messages;
    } catch (e) {
        logger.error(e.message);
        return responseError(c.SERVER_ERROR_HTTP_CODE, c.SERVER_ERROR);
    }
    return responseSuccess(response);
}