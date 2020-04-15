/**
 * @author Munene Collins
 * 
 * * Created:   6.04.2020
 * 
 * (c) Copyright by Devligence Limited.
 * 
 */

require('dotenv/config'); 
const passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
const userPost = require('../models/usersPost'); //load the User Database Schema
const bcrypt = require('bcrypt')  //load encryption library for hashing

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
  function(username, password, done) {
    userPost.findOne({ email: username }, async function(err, user) {
      // if (err) { return done(err); }
      if (err) {
          res.sendStatus(500);
          return;
      }
      if (!user) {
        console.log("error mehn")
        return done(null, false,{ failureFlash: 'invalid' });
      }

      if (await bcrypt.compareSync(password, user.password)==false) {
        return done(null, false);
      }else{
        return done(null, user);
      }
      
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  userPost.findById(id, function(err, user) {
    done(err, user);
  });
});