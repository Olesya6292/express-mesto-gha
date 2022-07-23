const User = require("../models/user");

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).send({ message: "Пользователь не найден" });
    }
    return res.send(user);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).send({ message: "Некорректный id пользователя" });
    }
    return res.status(500).send({ message: err.message });
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    return res.send(user);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).send({
        message: "Переданы некорректные данные при создании пользователя",
      });
    }
    return res.status(500).send({ message: err.message });
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      return res.status(404).send({ message: "Пользователь не найден" });
    }
    return res.send(user);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).send({
        message: "Переданы некорректные данные при обновлении профиля",
      });
    }
    return res.status(500).send({ message: err.message });
  }
};

module.exports.updateUserAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      return res.status(404).send({ message: "Пользователь не найден" });
    }
    return res.send(user);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).send({
        message: "Переданы некорректные данные при обновлении аватара",
      });
    }
    return res.status(500).send({ message: err.message });
  }
};
