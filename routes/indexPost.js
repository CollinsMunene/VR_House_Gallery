/**
 * @author Munene Collins
 * 
 * * Created:   6.04.2020
 * 
 * (c) Copyright by Devligence Limited.
 * 
 */

///////////////////////////////////////   START OF indexPOST FUNCTIONALITY FILE(indexPost.JS) \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

const express = require('express');
const router = express.Router();
const passport = require('passport'); //load passport authentication library
const initializePassport = require('../passport/passport-config'); //load the passport config file
const controller = require('../controllers/controllers');
const flash = require('express-flash'); //load flash library
const mongoSanitize = require('express-mongo-sanitize'); //load library to sanitize user inputs


///////////////////////////////////////// INITIALIZE PASSPORT AND THE SESSION FUNCTIONALITY \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
router.use(passport.initialize());
router.use(passport.session());

const multer  = require('multer');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/assets/ownslides');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now()+".pdf")
  }
});

const fileFilter = function (req, file, callback) {
  // accept image only
  if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/)) {
      return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};

const upload = multer({ storage: storage,fileFilter: fileFilter });
///////////////////////////////////////// FUNCTION FOR CHECKING IF USER IS AUTHENTICATED \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
     req.isLogged = true
     return next();
  }
  res.redirect('/apiGet/login');
}

function cleanBody(req, res, next) {
  req.body = mongoSanitize.sanitize(req.body)
  next();
}

function whereYouwere(req,res,next){
  if(req.session.returnTo != null){
    successredirect = req.session.returnTo;
    return next();
  }
  return next();
}

router.post('/register', cleanBody,controller.postRegister);

router.post('/joinroom/:id',isLoggedIn,controller.postRoom);
router.post('/login',cleanBody, whereYouwere,
  passport.authenticate('local', { successReturnToOrRedirect: '/apiGet/userprofile',
                                   failureRedirect: '/apiGet/login',
                                   failureFlash:"Invalid Username or Password",
                                   failureMessage:'Invalid Username or Password',
                                   successFlash:"success",
                                   failureFlash: true,
                                   successFlash:true })
);

router.post('/fileupload',isLoggedIn,upload.single('presentationfile'),controller.postFileupload);
// router.post('/emailReset',cleanBody,controller.postemailReset);

// router.post('/reset',cleanBody,controller.postemailReset);

// router.post('/resetpass',cleanBody, controller.userresetpass);


module.exports = router;
