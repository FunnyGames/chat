const express = require('express');
const router = express.Router();

// Dummy service, has no meaning
router.use('/', (req, res) => {
    console.log(req.headers);
    res.status(200).send(req.headers);
});

module.exports = router;