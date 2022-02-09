const {
  Validator,
  ValidationError,
} = require('express-json-validator-middleware')


const { validate } = new Validator()

const validationErrorMiddleware = (error, req, res, next) => {
  /**
   * If response headers have already been sent,
   * delegate to the default Express error handler.
   */
  if (res.headersSent) {
    return next(error)
  }
  /**
   * If the `error` object is not a `ValidationError`  we'll pass
   * it in to the `next()`- will be handle by the default Express
   * error handler.
   */
  const isValidationError = error instanceof ValidationError
  if (!isValidationError) {
    return next(error)
  }
  res.status(400).json({
    errors: error.validationErrors,
  })

  next()
}

module.exports = { validate, validationErrorMiddleware }
