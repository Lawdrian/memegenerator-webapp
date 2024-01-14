
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

const ImageModel = require('./template.model'); //ImageModel
const Template = mongoose.model("Template"); //ImageModel

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
app.post('/save-template', async (req, res) => {
  console.log("UPLOAD");
  
  // Deactivate authentification for testing
  /*
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
  */
  const {base64, type, name} = req.body; //base64 aus dem Request-body extrahieren
  console.log(base64);
  console.log(req.body);
  if (type !== 'image' && type !== 'gif' && type !== 'video') {
    return res.status(400).json({ error: 'Invalid type' });
  }
  try {
    // Use the model to create a new document
    await Template.create({name: name, type: type, content: base64});
    res.send({Status:"ok"})//Bild in der Datenbank speichern
  } catch (err) {
    console.log(err);
    res.status(500).send({Status:"error", Message: "Error saving image to database"});
  }
});

// GET-Request to retrieve all templates from the database
app.get("/get-templates", async (req, res) => {
  try {
    await Template.find({}, 'name type content')
    .then(data => {
      res.send({status: "ok", data:data})
    })
  } catch (error) {
    
  }
})


app.post('/add-text-to-gif', (req, res) => {
    try {
      const { gifBase64, text, textProperties } = req.body;

      const img = new Image();
      img.src = Buffer.from(gifBase64, 'base64');
  
      img.onload = () => {
        const canvas = createCanvas(img.width, img.height);
        const ctx = canvas.getContext('2d');
    
        ctx.drawImage(img, 0, 0, img.width, img.height);
        ctx.font = `${textProperties.size}px Arial`;
        ctx.fillStyle = textProperties.color;
        ctx.fillText(text, textProperties.x, textProperties.y);
    
        const encoder = new GIFEncoder(img.width, img.height);
        encoder.start();
        encoder.setRepeat(0);
        encoder.setDelay(500);
        encoder.addFrame(ctx);
        encoder.finish();
    
        const newGifBase64 = Buffer.from(encoder.out.getData()).toString('base64');
    
        res.json({ newGifBase64 });
    };
    
    }
    catch (error) {
      console.error('Error during adding text to GIF:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
    
});


// Split a gif into frames and send it to client
const gifFrames = require('gif-frames');

app.get('/gif-to-imagedata', (req, res) => {
  const gifUrl = 'https://konvajs.org/assets/yoda.gif'; // replace with your gif url
  //const gifUrl = 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDkwdjdpMjF4MGFpcTVmN3ZtZ3d4OGdjd3VucnF0cjN1cWN4eDYwbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/D8d9waDRkLu7U8Jlar/giphy.gif'; // replace with your gif url
  //const gifUrl = 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExcm9yczF5aHN0b2h2MTExNmpvemw4M2J1bDYxeHR1N2hjM3lydGhsZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/pyTkBNVthpwp0WVFw0/giphy.gif'; // replace with your gif url

  gifFrames({ url: gifUrl, frames: 'all' }, function (err, frameData) {
    if (err) {
      res.status(500).json({ error: 'Failed to fetch the gif' });
      return;
    }

    const frames = frameData.map((frame) => {
      return new Promise((resolve, reject) => {
        const chunks = [];
        frame.getImage()
          .on('data', chunk => chunks.push(chunk))
          .on('end', () => resolve(Buffer.concat(chunks).toString('base64')))
          .on('error', reject);
      });
    });

    Promise.all(frames)
      .then(data => res.json({ frames: data }))
      .catch(err => res.status(500).json({ error: 'Failed to process the frames' }));
  });
});


// receive image frames, a text and text properties and return a gif

const Jimp = require('jimp');
const GIFEncoder = require('gifencoder');
const fs = require('fs');
const { PassThrough } = require('stream');

app.post('/create-gif', async (req, res) => {
  const images = req.body.images; // get images from request body
  const text = req.body.text; // get text from request body
  const animationType = req.body.animationType; // get animationType from request body
  console.log(images.length, text)

  // read the first image to get its dimensions
  const firstImageBuffer = Buffer.from(images[0], 'base64');
  const firstImage = await Jimp.read(firstImageBuffer);

  const encoder = new GIFEncoder(firstImage.bitmap.width, firstImage.bitmap.height);

  // pipe the image data to the response
  res.setHeader('Content-Type', 'image/gif');
  
  // create a PassThrough stream and pipe the image data to the response and a file
  const passThrough = new PassThrough();
  passThrough.pipe(res);
  passThrough.pipe(fs.createWriteStream('output.gif'));

  const readStream = encoder.createReadStream();
  readStream.pipe(passThrough);

  encoder.start();
  encoder.setRepeat(0);   // 0 for repeat, -1 for no-repeat
  encoder.setDelay(500);  // frame delay in ms
  encoder.setQuality(10); // image quality. 20 is default.

  const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK); // load font

  // process all images
  await Promise.all(images.map(async (imagePath, i) => {
    const imageBuffer = Buffer.from(imagePath, 'base64');
    const image = await Jimp.read(imageBuffer);

    var opacity = 1;
    console.log(animationType)
    // calculate opacity based on current frame
    if (animationType === 'fade-out') {
      opacity = Math.min(1 - (i / (images.length - 1)), 1);
    } else if (animationType === 'fade-in') {
      opacity = Math.min(i / (images.length - 1), 1);
    }
    // create a new image with the text
    const textImage = new Jimp(image.bitmap.width, image.bitmap.height, 0x00000000);
    textImage.print(font, 100, 100, `Frame ${i + 1}`, image.bitmap.width);

    // adjust the opacity of the textImage
    textImage.opacity(opacity);

    // composite the text image onto the original image
    const combinedImage = image.composite(textImage, 0, 0);

    encoder.addFrame(combinedImage.bitmap.data);
  }));

  encoder.finish();
});



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
