const express = require('express');
const { ngettext } = require('mocha/lib/utils');
const minionsRouter = express.Router();

const {getAllFromDatabase, addToDatabase, updateInstanceInDatabase, getFromDatabaseById} = require('../db');
const DB_MODEL = 'minions'

const {validate} = require('../ErrorHandling')
const minionsSchema =  require('../schema/minionsSchema')

minionsRouter.param('id', (req,res, next, id) => {
    const exits = getFromDatabaseById(DB_MODEL, req.params.id)
    if(!exits) {
        const err = Error('Invalid id!');
        err.status = 404;
        return next(err);
    }
    req.minion = exits;
    next()
})

minionsRouter.get('/', (req, res) => {
    res.send(getAllFromDatabase(DB_MODEL))
})

minionsRouter.post('/', validate({body: minionsSchema}), (req, res, next) => {
    const newMiniona = addToDatabase(DB_MODEL,req.body);
    res.status(200).send(newMiniona);
    next()
})

minionsRouter.get('/:id', (req, res) => {
    res.status(200).send(req.minion);
})

minionsRouter.put('/:id', validate({body: minionsSchema}), (req, res, next) => {
    const newMiniona = updateInstanceInDatabase(DB_MODEL,req.body);
    res.status(200).send(newMiniona);
    next()
})

minionsRouter.delete('/:id', (req, res) => {
    deleteFromDatabasebyId(DB_MODEL, req.body)
    res.status(204).send();
})

module.exports = minionsRouter;