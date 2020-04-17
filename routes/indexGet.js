/**
 * @author Munene Collins
 * 
 * * Created:   6.04.2020
 * 
 * (c) Copyright by Devligence Limited.
 * 
 */

///////////////////////////////////////   START OF indexGET FUNCTIONALITY FILE(indexGet.JS) \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

const express = require('express');
const router = express.Router();
const passport = require('passport'); //load passport authentication library
// const initializePassport = require('../passport/passport-config'); //load the passport config file
const controller = require('../controllers/controllers');


///////////////////////////////////////// INITIALIZE PASSPORT AND THE SESSION FUNCTIONALITY \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
router.use(passport.initialize());
router.use(passport.session());


///////////////////////////////////////////////////////////MIDDLEWARES \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

///////////////////////////////////////// FUNCTION FOR CHECKING IF USER IS AUTHENTICATED \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
     req.isLogged = true
     return next();
  }
  req.session.returnTo = req.originalUrl;
  res.redirect('/apiGet/login');
}

////////////////////////////////////////// INDEX PAGE GET REQUEST \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
router.get('/', controller.getIndex );
router.get('/login',controller.getLogin);
router.get('/signup',controller.getSignup);
router.get('/createroom',isLoggedIn,controller.getcreateroom);
router.get('/userprofile',isLoggedIn, controller.getuserprofile );
router.get('/joinroom',isLoggedIn,controller.getjoinroom);
router.get('/:id',isLoggedIn,controller.getjoinVRroom)
router.get('/loadpower/:string',isLoggedIn,controller.getloadpower);
// router.get('/loadpower/:string', function(res,req){
//   var convertapi = require('convertapi')('8V49kuSOkGbeHlsO');
//   convertapi.convert('jpg', {
//       File: 'public/assets/ownslides/presentationfile-1586787358466.pdf'
//   }, 'pdf').then(function(result) {
//       result.saveFiles('public/assets/ownslidespres');
//   });
// })
// router.get('/reset', controller.userreset);

// router.get('/resetpass', controller.getuserresetpass);

module.exports = router;

///////////////////////////////////////   END OF GET REQUESTS FUNCTIONALITY FILE(indexGet.JS) \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\