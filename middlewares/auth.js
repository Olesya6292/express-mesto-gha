const { JWT_SECRET = 'dev-key' } = process.env;
const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/errors');

module.exports = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedError('Необходима авторизация');
    }

    const token = authorization.replace('Bearer ', '');
    let payload;

    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      throw new UnauthorizedError('Необходима авторизация');
    }

    req.user = payload;

    next();
  } catch (err) {
    next(err);
  }
};
