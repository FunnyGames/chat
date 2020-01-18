const logger = require('../common/logger')(__filename);
const userModel = require('../models/user.model');
const messageModel = require('../models/message.model');

module.exports.addSocketId = ({ userId, socketId }) => {
    logger.info(`addSocketId - userId: ${userId}, socketId: ${socketId}`);
    return userModel.updateOne({ _id: userId }, { $set: { socketId, online: 'Y' } });
}

module.exports.getUserInfo = (userId) => {
    logger.info(`getUserInfo - userId: ${userId}`);
    return userModel.findOne({ _id: userId }).select('username online _id');
}

module.exports.getSocketId = (userId) => {
    logger.info(`getSocketId - userId: ${userId}`);
    return userModel.findOne({ _id: userId }).select('socketId');
}

module.exports.getChatList = (userId) => {
    logger.info(`getChatList - userId: ${userId}`);
    return userModel.find({ socketId: { $ne: userId } }).select('username online _id');
}

module.exports.insertMessages = (data) => {
    logger.info(`insertMessages - data: ${JSON.stringify(data)}`);
    return messageModel.insertOne(data);
}

module.exports.logout = (userId) => {
    logger.info(`logout - userId: ${userId}`);
    return userModel.updateOne({ _id: userId }, { $set: { online: 'N' } });
}