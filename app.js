/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { NOT_FOUND, DEFAULT } = require('./utils/constants');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controller/users');

const { PORT = 3000 } = process.env;

const app = express();

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 100, // можно совершить максимум 100 запросов с одного IP
});

app.use(limiter);

app.use(express.json());

mongoose
  .connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('Connected to db');
  })
  .catch(() => {
    console.log('Error to db connection');
  });

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

app.post(
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

app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: 'Такой страницы не существует' });
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = DEFAULT, message } = err;
  res.status(statusCode).send({
    message: statusCode === DEFAULT ? 'На сервере произошла ошибка' : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`Server listen on ${PORT}`);
});
