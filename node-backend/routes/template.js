var express = require('express');
var router = express.Router();

const { verifyToken } = require('../middlewares.js');

const mongoose = require('mongoose');
const Template = mongoose.model("Template");
const User = mongoose.model("User");
const Meme = mongoose.model("Meme");

router.post('/', verifyToken, async (req, res) => {
  const {content, name, description, format} = req.body;

  const { decodedJwt } = res.locals;
  const user = await User.findOne({ _id: decodedJwt.userId });
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }
  if(format !== "image" && format !== "gif" && format !== "video") {
    res.status(400).send({Status:"error", Message: "Invalid template type"});
  }
  try {
    // Use the model to create a new document
    await Template.create(
      {
        name: name, 
        description: description,
        createdBy: user._id,
        format: format,
        content: content
      });
    res.status(201).json({Status:"ok", Message: "Template saved to database"})
  } catch (err) {
    console.log(err);
    res.status(500).send({Status:"error", Message: "Error saving image to database"});
  }
});

// GET-Request to retrieve all templates from the database
router.get("/", verifyToken, async (req, res) => {
  try {
    const data = await Template.find({});
    res.send({status: "ok", data:data});
  } catch (error) {
    console.log(error);
    res.status(500).send({status: "error", message: "Error retrieving templates"});
  }
})
// GET-Request to retrieve the referenced memes of the templates
router.get('/info/:id', verifyToken, async (req, res) => {
  try {
    const templateId = req.params.id;
    const memes = await Meme.find({ usedTemplate: templateId });

    const memeDetails = memes.map(meme => {
      return {
        memeId: meme._id, //ID
        createdAt: meme.createdAt, //Date
        upVotes: meme.upVotes ? meme.upVotes.map(vote => vote.createdAt) : [], //Vote with Date
        downVotes: meme.downVotes ? meme.downVotes.map(vote => vote.createdAt) : [], //Vote with Date
      };
    });


    res.send({
      status: "ok",
      data: {
        memeDetails,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: 'error', message: 'Error retrieving templates' });
  }
});

module.exports = router;