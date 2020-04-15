/**
 * @author Munene Collins
 * 
 * * Created:   6.04.2020
 * 
 * (c) Copyright by Devligence Limited.
 * 
 */
require('dotenv/config'); //load the dotenv config file
const userPost = require('../models/usersPost'); //load the User Database Schema
const filePost = require('../models/filePost'); //load the User Database Schema
const bcrypt = require('bcrypt');  //load encryption library for hashing
const request = require('request');
const rp = require('request-promise');
const sgMail = require('@sendgrid/mail');
const MailConfig = require('../config/email');  //load email config file
const ejs = require('nodemailer-express-handlebars'); //load email handlebars library
const gmailTransport = MailConfig.GmailTransport; //initiate transport method

exports.registeruser = async (body) => { //handles registration of users
    try {
      password1 = body.password;
      password2 = body.password2;
      const passwordcrpted = await bcrypt.hashSync(body.password, 10)
      const user = new userPost({
        firstname: body.firstname,
        lastname: body.lastname,
        username: body.username,
        email: body.email,
        phone_number:body.phone_number,
        county:body.county,
        password:passwordcrpted
      });
      const saveduser = await user.save();
      return saveduser;
    } catch(e) {
      throw new Error(e.message)
    }
  }

  exports.fileupload = async(file,user) =>{
    try {
      const nfile = new filePost({
        filepath:file + ".pdf",
        username:user
      });
      await nfile.save();
    } catch (e) {
      console.log(e)
    }
  }

  exports.userprefile = async (username) => {
    try {
      
      var result = await filePost.find({username:username});
      return result;
    } catch (error) {
      console.log(error)
    }
  }
// exports.indexitempopulate = async () => {
//   try {
//       // const result = await itemPost.find({}).limit(6);
//       // return result;
//   } catch(e) {
//     throw new Error(e.message)
//   }
// } 


// exports.emailreset = async (email) => {// password reset via email
//   try {
//     const user = await userPost.find({email:email})
//     const randomstring = Math.random().toString(36).slice(-10);
//     Object.keys(user).forEach(async function(key) {
//       const userrows = user[key];
//       const resetsave = new emailReset ({
//         useremail:userrows.email,
//         usertoken:randomstring,
//         reqtime:Date.now()
//       });
//       await resetsave.save()
//       try {
//         MailConfig.ViewOptionresetemail(gmailTransport,ejs);
//         let HelperOptions = {
//           from: 'collinshillary1@gmail.com',
//           to: userrows.email,
//           subject: 'EMAIL RESET',
//           template: 'resetemail',
//           context: {
//             name:userrows.username,
//             token:randomstring
//           }
//         };
//         gmailTransport.sendMail(HelperOptions, (error,info) => {
//           if(error) {
//             console.log(error);
//             // res.json(error);
//           }
//         })
        
//       } catch (e) {
//         throw new Error(e.message)
//       }
//     });
//   } catch(e) {
//     throw new Error(e.message)
//   }
// }

// exports.resetpass = async (email,token,pass) => {// password reset via email
//   try {
//     const user = await emailReset.find({useremail:email,usertoken:token}).hint({$natural:-1});
//     const passw = await bcrypt.hashSync(pass, 10)
//     if (user) {
//       Object.keys(user).forEach(async function(key) {
//         const userrows = user[key];
//         await userPost.findOneAndUpdate({ email: userrows.useremail },{ $set: { password : passw}},{ returnOriginal: false } )
//         await emailReset.deleteOne( { usertoken : token } );
//       });
//     } else {
//       console.log("error");
//     }

//   } catch(e) {
//     throw new Error(e.message)
//   }
// }

// exports.deletesession = async (req) => { //handles log out and session kill
//   try {
//     if(req) {
//       req.session.destroy(function(){
//         req.logOut();
//       });
//       } else {
//         console.log('error');
//       }
//   } catch(e) {
//     throw new Error(e.message)
//   }
// }