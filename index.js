const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const formidable = require("express-formidable");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(formidable());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const saveDBRoutes = require("./routes/saveDB");
const characterRoutes = require("./routes/character");
const comicRoutes = require("./routes/comic");
const userRoutes = require("./routes/user");
const uid2 = require("uid2");
app.use(saveDBRoutes);
app.use(characterRoutes);
app.use(comicRoutes);
app.use(userRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome on Marvel API" });
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "This route doesn't exist" });
});

app.listen(process.env.PORT, () => {
  console.log("Server has started");
});
