const express = require('express');

const minionsRouter = express.Router();

const {
  getAllFromDatabase,
  addToDatabase,
  updateInstanceInDatabase,
  deleteFromDatabasebyId,
} = require('../db');

const DB_MODEL = 'minions';
const NUMBER_TYPE_KEYS = ['salary'];

const { validate } = require('../ErrorHandling');
const minionsSchema = require('../schema/minionsSchema');
const { numberParser, validateID } = require('./middlewareUtils');

minionsRouter.param('id', validateID(DB_MODEL));

minionsRouter.get('/', (_, res) => {
  res.send(getAllFromDatabase(DB_MODEL));
});

minionsRouter.post(
  '/',
  numberParser(NUMBER_TYPE_KEYS),
  validate({ body: minionsSchema }),
  (req, res) => {
    const newMiniona = addToDatabase(DB_MODEL, req.body);
    res.status(200).send(newMiniona);
  },
);

minionsRouter.get('/:id', (req, res) => {
  res.status(200).send(req[DB_MODEL]);
});

minionsRouter.put(
  '/:id',
  numberParser(NUMBER_TYPE_KEYS),
  validate({ body: minionsSchema }),
  (req, res) => {
    const newMiniona = updateInstanceInDatabase(DB_MODEL, req.body);
    res.status(200).send(newMiniona);
  },
);

minionsRouter.delete('/:id', (req, res) => {
  deleteFromDatabasebyId(DB_MODEL, req.id);
  res.status(204).send();
});

module.exports = minionsRouter;
