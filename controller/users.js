/* eslint-disable consistent-return */
/* eslint-disable object-curly-newline */
const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { CREATED, MONGO_ERROR } = require('../utils/constants');
const {
  NotFoundError,
  BadRequestError,
  ConflictError,
} = require('../errors/errors');

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-key',
      { expiresIn: '7d' },
    );
    return res.send({ token });
  } catch (err) {
    next(err);
  }
};

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    next(err);
  }
};

module.exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId)
      .orFail(new NotFoundError('Пользователь не найден'));
    return res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Некорректный id пользователя'));
    }
    next(err);
  }
};

module.exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .orFail(new NotFoundError('Пользователь не найден'));
    return res.send(user);
  } catch (err) {
    next(err);
  }
};

module.exports.createUser = async (req, res, next) => {
  try {
    const { name, about, avatar, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });
    return res.status(CREATED).send({ name, about, avatar, email });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(
        new BadRequestError(
          'Переданы некорректные данные при создании пользователя',
        ),
      );
    }
    if (err.code === MONGO_ERROR) {
      return next(
        new ConflictError('Пользователь с таким email уже существует'),
      );
    }
    next(err);
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    )
      .orFail(new NotFoundError('Пользователь не найден'));
    return res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(
        new BadRequestError('Переданы некорректные имя или описание'),
      );
    }
    next(err);
  }
};

module.exports.updateUserAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    )
      .orFail(new NotFoundError('Пользователь не найден'));
    return res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(
        new BadRequestError(
          'Переданы некорректные данные при обновлении аватара',
        ),
      );
    }
    next(err);
  }
};
