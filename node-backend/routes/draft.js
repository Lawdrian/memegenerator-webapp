var express = require('express');
var router = express.Router();

const mongoose = require('mongoose');
const Draft = mongoose.model("Draft");
const Template = mongoose.model("Template");
const User = mongoose.model("User");
const { verifyToken } = require('../middlewares.js');


router.post('/', verifyToken, async (req, res) => {
  console.log("CREATE DRAFT");
  const { textProperties, name, format, templateId } = req.body; 

  const { decodedJwt } = res.locals;
  
  const user = await User.findOne({ _id: decodedJwt.userId });
  const usedTemplate = await Template.findOne({ _id: templateId });
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }
  if(!textProperties || !format || !templateId){
    console.log("textProperties: ", textProperties, "name: ", name, "format: ", format, "templateId: ", templateId)
    return res.status(400).json({ error: 'Missing data' });
  }
  Draft.create(
    { 
      textProperties: textProperties, 
      name: name ?? "myDraft", 
      format: format, 
      createdBy: user._id,
      usedTemplate: usedTemplate._id
    }
  )
  res.status(201).json({Status:"ok", Message: "Draft saved to database"})
})


// GET-Request for self-created drafts
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