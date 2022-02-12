const express = require('express');

const meetingsRouter = express.Router();
const meetingsSchema = require('../schema/meetingSchema');
const {
  getAllFromDatabase,
  addToDatabase,
  deleteAllFromDatabase,
} = require('../db');
const { validate } = require('../ErrorHandling');

const DB_MODEL = 'meetings';

meetingsRouter.get('/', (_, res) => {
  res.send(getAllFromDatabase(DB_MODEL));
});

meetingsRouter.post('/', validate({ body: meetingsSchema }), (req, res) => {
  const newMeeting = addToDatabase(DB_MODEL, req.body);
  res.status(201).send(newMeeting);
});

meetingsRouter.delete('/', (_, res) => {
  deleteAllFromDatabase(DB_MODEL);
  res.status(204).send();
});

module.exports = meetingsRouter;
