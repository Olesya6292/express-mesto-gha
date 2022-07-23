const express = require("express");
const mongoose = require("mongoose");

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

app.use((req, res, next) => {
  req.user = {
    _id: "62dbd8e8cc533fbed8448363",
  };

  next();
});

app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/cards"));

app.use((req, res) => {
  res.status(404).send({ message: "Такой страницы не существует" });
});

app.listen(PORT, () => {
  console.log(`Server listen on ${PORT}`);
});
