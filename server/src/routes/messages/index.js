const express = require('express');
const router = express.Router();

const c = require('../../controllers/message.controller');
const v = require('../../validators/message.validator');

router.post('/get', v.getMessages, c.getMessages);

module.exports = router;