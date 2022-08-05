const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const { UnauthorizedError } = require('../errors/errors');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [2, 'Минимальное количество букв в имени - 2'],
      maxlength: [30, 'Максимальное количество букв в имени - 30'],
      default: 'Жак-Ив Кусто',
    },

    about: {
      type: String,
      minlength: [2, 'Минимальное количество букв в описании - 2'],
      maxlength: [30, 'Максимальное количество букв в описании - 30'],
      default: 'Исследователь',
    },

    avatar: {
      type: String,
      default:
        'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      required: [true, 'Добавьте ссылку на аватар пользователя'],
      validate: {
        validator(v) {
          return /^https?:\/\/(www.)?([\d\w.-]+)\.([\w]{2})([-._~:/?#[\]@!$&'()*+,;=]*)*#?/.test(v);
        },
        message: 'Неправильный формат ссылки',
      },
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Поле email должно быть заполнено'],
      validate: {
        validator: (v) => validator.isEmail(v),
        message: 'Неправильный формат почты',
      },
    },
    password: {
      type: String,
      required: [true, 'Поле пароль должно быть заполнено'],
      select: false,
    },
  },
  {
    versionKey: false,
  },
);

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new UnauthorizedError('Неправильные почта или пароль');
        }
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
