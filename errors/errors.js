const UnauthorizedError = require('./unauthorized-err');
const NotFoundError = require('./not-found-err');
const BadRequestError = require('./bad-request-err');
const ConflictError = require('./conflict-err');
const ForbiddenError = require('./forbidden-err');

module.exports = {
  UnauthorizedError,
  NotFoundError,
  BadRequestError,
  ConflictError,
  ForbiddenError,
};
