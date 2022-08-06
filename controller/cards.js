/* eslint-disable consistent-return */
const Card = require('../models/card');
const { CREATED } = require('../utils/constants');
const {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} = require('../errors/errors');

module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    return res.send(cards);
  } catch (err) {
    next(err);
  }
};

module.exports.createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });
    return res.status(CREATED).send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(
        new BadRequestError(
          'Переданы некорректные данные при создании карточки',
        ),
      );
    }
    next(err);
  }
};

module.exports.deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId)
      .orFail(new NotFoundError('Карточка не найдена'));
    if (!card.owner.equals(req.user._id)) {
      throw new ForbiddenError('Нельзя удалить чужую карточку');
    }
    await Card.findByIdAndRemove(req.params.cardId);
    return res.send(card);
  } catch (err) {
    next(err);
  }
};

module.exports.putLikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    ).populate(['owner', 'likes'])
      .orFail(new NotFoundError('Карточка не найдена'));
    return res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(
        new BadRequestError('Переданы некорректные данные для постановки лайка'),
      );
    }
    next(err);
  }
};

module.exports.deleteLikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    ).populate(['owner', 'likes'])
      .orFail(new NotFoundError('Карточка не найдена'));
    return res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(
        new BadRequestError(' Переданы некорректные данные для снятии лайка'),
      );
    }
    next(err);
  }
};
