const express = require('express');
const app = express();
const logger = require('./common/logger')(__filename);
const db = require('./startup/db');
const configMiddleware = require('./startup/middlewares');

logger.info('Starting server...');

async function connectDB() {
    const dbConnected = await db();
    if (!dbConnected) {
        logger.error('Connection to DB failed. Exiting.');
        process.exit(1);
    }
}
connectDB();

require('./startup/validation')();
configMiddleware.configure(app);
require('./startup/routes.js')(app);
require('./startup/config')();


const port = process.env.PORT || 5000;
const server = app.listen(port, () => logger.info(`Listening on port ${port}...`));

module.exports = server;