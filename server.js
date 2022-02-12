const express = require('express');

const app = express();

const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('morgan');

const apiRouter = require('./server/api/api');
const { validationErrorMiddleware } = require('./server/ErrorHandling');

module.exports = app;

/* Do not change the following line! It is required for testing and allowing
 *  the frontend application to interact as planned with the api server
 */
const PORT = process.env.PORT || 4001;
const checkMillionDollarIdea = (req, res, next) => {
  const { numWeeks, weeklyRevenue } = req.body;
  const ideaWorth = numWeeks * weeklyRevenue;
  if (ideaWorth < 1000000) {
    const err = Error('It is not one million dollarIdea');
    err.status = 400;
    return next(err);
  }
  return next();
};
app.use(bodyParser.json());
app.use(cors());
app.use(logger('dev'));

app.use('/api', apiRouter);
app.use('/api/ideas', checkMillionDollarIdea)

app.use(validationErrorMiddleware);

// This conditional is here for testing purposes:
if (!module.parent) {
  app.listen(PORT);
}
