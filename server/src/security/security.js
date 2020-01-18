const jwt = require('jsonwebtoken');
const config = require('config');
const unsecureUrls = require('./unsecuredUrls');
const UrlPattern = require('url-pattern');

// This will sign with data and key from config and return the JWT
module.exports.signJwt = (data) => {
    return jwt.sign(data, config.get('jwtPrivateKey'));
}

// This checks if the url is unsecured - meaning that guest can get to API
module.exports.isPublicUrl = (req) => {
    // Allow only GET requests
    if (req.method === 'GET') {
        for (let i = 0; i < unsecureUrls.length; ++i) {
            let pattern = new UrlPattern(unsecureUrls[i]);
            if (pattern.match(req.url)) {
                return true;
            }
        }
    }
    return false;
}

// Hash the password using bcrypt
module.exports.crypt = (password) => {
    return sha256(saltPassword(password));
}

// Validate password
module.exports.validatePassword = (password, passwordSalted) => {
    let salted = saltPassword(password);
    return salted === passwordSalted;
}

function saltPassword(password) {
    return password + '123';
}