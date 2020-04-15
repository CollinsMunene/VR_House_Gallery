/**
 * @author Munene Collins
 * 
 * * Created:   6.04.2020
 * 
 * (c) Copyright by Devligence Limited.
 * 
 */

const services  = require('../services/services');
var fs = require('fs');
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
            hassess = true
            var result = await create.userprefile(req.user.username);
            if(result <= 0){
                hasfiles = false
            }else{
                hasfiles = true
            }
           
            res.render('index',{hassess:hassess, username:req.user.username, files:result,hasfiles:hasfiles});
        
    } catch (error) {
        throw new Error(error.message);
    }
}

exports.getroom = async (req,res) => {
    try {
        var path = 'public/assets/ownslidespres'
        
        fs.readdir(path, function(err, items) {
            // console.log(items);
            if(items <= 0){
                hasfiles = false
            }else{
                hasfiles = true
            }
            var myArr = Array.from(items);
            res.render('vrroom',{ username:req.params.string,slides:myArr,hasfiles:hasfiles,itemnumber:items.length});

        });
        // res.render('vrroom',{ username:req.params.string});
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

exports.postFileupload = async (req,res,next) => {
    try{
        var don = await create.fileupload(req.file.filename,req.user.username);
        res.redirect('/apiGet/')
    }catch(e){
        console.log(e)
    }
}

exports.getloadpower = async (req,res,next) => {
     var convertapi = require('convertapi')('8V49kuSOkGbeHlsO');
     convertapi.convert('jpg', {
         File: 'public/assets/ownslides/'+req.params.string
     }, 'pdf').then(function(result) {
         result.saveFiles('public/assets/ownslidespres');
     });
     res.redirect('/apiGet/')
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