const router = require('express').Router();
const { Word } = require('../models');

// routes will go here to display stock information
router.get('/', (req, res) => {
    res.render('stockpage');
})

module.exports = router;
