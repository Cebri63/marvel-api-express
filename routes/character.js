const express = require("express");
const router = express.Router();
const Character = require("../Models/Character");
const Comic = require("../Models/Comic");
const User = require("../Models/User");
const isAuthenticated = require("../middlewares/isAuthenticated");

router.get("/characters", async (req, res) => {
  try {
    if (req.query.apiKey) {
      const user = await User.findOne({ apiKey: req.query.apiKey });
      if (user) {
        let search = {};
        if (req.query.name) {
          let name = new RegExp(req.query.name, "i");
          search.name = name;
        }

        const skip = Number(req.query.skip) || 0;
        let limit;
        if (!req.query.limit) {
          limit = 100;
        } else {
          limit = Number(req.query.limit);
        }

        if (limit <= 100 && limit >= 1) {
          const results = await Character.find(search).skip(skip).limit(limit);
          const count = await Character.countDocuments(search);
          res.status(200).json({
            count: count,
            limit: limit,
            results: results,
          });
        } else {
          res.status(400).json({ message: "Limit must be between 1 and 100" });
        }
      } else {
        res.status(400).json({ message: "Your apiKey is not valid" });
      }
    } else {
      res.status(400).json({ message: "You must send your apiKey" });
    }
  } catch (error) {
    console.log(error.message);
    res.json({ error: error.message });
  }
});

router.get("/character/:characterId", async (req, res) => {
  try {
    if (req.query.apiKey) {
      const user = await User.findOne({ apiKey: req.query.apiKey });
      if (user) {
        const character = await Character.findById(req.params.characterId);
        res.status(200).json(character);
      } else {
        res.status(400).json({ message: "Your apiKey is not valid" });
      }
    } else {
      res.status(400).json({ message: "You must send your apiKey" });
    }
  } catch (error) {
    console.log(error.message);
    res.json({ error: error.message });
  }
});
module.exports = router;
