const c = require('../common/constants');

const responseWrapper = (status, data) => {
    let res = { status, data };
    return res;
}

module.exports.responseWrapper = responseWrapper;

module.exports.responseSuccess = (data) => {
    return responseWrapper(c.SERVER_OK_HTTP_CODE, data);
}
module.exports.responseError = (status, error, data = null) => {
    return responseWrapper(status, { error: true, message: error, data });
}