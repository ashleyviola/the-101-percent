const router = require('express').Router();
const { Word } = require('../../models');


// GET all words
router.get('/', (req, res) => {
    Word.findAll({})
    .then(dbWordData => res.json(dbWordData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// GET word by ID
router.get('/:id', (req, res) => {
    Word.findOne({
        where: {
            id: req.params.id
        }
    })
    .then(dbWordData => {
        if (!dbWordData) {
            res.status(404).json({ message: 'No word found with this id' });
            return;
        }
        res.json(dbWordData);
    })
    .catch(err => {
        console.log(err);
        res.json(500).json(err);
    })
})

// POST new word
router.post('/', (req, res) => {
    Word.create({
        word_piece: req.body.word_piece,
        value: req.body.value
    })
    .then(dbWordData => {
        res.json(dbWordData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
})