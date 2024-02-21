/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Draft:
 *       type: object
 *       required:
 *         - createdBy
 *         - format
 *         - textProperties
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the draft
 *         name:
 *           type: string
 *           description: The name of your draft
 *         description:
 *           type: string
 *           description: The description of your draft
 *         createdBy:
 *           type: string
 *           description: The draft creator
 *         format:
 *           type: string
 *           description: Draft format ('image', 'gif', 'video')
 *         textProperties:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the draft was created
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: The date the draft was last updated
 *       example:
 *         _id: 65beb09bdb3ca678ad8bcae2
 *         name: "bestDraft"
 *         description: "This is the best draft ever!"
 *         createdBy: "65beb006db3ca678ad8bcabc"
 *         format: "image" 
 *         textProperties: []
 *         createdAt: 2024-02-03T21:31:07.168+00:00	
 *         updatedAt: 2024-02-03T21:31:07.168+00:00
 */

var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const Draft = mongoose.model("Draft");
const Template = mongoose.model("Template");
const User = mongoose.model("User");
const { verifyToken } = require('../middlewares.js');

/**
 * @swagger
 * /draft:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new draft
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Draft'
 *     responses:
 *       201:
 *         description: Draft created successfully
 *       400:
 *         description: Missing data
 *       401:
 *         description: User not found
 */
router.post('/', verifyToken, async (req, res) => {
  console.log("CREATE DRAFT");
  const { textProperties, name, format, templateId } = req.body; 

  const { decodedJwt } = res.locals;
  
  const user = await User.findOne({ _id: decodedJwt.userId });
  const usedTemplate = await Template.findOne({ _id: templateId });
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }
  else if(!textProperties || !format || !templateId){
    console.log("textProperties: ", textProperties, "name: ", name, "format: ", format, "templateId: ", templateId)
    return res.status(400).json({ error: 'Missing data' });
  }
  try {
    await Draft.create(
      { 
        textProperties: textProperties, 
        name: name ?? "myDraft", 
        format: format, 
        createdBy: user._id,
        usedTemplate: usedTemplate._id
      }
    );
    res.status(201).json({Status:"ok", Message: "Draft saved to database"});
  } catch (err) {
    console.error(err);
    res.status(500).json({Status:"error", Message: "Error creating draft"});
  }
})


/**
 * @swagger
 * /draft:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve a list of drafts
 *     responses:
 *       200:
 *         description: A list of drafts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Draft'
 *       401:
 *         description: User not found
 */
router.get('/', verifyToken, async (req, res) => {
  console.log("GET MY DRAFTS");
  const { decodedJwt } = res.locals;
  
  const user = await User.findOne({ _id: decodedJwt.userId });
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }
  const drafts = await Draft.find({ createdBy: user._id });
  res.status(200).json({Status:"ok", data: drafts})
})

/**
 * @swagger
 * /draft/{draftId}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a draft
 *     parameters:
 *       - in: path
 *         name: draftId
 *         required: true
 *         schema:
 *           type: string
 *         description: The draft ID
 *     responses:
 *       200:
 *         description: Draft deleted successfully
 *       400:
 *         description: Missing data
 *       401:
 *         description: User not found
 *       500:
 *         description: Error deleting draft from database
 */
router.delete('/:draftId', verifyToken, async (req, res) => {
  console.log("DELETE DRAFT");
  
  const draftId = req.params.draftId; 
  const { decodedJwt } = res.locals;
  console.log(draftId)
  
  const user = await User.findOne({ _id: decodedJwt.userId });
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }
  if(!draftId){
    return res.status(400).json({ error: 'Missing data' });
  }
  try {
    const result = await Draft.deleteOne({ 
      _id: draftId,
      createdBy: user._id
    });
  
    if (result.deletedCount === 0) {
      console.log('No draft was deleted');
      res.status(500).send({Status:"error", Message: "Error deleting draft from database"});
 
    } else {
      console.log('Draft was deleted successfully');
      res.status(200).json({Status:"ok", Message: "Draft deleted from database"})
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({Status:"error", Message: "Error deleting draft from database"});
  }
})

module.exports = router;