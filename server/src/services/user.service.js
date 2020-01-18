const logger = require('../common/logger')(__filename);
const userModel = require('../models/user.model');
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
            password
        };

        user = await userModel.create(data);

        let jwtData = {
            uid: user._id
        };

        let jwt = security.signJwt(jwtData);

        response = { jwt };
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
            logger.warn('Username or password are invalid');
            return responseError(c.SERVER_BAD_REQUEST_HTTP_CODE, c.USER_LOGIN_FAILED);
        }

        const validPassword = await security.validatePassword(password, user.password);
        if (!validPassword) {
            logger.warn('Username or password are invalid');
            return responseError(c.SERVER_BAD_REQUEST_HTTP_CODE, c.USER_LOGIN_FAILED);
        }

        let jwtData = {
            uid: user._id
        };

        let jwt = security.signJwt(jwtData);

        response = { jwt };
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