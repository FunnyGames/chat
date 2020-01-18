const express = require('express');
const error = require('../middlewares/error.middleware');
const mainRoute = require('../routes');

// This configs all routes
module.exports = function (app) {
    app.use(express.json());
    app.use('/', mainRoute);
    app.use(error);
    app.use((req, res, next) => {
        res.status(404).send({ error: "Not found", data: null });
    });
}