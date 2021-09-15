const mongoose = require("mongoose");

const Character = mongoose.model("Character", {
  name: String,
  description: String,
  thumbnail: {
    path: String,
    extension: String,
  },
  comics: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comic",
    },
  ],
});

module.exports = Character;
