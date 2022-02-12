const { getFromDatabaseById } = require('../db');

const checkNumberType = (_body, keys) => {
  const body = { ..._body };
  keys.forEach((key) => {
    const convertedToNumber = Number(_body[key]);
    if (!Number.isNaN(convertedToNumber)) {
      body[key] = convertedToNumber;
    }
  });
  return body;
};

const numberParser = (keys) => (req, _, next) => {
  req.body = checkNumberType(req.body, keys);
  next();
};

const validateID = (dbModel) => (req, _, next, id) => {
  const exits = getFromDatabaseById(dbModel, id);
  if (!exits) {
    const err = Error('Invalid id!');
    err.status = 404;
    return next(err);
  }
  req[dbModel] = exits;
  req.id = id;
  return next();
};

module.exports = {
  numberParser,
  validateID,
};
