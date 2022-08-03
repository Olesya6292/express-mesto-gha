const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Поле название должно быть заполнено'],
      minlength: [2, 'Минимальное количество букв в названии - 2'],
      maxlength: [30, 'Максимальное количество букв в названии - 30'],
    },
    link: {
      type: String,
      required: [true, 'Добавьте ссылку на картинку'],
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'Некорректный адрес URL',
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: [],
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('card', cardSchema);
