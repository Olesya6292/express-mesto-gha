const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { login, createUser } = require('../controller/users');
const { NotFoundError } = require('../errors/errors');
const auth = require('../middlewares/auth');

const router = express.Router();

router.use(express.json());

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(
        /^https?:\/\/(www.)?([\d\w.-]+)\.([\w]{2})([-._~:/?#[\]@!$&'()*+,;=]*)*#?/,
      ),
    }),
  }),
  createUser,
);

router.use(auth);
router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.use((req, res, next) => {
  next(new NotFoundError('Такой страницы не существует'));
});

module.exports = router;
