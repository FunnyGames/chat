const express = require('express');
const app = express();
const logger = require('./common/logger')(__filename);
const http = require('http');
const socketio = require('socket.io');
const db = require('./startup/db');

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
require('./startup/middlewares')(app);
require('./startup/routes.js')(app);
require('./startup/config')();

const httpServer = http.Server(app);
const socket = socketio(httpServer);
require('./socket/socket')(socket);

const port = process.env.PORT || 5000;
const host = process.env.HOST || `localhost`;
httpServer.listen(port, host, () => logger.info(`Listening on http://${host}:${port}...`));

module.exports = httpServer;