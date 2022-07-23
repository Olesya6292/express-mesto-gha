const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Поле имя должно быть заполнено'],
      minlength: [2, 'Минимальное количество букв в имени - 2'],
      maxlength: [30, 'Максимальное количество букв в имени - 30'],
    },

    about: {
      type: String,
      required: [true, 'Поле описание должно быть заполнено'],
      minlength: [2, 'Минимальное количество букв в описании - 2'],
      maxlength: [30, 'Максимальное количество букв в описании - 30'],
    },

    avatar: {
      type: String,
      required: [true, 'Добавьте ссылку на аватар пользователя'],
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('user', userSchema);
