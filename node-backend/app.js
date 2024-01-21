
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors'); //cross-Origin resource sharing
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//MongoDB Models
const UserModel = require('./mongoDB/user.model.js');
const User = mongoose.model("User"); 
const GoogleUser = mongoose.model("GoogleUser"); 
const MemeModel = require('./mongoDB/meme.model.js');
const Meme = mongoose.model("Meme"); //MemeModel
const TemplatesModel = require('./mongoDB/template.model.js');
const Template = mongoose.model("Template");


//LOGIN + Registration
const argon2 = require('argon2');

// ##### IMPORTANT
// ### Your backend project has to switch the MongoDB port like this
// ### Thus copy paste this block to your project
const MONGODB_PORT = process.env.DBPORT || '27017';
const db = require('monk')(`127.0.0.1:${MONGODB_PORT}/omm-ws2223`); // connect to database omm-2021
console.log(`Connected to MongoDB at port ${MONGODB_PORT}`)

// For posts
const postsRouter = require('./routes/posts');
// ######

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(cors()); // allow cross origin requests

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/api', postsRouter);

const jwt = require('jsonwebtoken');
const { verifyToken, secretKey } = require('./middlewares.js');

app.use(function(req,res,next){  req.db = db;
  next();
});


mongoose.connect("mongodb://127.0.0.1:27017", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//--------------------TAB FILE UpLOAD--------------------
app.post('/template', verifyToken, async (req, res) => {
  const {content, name, format} = req.body;

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
        createdBy: user._id,
        format: "image", 
        content: content
      });
    res.status(201).json({Status:"ok", Message: "Template saved to database"})
  } catch (err) {
    console.log(err);
    res.status(500).send({Status:"error", Message: "Error saving image to database"});
  }
});

// GET-Request to retrieve all templates from the database
app.get("/template", async (req, res) => {
  try {
    const data = await Template.find({});
    res.send({status: "ok", data:data});
  } catch (error) {
    console.log(error);
    res.status(500).send({status: "error", message: "Error retrieving templates"});
  }
})

///////////////////////SIGNUP_SIGNIN///////////////////////////
app.post('/registration', async (req, res) => {
  try {
    const { email, password } = req.body; //exrtact registraion-data out of request-body 

    const existingUser = await User.findOne({ email }); 
    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const hashedPassword = await argon2.hash(password); //hasing pw with argon2

    const newUser = await User.create({ email, password:hashedPassword });

    res.json({ success: true, user: newUser }); 
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.post('/login', async (req, res) => {
  console.log("LOGIN");
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }); 

    if (!user) {    // Check if the user exists
      return res.status(401).json({ error: 'Email not found ' });
    }
    // Verify entered password with the hashed-passwodr of the db
    const verified = await argon2.verify(user.password, password); 

    if (!verified) {
      return res.status(401).json({ error: 'passwort incorrect' });
    }
    const token = jwt.sign({ userId: user._id, email: user.email }, secretKey, { expiresIn: '1h' });

    res.json({ success: 'Authentication successful', token, user });
} catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.post('/api-login', async (req, res) => {
    const { googleId } = req.body;
  
    try {
      console.log('Received API-Login ID:', googleId);
  
      const user = await User.findOne({ googleId });
      const token = jwt.sign({ googleId }, secretKey, { expiresIn: '1h' });

      if (!user) {
        const newUser = await GoogleUser.create({ googleId }); 
  
        res.json({
            success: 'User successfully created in the database && logged in',
            user: { _id: newUser._id, googleId: newUser.googleId},
            token: token
          });      
        } else {
        res.json({ success: 'Success API-authentification - logged in', token:token });
      }
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
///////////////////////SIGNUP_SIGNIN END///////////////////////////
 


///////////////////////////////////////////MEMES///////////////////////////////////////////
app.post('/create-meme', verifyToken, async (req, res) => {
  console.log("CREATE MEME");
  const { content, name, format, templateId, private } = req.body; 

  const { decodedJwt } = res.locals;
  
  const user = await User.findOne({ _id: decodedJwt.userId });
  const usedTemplate = await Template.findOne({ _id: templateId });
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }
  if(!content || !name || !format || !templateId){
    console.log("content: ", content, "name: ", name, "format: ", format, "templateId: ", templateId, "private: ", private)
    return res.status(400).json({ error: 'Missing data' });
  }
  Meme.create(
    { 
      content: content, 
      name: name, 
      format: format, 
      createdBy: user._id,
      private: private,
      usedTemplate: usedTemplate._id
    }
  )
  res.status(201).json({Status:"ok", Message: "Meme saved to database"})
  
})

// GET-Request for self-created memes
app.get('/get-my-meme', verifyToken, async (req, res) => {
  console.log("GET MY MEMES");
  const { decodedJwt } = res.locals;
  
  const user = await User.findOne({ _id: decodedJwt.userId });
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }
  const memes = await Meme.find({ createdBy: user._id });
  res.status(200).json({Status:"ok", memes: memes})
})

// GET-Request for all memes
app.get('/get-all-memes', async (req, res) => {
  console.log("GET ALL MEMES");
  const memes = await Meme.find({private: false}) 
  .populate('comments.user', 'email') // resolve the reference and only the 'email' property of the user is returned
  console.log(memes[0].name)
  res.json({ success: 'Success', memes: memes });
})

app.put('/update-meme-privacy', verifyToken, async (req, res) => {
  console.log("UPDATE MEME PRIVACY");
  const {private,  memeId } = req.body;
  const decodedJwt = res.locals.decodedJwt;
  if(!decodedJwt?.email) //'?' Chaining-Operator -> if res.locals.decodeJWT is defined and got email 
  {
    return res.status(500).json({ error: 'Email not in token' });
  }
  const updateMeme = await Meme.findOneAndUpdate(
    { _id: memeId, createdBy: decodedJwt.userId },
    { private: private }, 
    { new: true }
    );
    if (!updateMeme) {
      console.log(updateMeme);
      return res.status(404).json({ error: "Meme not found " });
    }
  
    res.status(200).json(updateMeme);
})

app.put('/meme-vote', verifyToken, async(req,res) => {
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

app.put('/meme-comment', verifyToken, async(req,res) =>{
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
///////////////////////////////////////////MEMES-END///////////////////////////////////////////

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});






module.exports = app;
