const express = require('express');

const meetingsRouter = express.Router();
const meetingsSchema = require('../schema/meetingSchema');
const {
  getAllFromDatabase,
  addToDatabase,
  deleteFromDatabasebyId,
} = require('../db');
const { validate } = require('../ErrorHandling');
const { validateID } = require('./middlewareUtils');

const DB_MODEL = 'meetings';
meetingsRouter.param('id', validateID(DB_MODEL));

meetingsRouter.get('/', (_, res) => {
  res.send(getAllFromDatabase(DB_MODEL));
});

meetingsRouter.post('/', validate({ body: meetingsSchema }), (req, res) => {
  const newMeeting = addToDatabase(DB_MODEL, req.body);
  res.status(200).send(newMeeting);
});

meetingsRouter.delete('/:id', (req, res) => {
  deleteFromDatabasebyId(DB_MODEL, req.id);
  res.status(204).send();
});

module.exports = meetingsRouter;
