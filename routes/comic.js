const express = require("express");
const isAuthenticated = require("../middlewares/isAuthenticated");
const router = express.Router();
const Character = require("../Models/Character");
const Comic = require("../Models/Comic");
const User = require("../Models/User");

// Get a list of comics
router.get("/comics", async (req, res) => {
  try {
    if (req.query.apiKey) {
      const user = await User.findOne({ apiKey: req.query.apiKey });
      if (user) {
        let search = {};
        if (req.query.title) {
          let title = new RegExp(req.query.title, "i");
          search.title = title;
        }

        const skip = Number(req.query.skip);
        let limit;
        if (!req.query.limit) {
          limit = 100;
        } else {
          limit = Number(req.query.limit);
        }
        if (limit <= 100 && limit >= 1) {
          const results = await Comic.find(search)
            .skip(skip)
            .limit(limit)
            .sort({ title: 1 });
          const count = await Comic.countDocuments(search);
          res.json({
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

// Get a list of comics containing a specific character
router.get("/comics/:characterId", async (req, res) => {
  try {
    if (req.query.apiKey) {
      const user = await User.findOne({ apiKey: req.query.apiKey });
      if (user) {
        const characterId = req.params.characterId;
        const results = await Character.findById(characterId).populate(
          "comics"
        );
        res.json(results);
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

router.get("/comic/:comicId", async (req, res) => {
  try {
    if (req.query.apiKey) {
      const user = await User.findOne({ apiKey: req.query.apiKey });
      if (user) {
        const comic = await Comic.findById(req.params.comicId);
        res.status(200).json(comic);
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
