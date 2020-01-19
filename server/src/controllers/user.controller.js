const userServices = require('../services/user.service');
const { JWT_COOKIE, SERVER_OK_HTTP_CODE } = require('../common/constants');
const logger = require('../common/logger')(__filename);

module.exports.register = async (req, res, next) => {
    logger.info('register');
    const username = req.body.username;
    const password = req.body.password;

    let response = await userServices.register(username, password);
    if (response.status != SERVER_OK_HTTP_CODE) {
        res.status(response.status).send(response.data);
    } else {
        res.cookie(JWT_COOKIE, response.data.jwt);
        res.send({ userId: response.data.userId });
    }
}

module.exports.login = async (req, res, next) => {
    logger.info('login');
    const username = req.body.username;
    const password = req.body.password;

    let response = await userServices.login(username, password);
    if (response.status != SERVER_OK_HTTP_CODE) {
        res.status(response.status).send(response.data);
    } else {
        res.cookie(JWT_COOKIE, response.data.jwt);
        res.send({ userId: response.data.userId });
    }
}

module.exports.usernameAvailable = async (req, res, next) => {
    logger.info('usernameAvailable');
    const username = req.body.username;

    let response = await userServices.usernameAvailable(username);
    res.status(response.status).send(response.data);
}

module.exports.getChatDesKey = async (req, res, next) => {
    logger.info('getChatDesKey');
    const userId = req.decoded.uid;
    const otherUserId = req.body.userId;

    let response = await userServices.getChatDesKey(userId, otherUserId);
    res.status(response.status).send(response.data);
}

module.exports.getChatDesKeys = async (req, res, next) => {
    logger.info('getChatDesKeys');
    const userId = req.decoded.uid;

    let response = await userServices.getChatDesKeys(userId);
    res.status(response.status).send(response.data);
}

module.exports.checkSession = async (req, res, next) => {
    logger.info('checkSession');
    const userId = req.decoded.uid;

    let response = await userServices.checkSession(userId);
    res.status(response.status).send(response.data);
}