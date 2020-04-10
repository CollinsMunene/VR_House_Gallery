/**
 * @author Munene Collins
 * 
 * * Created:   6.04.2020
 * 
 * (c) Copyright by Devligence Limited.
 * 
 */

///////////////////////////////////////   START OF APP FUNCTIONALITY FILE(APP.JS) \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//require('dotenv/config'); //load the dotenv config file
const createError = require('http-errors'); //load http-errors library
const express = require('express'); //load express library
const path = require('path'); //load path library
const cookieParser = require('cookie-parser');  //load cookie parser library
const csrf = require('csurf')
const logger = require('morgan'); //load morgan library for logging purposes
const bodyParser = require('body-parser');  //load body parser for accessing form values on post requests
const cors = require('cors'); //load library for cross platform integration
const passport = require('passport'); //load passport authentication library
const session = require('express-session'); //load sessions library
const initializePassport = require('./passport/passport-config'); //load the passport config file
const redis   = require("redis"); //load redis to hold act as session stores
const redisStore = require('connect-redis')(session); //load connect-redis library to act as a session store
const client  = redis.createClient(); //create a client for redis
const helmet = require('helmet')  //load library that sets constious security headers
const mongoSanitize = require('express-mongo-sanitize'); //load library to sanitize user inputs
const expressValidator = require('express-validator');
var flash = require('connect-flash')


///////////////////////////////////////// ROUTES CAN COME HERE \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
const GetRouter = require('./routes/indexGet');
const PostRouter = require('./routes/indexPost');
const DeleteRouter = require('./routes/indexDelete');


const app = express();

///////////////////////////////////////// LOAD VIEW(ejs) SETTINGS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

///////////////////////////////////////// LOAD BODY PARSER SETTINGS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
app.use(bodyParser.json());
const csrfProtection = csrf({ cookie: true })
app.use(bodyParser.urlencoded({extended:false}));

///////////////////////////////////////// LOAD MORGAN LOGGER FOR LOGGING for DEV \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
app.use(logger('dev'));

///////////////////////////////////////// LOAD EXPRESS SETTINGS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

///////////////////////////////////////// LOAD HELMET LIBRARY \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
app.use(helmet());

///////////////////////////////////////// LOAD MONGO-SANITIZE LIBRARY FOR USER INPUT SANITIZATION \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
app.use(mongoSanitize());

///////////////////////////////////////// INITIALIZE AND STORE SESSIONS FOR PERSISTENCE \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

app.set('trust proxy', 1);
const expiryDate = new Date(Date.now() + 60 * 60 * 1000)
app.use(session({
  secret: 'ThisIsHowYouUseRedisSessionStorage', //used to hash the sessions
  name: '_NIP', //used to name the cookie
  store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl :  260}), //connections settings for redis
  saveUninitialized: true,
  resave: true,
  // cookie: {
  //   secure: true,
  //   httpOnly: true,
  //   domain: 'example.com',
  //   path: 'foo/bar',
  //   expires: expiryDate
  // }
}));
app.use(flash())

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use(expressValidator({
  errorFormatter:function(params,msg,value){
    var namespace = parmas.split('.'),
    root = namespace.shift(),
    formParam = root;

    while(namespace.length){
      formParam += '[' + namespace.shift() + ']';
    }
    return{
      param : formParam,
      msg : msg,
      value : value
    };
  }
}));
///////////////////////////////////////// INITIALIZE PASSPORT AND THE SESSION FUNCTIONALITY \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
app.use(passport.initialize());
app.use(passport.session());


///////////////////////////////////////// ROUTES \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

app.use('/apiGet',GetRouter);
app.use('/apiPost',PostRouter);
app.use('/apiDelete',DeleteRouter);

///////////////////////////////////////// INITIATE LIBRARY FOR CROSS-PLATFORM INTEGRATION \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
app.use(cors());

app.get('/', function(req, res) {
  res.redirect('/apiGet/');
});

////////////////////////////////////////// CATCH 404 ERRORS AND PUSH TO THE ERROR HANDLER \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
app.use(function(req, res, next) {
  next(createError(404));
});

////////////////////////////////////////// ERROR HANDLER \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
  // return res.json({'status':err.status})
});

module.exports = app;

///////////////////////////////////////   END OF APP FUNCTIONALITY FILE(APP.JS) \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\