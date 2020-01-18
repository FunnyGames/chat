const morgan = require('morgan');
const tokenValidation = require('../middlewares/token-validation.middleware');
const logger = require('../common/logger');
var cookieParser = require('cookie-parser');

// This will configure all middlewares
module.exports.configure = (app) => {
    // This allows us to use cookies
    app.use(cookieParser());

    // This is used for logger to get the API address and response status
    app.use(morgan('tiny', { 'stream': logger.stream }));

    // This is for validating token before allowing user to get to API
    app.use(tokenValidation.tokenValidation);
}