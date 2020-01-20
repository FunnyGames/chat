const logger = require('../common/logger')(__filename);
const userModel = require('../models/user.model');
const userToUserModel = require('../models/key.model');
const security = require('../security/security');
const { responseSuccess, responseError } = require('../common/service-response');
const c = require('../common/constants');

module.exports.register = async (username, password) => {
    logger.info('register - username: ' + username);

    let response = {};
    try {
        let user = await userModel.findOne({ username: username.toLowerCase() });
        if (user) {
            logger.warn('Username already exists');
            return responseError(c.SERVER_BAD_REQUEST_HTTP_CODE, c.USERNAME_AVAILABLE_FAILED);
        }

        password = await security.crypt(password);
        let data = {
            username,
            password,
            online: 'Y'
        };

        user = await userModel.create(data);

        let jwtData = {
            uid: user._id
        };

        let jwt = security.signJwt(jwtData);

        response = { jwt, userId: user._id };
    } catch (e) {
        logger.error(e.message);
        return responseError(c.SERVER_ERROR_HTTP_CODE, c.SERVER_ERROR);
    }
    return responseSuccess(response);
}

module.exports.login = async (username, password) => {
    logger.info('login - username: ' + username);

    let response = {};
    try {
        let user = await userModel.findOne({ username: username.toLowerCase() });
        if (!user) {
            logger.warn('Username not found');
            return responseError(c.SERVER_BAD_REQUEST_HTTP_CODE, c.USER_LOGIN_FAILED);
        }
        if (user.online === 'Y') {
            logger.warn('User is online');
            return responseError(c.SERVER_BAD_REQUEST_HTTP_CODE, c.USER_ALREADY_LOGGED_IN);
        }

        const validPassword = await security.validatePassword(password, user.password);
        if (!validPassword) {
            logger.warn('Password is invalid');
            return responseError(c.SERVER_BAD_REQUEST_HTTP_CODE, c.USER_LOGIN_FAILED);
        }

        let jwtData = {
            uid: user._id
        };

        let jwt = security.signJwt(jwtData);

        await userModel.updateOne({ _id: user._id }, { $set: { online: 'Y' } });

        response = { jwt, userId: user._id };
    } catch (e) {
        logger.error(e.message);
        return responseError(c.SERVER_ERROR_HTTP_CODE, c.SERVER_ERROR);
    }
    return responseSuccess(response);
}

module.exports.usernameAvailable = async (username) => {
    logger.info('usernameAvailable - username: ' + username);

    let response = {};
    try {
        let message = c.USERNAME_AVAILABLE_OK;
        let error = false;

        let count = await userModel.count({ username: username.toLowerCase() });

        if (count > 0) {
            error = true;
            message = c.USERNAME_AVAILABLE_FAILED;
        }

        response = {
            error,
            message
        };
    } catch (e) {
        logger.error(e.message);
        return responseError(c.SERVER_ERROR_HTTP_CODE, c.SERVER_ERROR);
    }
    return responseSuccess(response);
}

module.exports.getChatDesKey = async (userId, otherUserId) => {
    logger.info('getChatDesKey - userId: ' + userId + ', otherUserId: ' + otherUserId);

    let response = {};
    try {
        if (userId === otherUserId) {
            logger.error('User ids are identical');
            return responseError(c.SERVER_BAD_REQUEST_HTTP_CODE, c.USER_IDS_IDENTICAL);
        }

        let user = await userModel.findOne({ _id: otherUserId });
        if (!user) {
            logger.error('User not found');
            return responseError(c.SERVER_NOT_FOUND_HTTP_CODE, c.USER_NOT_FOUND);
        }

        let condition = {
            $or: [
                {
                    user1: userId,
                    user2: otherUserId
                },
                {
                    user1: otherUserId,
                    user2: userId
                }
            ]
        };

        let res = await userToUserModel.findOne(condition);

        if (!res) {
            let data = {
                user1: userId,
                user2: otherUserId,
                key: security.generateDesKey()
            };
            res = await userToUserModel.create(data);
        }

        response = { key: res.key };
    } catch (e) {
        logger.error(e.message);
        return responseError(c.SERVER_ERROR_HTTP_CODE, c.SERVER_ERROR);
    }
    return responseSuccess(response);
}

module.exports.getChatDesKeys = async (userId) => {
    logger.info('getChatDesKeys - userId: ' + userId);

    let response = {};
    try {
        let condition = {
            $or: [
                {
                    user1: userId
                },
                {
                    user2: userId
                }
            ]
        };

        let res = await userToUserModel.find(condition).select('key user1 user2 -_id');

        response = { keys: res };
    } catch (e) {
        logger.error(e.message);
        return responseError(c.SERVER_ERROR_HTTP_CODE, c.SERVER_ERROR);
    }
    return responseSuccess(response);
}

module.exports.checkSession = async (userId) => {
    logger.info('checkSession - userId: ' + userId);

    let response = {};
    try {
        let res = await userModel.findOne({ _id: userId, online: 'Y' }).select('username -_id');
        if (!res) {
            logger.error('User is not online');
            return responseError(c.SERVER_BAD_REQUEST_HTTP_CODE, c.USER_LOGGED_OUT);
        }

        response = { username: res.username };
    } catch (e) {
        logger.error(e.message);
        return responseError(c.SERVER_ERROR_HTTP_CODE, c.SERVER_ERROR);
    }
    return responseSuccess(response);
}