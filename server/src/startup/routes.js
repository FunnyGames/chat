const express = require('express');
const error = require('../middlewares/error.middleware');
const mainRoute = require('../routes');
const { ROUTE_NOT_FOUND, SERVER_NOT_FOUND_HTTP_CODE } = require('../common/constants');

// This configs all routes
module.exports = function (app) {
    app.use(express.json());
    app.use('/', mainRoute);
    app.use(error);
    app.use((req, res, next) => {
        res.status(SERVER_NOT_FOUND_HTTP_CODE).send({ error: true, message: ROUTE_NOT_FOUND, data: null });
    });
}