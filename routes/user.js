const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const isAuthenticated = require("../middlewares/isAuthenticated");

const User = require("../Models/User");

router.post("/signup", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.fields.email });
    if (!user) {
      if (req.fields.email && req.fields.password) {
        const token = uid2(64);
        const salt = uid2(64);
        const hash = SHA256(req.fields.password + salt).toString(encBase64);

        const newUser = new User({
          email: req.fields.email,
          hash: hash,
          salt: salt,
          token: token,
        });

        await newUser.save();

        res.status(200).json({ token: newUser.token });
      } else {
        // l'utilisateur n'a pas envoyé les informations requises ?
        res.status(400).json({ message: "Missing parameters" });
      }
    } else {
      res.status(409).json({ message: "This email already has an account" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.fields.email });
    if (user) {
      if (
        SHA256(req.fields.password + user.salt).toString(encBase64) ===
        user.hash
      ) {
        res.status(200).json({ token: user.token, apiKey: user.apiKey });
      } else {
        res.status(401).json({ error: "Unauthorized" });
      }
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
});

router.get("/get-api-key", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.apiKey) {
      if (req.query.refresh) {
        const apiKey = uid2(16);
        user.apiKey = apiKey;
        await user.save();
        res.status(200).json({ apiKey: user.apiKey });
      } else {
        res.status(200).json({ apiKey: user.apiKey });
      }
    } else {
      const apiKey = uid2(16);
      user.apiKey = apiKey;
      await user.save();
      res.status(200).json({ apiKey: user.apiKey });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
});
module.exports = router;
