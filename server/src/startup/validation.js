const Joi = require('joi');

// This is only to add object id validation to Joi
module.exports = function () {
    Joi.objectId = require('joi-objectid')(Joi);
}