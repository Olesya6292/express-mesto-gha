const express = require('express');
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards,
  createCard,
  deleteCard,
  putLikeCard,
  deleteLikeCard,
} = require('../controller/cards');

router.get('/', getCards);

router.post(
  '/',
  express.json(),
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string()
        .required()
        .pattern(
          /^https?:\/\/(www.)?([\d\w.-]+)\.([\w]{2})([-._~:/?#[\]@!$&'()*+,;=]*)*#?/,
        ),
    }),
  }),
  createCard,
);

router.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex(),
    }),
  }),
  deleteCard,
);

router.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex(),
    }),
  }),
  putLikeCard,
);

router.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex(),
    }),
  }),
  deleteLikeCard,
);

module.exports = router;
