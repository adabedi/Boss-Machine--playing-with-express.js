const express = require('express');
const ideasRouter = express.Router();
const {getAllFromDatabase} = require('../db');

const DB_MODEL = 'ideas'

ideasRouter.get('/', (req, res) => {
    res.send(getAllFromDatabase(DB_MODEL))
})

ideasRouter.post('/', (req, res) => {
    
})

ideasRouter.get('/:id', (req, res) => {
    
})

ideasRouter.put('/:id', (req, res) => {
    
})

ideasRouter.delete('/:id', (req, res) => {
    
})

module.exports = ideasRouter;