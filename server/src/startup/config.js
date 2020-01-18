const config = require('config');

// This is used to check if config is loaded
module.exports = function () {
    if (!config.get('jwtPrivateKey')) {
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
    }
}