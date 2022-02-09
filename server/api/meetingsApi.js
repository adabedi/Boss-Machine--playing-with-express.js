const express = require('express');
const meetingsRouter = express.Router();
const {getAllFromDatabase} = require('../db');

const DB_MODEL = 'meetings'

meetingsRouter.get('/', (req, res) => {
    res.send(getAllFromDatabase(DB_MODEL))
})

meetingsRouter.post('/', (req, res) => {
    
})

meetingsRouter.delete('/:id', (req, res) => {
    
})

module.exports = meetingsRouter;