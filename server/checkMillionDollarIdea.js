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

module.exports = checkMillionDollarIdea;
