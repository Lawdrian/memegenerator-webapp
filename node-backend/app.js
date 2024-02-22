var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express");
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
const DraftModel = require('./mongoDB/draft.model.js');
const Draft = mongoose.model("Draft");

// Routes
const userRouter = require('./routes/user');
const memeRouter = require('./routes/meme');
const templateRouter = require('./routes/template');
const draftRouter = require('./routes/draft');
const indexRouter = require('./routes/index');

// ##### IMPORTANT
// ### Your backend project has to switch the MongoDB port like this
// ### Thus copy paste this block to your project
const MONGODB_PORT = process.env.DBPORT || '27017';
const db = require('monk')(`127.0.0.1:${MONGODB_PORT}/omm-ws2223`); // connect to database omm-2021
console.log(`Connected to MongoDB at port ${MONGODB_PORT}`)


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


mongoose.connect(`mongodb://localhost:${MONGODB_PORT}/omm-ws2223`, { 
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/', indexRouter);
app.use("/user", userRouter);
app.use("/meme", memeRouter);
app.use("/template", templateRouter);
app.use("/draft", draftRouter);

////////// api-docs START //////////
const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Meme Generator API with Swagger",
      version: "0.1.0",
    },
    servers: [
      {
        url: "http://localhost:3001",
      },
    ],
  },
  apis: ["./routes/*.js", "./MongoDB/*.js"],
};

const specs = swaggerJsdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);

////////// api-docs END //////////



// API-endpoint to check if the server is reachable
app.get('/health-check', async (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is reachable' });
})


app.use(express.static(path.join(__dirname, 'public')));

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