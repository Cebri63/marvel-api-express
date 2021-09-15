const express = require("express");
const router = express.Router();
const md5 = require("md5");
const uid2 = require("uid2");
const axios = require("axios");

const Character = require("../Models/Character");
const Comic = require("../Models/Comic");

const getCountOfElements = async (element) => {
  let ts = uid2(8);
  let hash = md5(
    ts + process.env.MARVEL_API_SECRET + process.env.MARVEL_API_PUBLIC
  );

  const response = await axios.get(
    `http://gateway.marvel.com/v1/public/${element}?limit=100&ts=${ts}&apikey=${process.env.MARVEL_API_PUBLIC}&hash=${hash}`
  );
  return response.data.data.total;
};

const getElements = async (offset, element) => {
  try {
    let ts = uid2(8);
    let hash = md5(
      ts + process.env.MARVEL_API_SECRET + process.env.MARVEL_API_PUBLIC
    );

    const response = await axios.get(
      `http://gateway.marvel.com/v1/public/${element}?limit=100&offset=${offset}&ts=${ts}&apikey=${process.env.MARVEL_API_PUBLIC}&hash=${hash}`
    );

    for (let i = 0; i < response.data.data.results.length; i++) {
      const item = response.data.data.results[i];
      if (element === "characters") {
        const ref = [];
        for (let j = 0; j < item.comics.items.length; j++) {
          const element = item.comics.items[j];
          const comic = await Comic.findOne({ title: element.name });
          ref.push(comic);
        }

        const newCharacter = new Character({
          marvelId: item.id,
          name: item.name,
          description: item.description,
          thumbnail: {
            path: item.thumbnail.path,
            extension: item.thumbnail.extension,
          },
          comics: ref,
        });
        await newCharacter.save();
      }
      if (element === "comics") {
        const newComic = new Comic({
          marvelId: item.id,
          title: item.title,
          description: item.description,
          thumbnail: {
            path: item.thumbnail.path,
            extension: item.thumbnail.extension,
          },
        });
        await newComic.save();
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

router.get("/save-characters", async (req, res) => {
  try {
    const total = await getCountOfElements("characters");
    for (let i = 0; i < Math.round(total / 100); i++) {
      await getElements(i * 100, "characters");
    }
    res.json("All characters saved !");
  } catch (error) {
    console.log("characters error", error.message);
    res.json({ error: error.message });
  }
});

router.get("/save-comics", async (req, res) => {
  try {
    const total = await getCountOfElements("comics");

    for (let i = 0; i < Math.round(total / 100); i++) {
      await getElements(i * 100, "comics");
    }
    res.json("All comics saved !");
  } catch (error) {
    console.log("comics error", error.message);
    res.json({ error: error.message });
  }
});

module.exports = router;
