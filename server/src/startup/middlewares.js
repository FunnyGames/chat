const morgan = require('morgan');
const tokenValidation = require('../middlewares/token-validation.middleware');
const logger = require('../common/logger');
var cookieParser = require('cookie-parser');
var cors = require('cors');


// This will configure all middlewares
module.exports = (app) => {
    // This allows for any hostname to connect
    var corsOptions = {
        credentials: true,
        origin: 'http://localhost:3000',
        optionsSuccessStatus: 200
    }
    app.use(cors(corsOptions));

    // This allows us to use cookies
    app.use(cookieParser());

    // This is used for logger to get the API address and response status
    app.use(morgan('tiny', { 'stream': logger.stream }));

    // This is for validating token before allowing user to get to API
    app.use(tokenValidation.tokenValidation);
}