
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
const Templates = mongoose.model("Template");


//LOGIN + Registration
const argon2 = require('argon2'); //Passwort-Sicherheit

// ##### IMPORTANT
// ### Your backend project has to switch the MongoDB port like this
// ### Thus copy paste this block to your project
const MONGODB_PORT = process.env.DBPORT || '27017';
const db = require('monk')(`127.0.0.1:${MONGODB_PORT}/omm-ws2223`); // connect to database omm-2021
console.log(`Connected to MongoDB at port ${MONGODB_PORT}`)
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

//Token
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
app.post('/upload', verifyToken,(req, res) => {
  console.log("UPLOAD");
  const { base64 } = req.body; //base64 aus dem Request-body extrahieren
  Templates.create({ image: base64 })
  res.send({ Status: "ok" })//Bild in der Datenbank speichern
});

// GET-Request für alle Bilder
app.get("/get-image", async (req, res) => {
  try {
    await Templates.find({})
    .then(data => {
      res.send({status: "ok", data:data})
    })
  } catch (error) {
    
  }
})

///////////////////////SIGNUP_SIGNIN///////////////////////////
app.post('/registration', async (req, res) => {
  try {
    const { email, password } = req.body; //Registrationsdaten aus Request-body extrahieren

    const existingUser = await User.findOne({ email }); //email bereits vorhanden?
    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const hashedPassword = await argon2.hash(password); //Passwort hashen durch argon2

    const newUser = await User.create({ email, password:hashedPassword });

    res.json({ success: true, user: newUser }); //Response: Success!
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.post('/login', async (req, res) => {
  console.log("LOGIN");
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }); //user mit email finden

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
      // Hier kannst du die Google ID verwenden und entsprechend verarbeiten
      console.log('Received API-Login ID:', googleId);
  
      const user = await User.findOne({ googleId });
      const token = jwt.sign({ googleId }, secretKey, { expiresIn: '1h' });

      if (!user) {
        // Benutzer existiert nicht, daher erstellen
        const newUser = await GoogleUser.create({ googleId }); // Verwende 'googleId' für die Konsistenz
  
        res.json({
            success: 'User successfully created in the database && logged in',
            user: { _id: newUser._id, googleId: newUser.googleId},
            token: token
          });      
        } else {
        // Benutzer existiert bereits
        res.json({ success: 'Success API-authentification - logged in', token:token });
      }
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  


///////////////////////////////////////////MEMES///////////////////////////////////////////

app.post('/create-meme', verifyToken, async (req, res) => {
  console.log("CREATE MEME");
  const { base64 } = req.body; //base64 aus dem Request-body extrahieren
  const { decodedJwt } = res.locals;
  
  const user = await User.findOne({ _id: decodedJwt.userId });
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }
  if(!base64){
    return res.status(500).json({ error: 'Missing Meme' });
  }
  Meme.create({ image: base64, creator: user._id })
  res.send({ Status: "ok" })//Bild in der Datenbank speichern
})

// GET-Request for self-created memes
app.get('/get-my-meme', verifyToken, async (req, res) => {
  console.log("GET MY MEMES");
  const { decodedJwt } = res.locals;
  
  const user = await User.findOne({ _id: decodedJwt.userId });
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }
  const memes = await Meme.find({ creator: user._id });
  res.json({ success: 'Success', memes: memes });
})

// GET-Request for all memes
app.get('/get-all-memes', async (req, res) => {
  console.log("GET ALL MEMES");
  const memes = await Meme.find({private: false}) //TODO Privacy false checken
  .populate('comments.user', 'email') // auflösen der Referenz und nur die 'email'-Eigenschaft des usesr wird zurückgegeben
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
    { _id: memeId, creator: decodedJwt.userId },
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
    // Wenn der Vote bereits existiert, löschen Sie ihn
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

//////////////////////////////////////////////////////////////////////////////////////

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
