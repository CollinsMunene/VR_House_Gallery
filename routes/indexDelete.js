/**
 * @author Munene Collins
 * 
 * * Created:   6.04.2020
 * 
 * (c) Copyright by Devligence Limited.
 * 
 */

///////////////////////////////////////   START OF indexDelete FUNCTIONALITY FILE(indexDelete.JS) \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

const express = require('express');
const router = express.Router();
const passport = require('passport'); //load passport authentication library
const initializePassport = require('../passport/passport-config'); //load the passport config file
const controller = require('../controllers/controllers');
const methodOverride = require('method-override');  //library for overriding methods


///////////////////////////////////////// INITIALIZE PASSPORT AND THE SESSION FUNCTIONALITY \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
router.use(passport.initialize());
router.use(passport.session());

///////////////////////////////////////// FUNCTION FOR CHECKING IF USER IS AUTHENTICATED \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

  
////////////////////////////////////////// OVERRIDING LOG OUT ROUTE \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
router.use(methodOverride('_method'));


////////////////////////////////////////// LOG OUT AND SESSION DELETE FUNCTIONS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
router.delete('/logout',controller.deleteLogout);


module.exports = router;

///////////////////////////////////////   END OF indexDelete FUNCTIONALITY FILE(indexDelete.JS) \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\