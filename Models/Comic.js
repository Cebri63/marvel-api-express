const mongoose = require("mongoose");

const Comic = mongoose.model("Comic", {
  title: String,
  description: String,
  thumbnail: {
    path: String,
    extension: String,
  },
});

module.exports = Comic;
