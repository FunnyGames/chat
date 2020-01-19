const logger = require('../common/logger')(__filename);
const userModel = require('../models/user.model');
const messageModel = require('../models/message.model');

module.exports.addSocketId = async ({ userId, socketId }) => {
    logger.info(`addSocketId - userId: ${userId}, socketId: ${socketId}`);
    let res = null;
    try {
        res = await userModel.updateOne({ _id: userId }, { $set: { socketId, online: 'Y' } });
    } catch (error) {
        logger.error(error);
    }
    return res;
}

module.exports.getUserInfo = async (userId) => {
    logger.info(`getUserInfo - userId: ${userId}`);
    let res = null;
    try {
        res = await userModel.findOne({ _id: userId }).select('username online _id');
    } catch (error) {
        logger.error(error);
    }
    return res;
}

module.exports.getSocketId = async (userId) => {
    logger.info(`getSocketId - userId: ${userId}`);
    let res = null;
    try {
        res = await userModel.findOne({ _id: userId }).select('socketId');
        if (!res) {
            logger.error('User not found');
            return null;
        }
        res = res.socketId;
    } catch (error) {
        logger.error(error);
    }
    return res;
}

module.exports.getChatList = async (socketId) => {
    logger.info(`getChatList - socketId: ${socketId}`);
    let res = null;
    try {
        res = await userModel.find({ socketId: { $ne: socketId } }).select('username online _id');
    } catch (error) {
        logger.error(error);
    }
    return res;
}

module.exports.insertMessages = async (data) => {
    logger.info(`insertMessages - data: ${JSON.stringify(data)}`);
    let res = null;
    try {
        res = await messageModel.insertMany([data]);
    } catch (error) {
        logger.error(error);
    }
    return res;
}

module.exports.logout = async (userId) => {
    logger.info(`logout - userId: ${userId}`);
    let res = null;
    try {
        res = await userModel.updateOne({ _id: userId }, { $set: { online: 'N' } });
    } catch (error) {
        logger.error(error);
    }
    return res;
}