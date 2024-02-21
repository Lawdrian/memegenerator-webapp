var express = require('express');
var router = express.Router();
const { verifyToken, secretKey } = require('../middlewares.js');

const mongoose = require('mongoose');
const Draft = mongoose.model("Draft");
const User = mongoose.model("User")
const Meme = mongoose.model("Meme");
const Template = mongoose.model("Template");

router.post('/', verifyToken, async (req, res) => {

  try {
    console.log("CREATE MEME");
    const { decodedJwt } = res.locals;
    const user = await User.findOne({ _id: decodedJwt.userId });
    const { zip } = req.query;
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // read the meme data from the request body. Has to be an array of objects
    const {data} = req.body;
    if(!data || data.length === 0){
      return res.status(400).json({ error: 'No data' });
    }
    // iterate over each meme and save it to the database
    let createMemePromises = data.map(async (meme) => {
      const { content, name, description, format, templateId, privacy } = meme; 
    
      const usedTemplate = await Template.findOne({ _id: templateId });
      if(!content || !format || !templateId){
        console.log("content: ", content.type, "name: ", name, "format: ", format, "templateId: ", templateId, "privacy: ", privacy)
        return res.status(400).json({ error: 'Missing data' });
      }
      return Meme.create(
        { 
          content: content, 
          name: name, 
          description: description,
          format: format, 
          createdBy: user._id,
          privacy: privacy,
          usedTemplate: usedTemplate._id
        }
      )
    })
    
    Promise.all(createMemePromises)
    .then((createdMemes) => {
      // return the memes as a zip file instead of a JSON array
      console.log("ZIP: ", typeof zip)
      if (zip == "true") {
        createZipArchive(data, (error, archive) => {
          if (error) {
            console.error('Error:', error);
            res.status(500).send('Zip file creation failed');
          } else {
            res.setHeader('Content-Type', 'application/zip');
            res.setHeader('Content-Disposition', 'attachment; filename="memes.zip"');
    
            // pipe the archive to the response
            res.status(201);
            archive.pipe(res);
          }
        });
      } else {
        res.status(201).json({Status:"ok", Message: "Meme saved to database", memes: createdMemes}) // Return the created memes
      } 
    })
    .catch((error) => {
      console.error('Error:', error);
      res.status(500).send('Error creating memes');
    })
  }catch (err) {
    console.log(err);
    res.status(500).send({Status:"error", Message: "Error saving meme to database"});
  }
  
})

// GET-Request for self-created memes
router.get('/mine', verifyToken, async (req, res) => {
  console.log("GET MY MEMES");
  const { decodedJwt } = res.locals;
  console.log(decodedJwt)
  
  const user = await User.findOne({ _id: decodedJwt.userId });
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }
  const memes = await Meme.find({ createdBy: user._id })
  .populate('comments.user', 'email')
  res.status(200).json({Status:"ok", memes: memes})
})

// GET-Request for all memes
router.get('/:id?', async (req, res) => {
  console.log("GET ALL MEMES");

  try {
    const { id } = req.params;
    const { user, format, usedTemplate, ordering, max, zip } = req.query;
    
    if (id) {
      console.log("id" + id); // logs the id parameter from the URL
    }
    let memes;
    if(id) {
      if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({ error: 'Invalid id' });
      }
      // find a meme by its id, that is either public or unlisted
      memes = await Meme.find({ _id: id, privacy: { $in: ["public", "unlisted"] } })
        .populate('comments.user', 'email')
        .populate('createdBy', 'email');
      if (memes.length === 0) {
        return res.status(404).json({ error: 'Meme not found' });
      }
    } else {
      let query = {privacy: { $in: ["public", "unlisted"] }};
      if(user) {
        query.createdBy = user;
      }
      if(format) {
        query.format = format;
      }
      if(usedTemplate) {
        query.usedTemplate = usedTemplate;
      }
      console.log("query", query);
      memes = await Meme.find(query)
      .sort({ createdAt: ordering === 'desc' ? -1 : 1 }) // sort by creation date
      .limit(max ? parseInt(max) : 0) // limit the number of memes
      .populate('comments.user', 'email')
      .populate('createdBy', 'email');
    }
    // return the memes as a zip file instead of a JSON array
    if (zip == "true") {
      createZipArchive(memes, (error, archive) => {
        if (error) {
          console.error('Error:', error);
          res.status(500).send('Zip file creation failed');
        } else {
          res.setHeader('Content-Type', 'application/zip');
          res.setHeader('Content-Disposition', 'attachment; filename="memes.zip"');
        
          console.log("zipfile!!!")
          // pipe the archive to the response
          archive.pipe(res);
        }
      });
    } else {
      res.json({ success: 'Success', memes: memes });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});
  

router.put('/privacy', verifyToken, async (req, res) => {
  console.log("UPDATE MEME PRIVACY");
  const {privacy,  memeId } = req.body;
  const decodedJwt = res.locals.decodedJwt;
  if(!decodedJwt?.email) //'?' Chaining-Operator -> if res.locals.decodeJWT is defined and got email 
  {
    return res.status(500).json({ error: 'Email not in token' });
  }
  const updateMeme = await Meme.findOneAndUpdate(
    { _id: memeId, createdBy: decodedJwt.userId },
    { privacy: privacy }, 
    { new: true }
    );
    if (!updateMeme) {
      console.log(updateMeme);
      return res.status(404).json({ error: "Meme not found " });
    }
  
    res.status(200).json(updateMeme);
})

router.put('/vote', verifyToken, async(req,res) => {
  console.log("++++VOTE++++");
  const { memeId, vote } = req.body;
  const decodedJwt = res.locals.decodedJwt;


  const existingVote = await Meme.findOne(
    {
      _id: memeId,
      $or: [
        { "upVotes": { $elemMatch: { voter: decodedJwt.userId } } },
        { "downVotes": { $elemMatch: { voter: decodedJwt.userId } } }
      ]
    }
  );

  if (existingVote) {
    // If vote exists, delete it
    const updateMeme = await Meme.findOneAndUpdate(
      { _id: memeId },
      {
        $pull: {
          "upVotes": { voter: decodedJwt.userId },
          "downVotes": { voter: decodedJwt.userId }
        }
      },
      { new: true }
    );
    console.log("Vote removed:", updateMeme);
  }

  const updateMeme = await Meme.findOneAndUpdate(
      { _id: memeId },
      {
        $push: {
          [vote]: {
            voteCount: 1,
            voter: decodedJwt.userId
          }
        }
      },
      { new: true }
    );

    if (!updateMeme) {
      console.log(updateMeme);
      return res.status(404).json({ error: "Meme not found " });
    }
    console.log("Vote added:", updateMeme);

    res.status(200).json(updateMeme);
})

router.put('/comment', verifyToken, async(req,res) =>{
  console.log("+++Make Comment+++");
  const {memeId, comment} = req.body;
  const decodedJwt = res.locals.decodedJwt;
  console.log(comment);

  const updatedMeme = await Meme.findOneAndUpdate(
    { _id: memeId },
    {
      $push: { comments: { user: decodedJwt.userId, content: comment } }
    },
    { new: true }
  );

  if(!updatedMeme){
    return res.status(404).json({ error: "Error creating Comment"});
  }
  return res.json({success: 'Sucess', comment: updatedMeme})
});

module.exports = router;