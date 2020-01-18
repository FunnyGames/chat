const jwt = require('jsonwebtoken');
const config = require('config');
const logger = require('../common/logger')(__filename);
const security = require('../security/security');
const moment = require('moment');
const { jwtCookie } = require('../common/static');

module.exports.tokenValidation = (req, res, next) => {
    const token = req.headers['authorization'] || req.headers['Authorization'] || req.cookies['blogger_jwt'];
    logger.info('tokenValidation');
    if (token) {
        try {
            const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
            if (decoded) {
                // make sure that the token is still valid
                // iat - token creation in unix time
                // expirationPeriod is 30 days in config (30 * 24 * 60 * 60 seconds)
                const period = new Number(config.get('expirationPeriod'));
                if (decoded.iat + period < moment().unix()) {
                    logger.warn('Token has expired');
                    res.clearCookie(jwtCookie); // We delete cookie as it has expired
                    res.status(401).send({ error: 'Token has expired.', tokenExpired: true });
                    // Client should get tokenExpired and logout the user and redirect to login page
                    return;
                }
            }
            req.decoded = decoded;
            next();
        } catch (err) {
            logger.error('Invalid token');
            res.clearCookie(jwtCookie); // We delete cookie as it has expired
            res.status(400).send({ error: 'Invalid token.', tokenExpired: true })
        }
    } else {
        // If no token provided then check if it's a public link so guest can enter
        if (security.isPublicUrl(req)) {
            next();
            return;
        }
        // If not public link then return error
        logger.error('Token not provided');
        res.status(401).send({ error: 'Token not provided.', tokenExpired: true });
    }
}