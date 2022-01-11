const router = require('express').Router();

const wordRoutes = require('./word-routes');

router.use('/words', wordRoutes);

module.exports = router;