var express = require('express');
var router = express.Router();

const { verifyToken } = require('../middlewares.js');

const mongoose = require('mongoose');
const Template = mongoose.model("Template");
const User = mongoose.model("User");
const Meme = mongoose.model("Meme");

/**
 * @swagger
 * /template:
 *   post:
 *     summary: Create a new template
 *     tags: [Template]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Template'
 *     responses:
 *       201:
 *         description: The template was successfully created
 *       400:
 *         description: Invalid template type
 *       401:
 *         description: User not found
 *       500:
 *         description: Error saving image to database
 */
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

/**
 * @swagger
 * /template:
 *   get:
 *     summary: Get all templates
 *     tags: [Template]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Template'
 *       500:
 *         description: Error retrieving templates
 */
router.get("/", verifyToken, async (req, res) => {
  try {
    const data = await Template.find({});
    res.send({status: "ok", data:data});
  } catch (error) {
    console.log(error);
    res.status(500).send({status: "error", message: "Error retrieving templates"});
  }
})

/**
 * @swagger
 * /template/info/{id}:
 *   get:
 *     summary: Get the referenced memes of a template
 *     tags: [Template]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Template id
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Error retrieving templates
 */
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