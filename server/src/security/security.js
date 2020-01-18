const jwt = require('jsonwebtoken');
const config = require('config');
const unsecureUrls = require('./unsecuredUrls');
const UrlPattern = require('url-pattern');
const sha256 = require('sha256');

// This will sign with data and key from config and return the JWT
module.exports.signJwt = (data) => {
    return jwt.sign(data, config.get('jwtPrivateKey'));
}

module.exports.isPublicUrl = (req) => {
    for (let i = 0; i < unsecureUrls.length; ++i) {
        let pattern = new UrlPattern(unsecureUrls[i]);
        if (pattern.match(req.url)) {
            return true;
        }
    }
    return false;
}

module.exports.generateDesKey = () => {
    return Math.random().toString(36).replace(/[^0-9a-z]+/g, '').substring(1, 20);
}

// Hash the password using sha256
module.exports.crypt = (password) => {
    return sha256(saltPassword(password));
}

// Validate password
module.exports.validatePassword = (password, passwordSalted) => {
    let salted = sha256(saltPassword(password));
    return salted === passwordSalted;
}

function saltPassword(password) {
    return password + '123';
}