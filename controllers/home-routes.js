const router = require('express').Router();
const sequelize = require('../config/connection');
const { Word } = require('../models');

// routes will go here to display stock information
router.get('/', (req, res) => {
    res.send("hello!");
})






module.exports = router;
