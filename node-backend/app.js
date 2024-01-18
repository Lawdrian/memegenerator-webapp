
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors'); //cross-Origin resource sharing
const bodyParser = require('body-parser');
const crypto = require('crypto');
const { default: mongoose } = require('mongoose');

//UPLOAD
const multer = require('multer');

const ImageModel = require('./image.model'); //ImageModel
const Images = mongoose.model("Template"); //ImageModel

//Token 
const jwt = require('jsonwebtoken');//Token
const secretKey = crypto.randomBytes(16).toString('hex')  //Symmetrischer Schlüssel für Token mit Länge 256 Bits (32 bytes)

//LOGIN + Registration
const argon2 = require('argon2'); //Passwort-Sicherheit

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




app.use(function(req,res,next){  req.db = db;
  next();
});


mongoose.connect("mongodb://127.0.0.1:27017", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

////////////////////////FALLS WIR ES AUF SERVER SPEICHERN WOLLEN////////////////////////
// // Multer config - Speicheern in Ordner images
// const storage = multer.diskStorage({      //Speicherort und Dateiname
//   destination: function (req, file, cb) { //Speicherort
//     return cb(null, "./images")
//   },
//   filename: function (req, file, cb) {    //Dateiname
//     return cb(null, `${Date.now()}_${file.originalname}`) //Dateiname = Zeitstempel + Originalname
//   }
// })
// // Multer config
// const storage = multer.memoryStorage(); // Dateien werden im Arbeitsspeicher gehalten
//
// // Multer upload
// const upload = multer({storage})
///////////////////////////////////////////////////////////////////////////


//--------------------TAB FILE UpLOAD--------------------
app.post('/upload', (req, res) => {
  console.log("UPLOAD");
  const token = req.headers.authorization.split(' ')[1]; //Token aus dem autorisierungsheader extrahieren

  jwt.verify(token, secretKey, (err) => { //Token verifizieren
    const {base64} = req.body; //base64 aus dem Request-body extrahieren
    if(err){// ungültiger Token
      return res.status(401).json({ error: 'Authentication failed' });
    }else{
    Images.create({image: base64})
    res.send({Status:"ok"})//Bild in der Datenbank speichern
  };
});
});

// GET-Request für alle Bilder
app.get("/get-image", async (req, res) => {
  try {
    await Images.find({})
    .then(data => {
      res.send({status: "ok", data:data})
    })
  } catch (error) {
    
  }
})






// DENNIS - REGISTRATION------------------------------

// Registration
app.post('/registration', async (req, res) => {
  const users = db.get('users');
  try {
    const { email, password } = req.body; //Registrationsdaten aus Request-body extrahieren

    const existingUser = await users.findOne({ email }); //email bereits vorhanden?
    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const hashedPassword = await argon2.hash(password); //Passwort hashen durch argon2

    const newUser = await users.insert({ email, password:hashedPassword });

    res.json({ success: true, user: newUser }); //Response: Success!
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Login
app.post('/login', async (req, res) => {
  console.log("LOGIN");
  const users = req.db.get('users');
  try {
    const { email, password } = req.body;

    const user = await users.findOne({ email }); //user mit email finden

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
    const users = req.db.get('users');
    const { googleId } = req.body;
  
    try {
      // Hier kannst du die Google ID verwenden und entsprechend verarbeiten
      console.log('Received API-Login ID:', googleId);
  
      const user = await users.findOne({ googleId });
      const token = jwt.sign({ userId: user._id, email: user.email }, secretKey, { expiresIn: '1h' });

      if (!user) {
        // Benutzer existiert nicht, daher erstellen
        const newUser = await users.insert({ googleId }); // Verwende 'googleId' für die Konsistenz
  
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
  
  

// the login middleware. Requires BasicAuth authentication
app.use((req,res,next) => {
  const users = db.get('users');
  users.findOne({basicauthtoken: req.headers.authorization}).then(user => {
    if (user) {
      req.username = user.username;  // test test => Basic dGVzdDp0ZXN0
      next()
    }
    else {
      res.set('WWW-Authenticate', 'Basic realm="401"')
      res.status(401).send()
    }
  }).catch(e => {
    console.error(e)
    res.set('WWW-Authenticate', 'Basic realm="401"')
    res.status(401).send()
  })
})



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
