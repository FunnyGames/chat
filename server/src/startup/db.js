const mongoose = require('mongoose');
const config = require('config');
const logger = require('../common/logger')(__filename);

// This connects to DB - the function will return true if succeed and false otherwise
module.exports = async function () {
    const db = config.get('db');
    try {
        await mongoose.connect(db);
        logger.info(`Connected to ${db}...`);
    } catch (err) {
        logger.error('Mongo did not connect to db: ' + err.message)
        return false;
    }
    return true;
}