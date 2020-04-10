/**
 * @author Munene Collins
 * 
 * * Created:   6.04.2020
 * 
 * (c) Copyright by Devligence Limited.
 * 
 */

const services  = require('../services/services');

const create  = services;



exports.getLogin = async (req, res) => {
    try {
        if(req.session.messages){
            const hasmessage = true;
            res.render('login',{hasmessage:hasmessage,messages:req.session.messages[0]});
        }else{
            const hasmessage = false
            res.render('login',{hasmessage:hasmessage});
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

exports.getSignup = async (req, res) => {
    try {
        const hasmessage = true;
        res.render('register',{ hasmessage:hasmessage,messages: req.flash('notify') });
        // res.render('register');
    } catch (error) {
        throw new Error(error.message);
    }
}

exports.getIndex = async (req, res) => {
    try {
        if(req.sessionID){
            hassess = true
            res.render('index',{hassess:hassess, username:req.user.username});
        }
    } catch (error) {
        throw new Error(error.message);
    }
}







exports.postRegister = async (req, res, next) => {
    try {
        if(req.body.password === req.body.password2){
            await create.registeruser(req.body);
            res.redirect('/apiGet/login');
        }else{
            req.flash('notify', 'Passwords do not match')
            res.redirect('/apiGet/signup');
        }
    } catch(e) {
        throw new Error(e.message);
    }
}




//   exports.deleteLogout = async (req, res, next) => {
//     try {
//       await create.deletesession(req);
//       res.redirect('/apiGet/login');
//       // next()
//     } catch(e) {
//         throw new Error(e.message);
//       //res.sendStatus(500) && next(error)
//     }
//   }