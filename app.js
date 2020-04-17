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
// var express = require('express');
var app = express();
var server = app.listen(3000);
var io = require('socket.io').listen(server);
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
var compression = require('compression')

///////////////////////////////////////// ROUTES CAN COME HERE \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
const GetRouter = require('./routes/indexGet');
const PostRouter = require('./routes/indexPost');
const DeleteRouter = require('./routes/indexDelete');


// const app = express();
app.use(compression())
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

io.on('connection', function (socket) {
  //message from client that file load button has been clicked
  socket.on('fileloadmessage',function(){
    //broadcast to all client what to do after the button is clicked
    console.log("button clicked")
    socket.broadcast.emit('loadFile');
    socket.emit('loadFile');
  });
  //end of the file load button click message

    //message from client that slideshow load button has been clicked
    socket.on('nowloadslides',function(){
      //broadcast to all client what to do after the button is clicked
      socket.broadcast.emit('loadslidesnow');
      socket.emit('loadslidesnow');
    });
    //end of the slideshow load button click message

        //message from client that sky load button has been clicked
        socket.on("nowloadsky",function(){
          //broadcast to all client what to do after the button is clicked
          socket.broadcast.emit('loadskynow');
          socket.emit('loadskynow');
        });
        //end of the sky load button click message

})

//networked room and avatar show code
const rooms = {};

io.on("connection", socket => {
  console.log("user connected", socket.id);

  let curRoom = null;

  socket.on("joinRoom", data => {
    const { room } = data;

    if (!rooms[room]) {
      rooms[room] = {
        name: room,
        occupants: {},
      };
    }

    const joinedTime = Date.now();
    rooms[room].occupants[socket.id] = joinedTime;
    curRoom = room;

    console.log(`${socket.id} joined room ${room}`);
    socket.join(room);

    socket.emit("connectSuccess", { joinedTime });
    const occupants = rooms[room].occupants;
    io.in(curRoom).emit("occupantsChanged", { occupants });
  });

  socket.on("send", data => {
    io.to(data.to).emit("send", data);
  });

  socket.on("broadcast", data => {
    socket.to(curRoom).broadcast.emit("broadcast", data);
  });

  socket.on("disconnect", () => {
    console.log('disconnected: ', socket.id, curRoom);
    if (rooms[curRoom]) {
      console.log("user disconnected", socket.id);

      delete rooms[curRoom].occupants[socket.id];
      const occupants = rooms[curRoom].occupants;
      socket.to(curRoom).broadcast.emit("occupantsChanged", { occupants });

      if (occupants == {}) {
        console.log("everybody left room");
        delete rooms[curRoom];
      }
    }
  });
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