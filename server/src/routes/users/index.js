const express = require('express');
const router = express.Router();

const c = require('../../controllers/user.controller');
const v = require('../../validators/user.validator');

router.post('/register', v.register, c.register);
router.post('/login', v.register, c.login);
router.post('/available', v.usernameAvailable, c.usernameAvailable);

router.get('/check', c.checkSession);
router.post('/key', v.getChatDesKey, c.getChatDesKey);
router.get('/keys', c.getChatDesKeys);

module.exports = router;