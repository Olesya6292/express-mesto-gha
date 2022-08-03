/* eslint-disable no-console */
const express = require("express");
const mongoose = require("mongoose");
const { NOT_FOUND, DEFAULT } = require("./utils/constants");
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controller/users');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/mestodb", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to db");
  })
  .catch(() => {
    console.log("Error to db connection");
  });

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);
app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/cards"));

app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Такой страницы не существует" });
});

app.use((err, req, res, next) => {
  const { statusCode = DEFAULT, message } = err;
  res.status(statusCode).send({
    message: statusCode === DEFAULT ? "На сервере произошла ошибка" : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`Server listen on ${PORT}`);
});
