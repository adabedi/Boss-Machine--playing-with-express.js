const express = require('express');
const {
  getAllFromDatabase,
  addToDatabase,
  updateInstanceInDatabase,
  deleteAllFromDatabase,
} = require('../db');

const workRouter = express.Router();

const DB_MODEL = 'work';

workRouter.param('id', (req, _, next, id) => {
  const work = getAllFromDatabase(DB_MODEL, id);
  if (!work) {
    const err = Error('Invalid id!');
    err.status = 404;
    return next(err);
  }
  req.work = work;
  req.workId = id;
  return next();
});

workRouter.get('/', (req, res) => {
  const searchedWork = getAllFromDatabase(DB_MODEL).filter(
    (work) => work.minionId === req.id,
  );
  return res.status(200).send(searchedWork);
});

workRouter.post('/', (req, res) => {
  const newWork = addToDatabase(DB_MODEL, {
    ...req.body,
    minionId: req.id,
  });
  res.status(201).send(newWork);
});

workRouter.put('/:id', (req, res, next) => {
  if (req.body.minionId !== req.id) {
    const err = Error('MinionId in updating object was wrong');
    err.status = 400;
    return next(err);
  }
  const updated = updateInstanceInDatabase(DB_MODEL, req.body);
  return res.status(200).send(updated);
});

workRouter.delete('/:id', (req, res) => {
  deleteAllFromDatabase(DB_MODEL, req.workId);
  res.status(204).send();
});

module.exports = workRouter;
