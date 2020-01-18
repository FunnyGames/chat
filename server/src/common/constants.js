// Cookies
module.exports.JWT_COOKIE = 'jwt_blogger';

// Validation related
module.exports.USER_NOT_FOUND = `User does not exits.`;
module.exports.MESSAGE_NOT_FOUND = `Message can't be empty.`;
module.exports.SELECT_USER = `Select a user to chat.`;

// General Errors
module.exports.MESSAGE_STORE_ERROR = `Could not store messages, server error.`;
module.exports.ROUTE_NOT_FOUND = `You are at wrong place. Shhoooo...`;
module.exports.SERVER_ERROR_MESSAGE = `Something bad happend. It's not you, it's me.`;

// Authorization
module.exports.TOKEN_EXPIRED_ERROR = `Token has expired.`;
module.exports.INVALID_TOKEN_ERROR = `Invalid token.`;
module.exports.TOKEN_NOT_PROVIDED_ERROR = `Token not provided.`;

// HTTP status code
module.exports.SERVER_OK_HTTP_CODE = 200;
module.exports.SERVER_BAD_REQUEST_HTTP_CODE = 400;
module.exports.NOT_AUTHORIZED_HTTP_CODE = 401;
module.exports.SERVER_NOT_FOUND_HTTP_CODE = 404;
module.exports.SERVER_ERROR_HTTP_CODE = 500;
module.exports.SERVER_NOT_ALLOWED_HTTP_CODE = 503;

// Route related
module.exports.USERNAME_AVAILABLE_FAILED = `Username is unavailable.`;
module.exports.USER_LOGIN_FAILED = `Username or password are invalid.`;
module.exports.USERNAME_AVAILABLE_OK = `Username is available.`;
module.exports.USER_LOGGED_OUT = `User is not logged in.`;
module.exports.USER_IDS_IDENTICAL = `User ids are identical.`;