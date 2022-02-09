const express = require('express');
const apiRouter = express.Router();

const minionsRouter = require('./minionsApi');
const ideasRouter = require('./ideasApi');
const meetingsRouter = require('./meetingsApi');

apiRouter.use('/minions', minionsRouter);
apiRouter.use('/ideas', ideasRouter);
apiRouter.use('/meetingts', meetingsRouter);

module.exports = apiRouter;
