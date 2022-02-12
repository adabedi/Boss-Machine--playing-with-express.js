const express = require('express');

const ideasRouter = express.Router();
const {
  getAllFromDatabase,
  addToDatabase,
  updateInstanceInDatabase,
  deleteFromDatabasebyId,
} = require('../db');
const ideasSchema = require('../schema/ideasSchema');
const { numberParser, validateID } = require('./middlewareUtils');
const { validate } = require('../ErrorHandling');
const checkMillionDollarIdea = require('../checkMillionDollarIdea');

const DB_MODEL = 'ideas';
const NUMBER_TYPE_KEYS = ['numWeeks', 'weeklyRevenue'];

ideasRouter.param('id', validateID(DB_MODEL));

ideasRouter.get('/', (_, res) => {
  res.send(getAllFromDatabase(DB_MODEL));
});

ideasRouter.post(
  '/',
  numberParser(NUMBER_TYPE_KEYS),
  validate({ body: ideasSchema }),
  checkMillionDollarIdea,
  (req, res) => {
    const newIdea = addToDatabase(DB_MODEL, req.body);
    res.status(201).send(newIdea);
  },
);

ideasRouter.get('/:id', (req, res) => {
  res.status(200).send(req[DB_MODEL]);
});

ideasRouter.put(
  '/:id',
  numberParser(NUMBER_TYPE_KEYS),
  validate({ body: ideasSchema }),
  checkMillionDollarIdea,
  (req, res) => {
    const newIdea = updateInstanceInDatabase(DB_MODEL, req.body);
    res.status(200).send(newIdea);
  },
);

ideasRouter.delete('/:id', (req, res) => {
  deleteFromDatabasebyId(DB_MODEL, req.id);
  res.status(204).send();
});

module.exports = ideasRouter;
