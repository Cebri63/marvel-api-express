const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: String,
  apiKey: String,
  hash: String,
  salt: String,
  token: String,
});

module.exports = User;
