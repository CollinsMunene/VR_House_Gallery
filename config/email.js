/**
 * @author Munene Collins
 * 
 * * Created:   6.04.2020
 * 
 * (c) Copyright by Devligence Limited.
 * 
 */

require('dotenv/config'); //load the dotenv config file
let nodemailer = require('nodemailer');
exports.GmailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD
      }
});

// Configure Nodemailer SendGrid Transporter
// exports.GmailTransport = nodemailer.createTransport({
//     service:'SendGrid',
//     auth: {
//         user: process.env.SENDGRID_API_USER,    // SG username
//         pass: process.env.SENDGRID_API_PASSWORD, // SG password
//       },
// }
// );

exports.ViewOptionreserver = (transport, ejs) => {
    transport.use('compile', ejs({
        viewEngine: {
            extName: '.ejs',
            partialsDir: 'emails/msgtemplates/',
            layoutsDir: 'emails/msgtemplates/',
            defaultLayout: 'reservationacceptreserver.ejs',
          },
          viewPath: 'emails/msgtemplates/',
          extName: '.ejs',
    }));
}
exports.ViewOptioncarowner = (transport, ejs) => {
    transport.use('compile', ejs({
        viewEngine: {
            extName: '.ejs',
            partialsDir: 'emails/msgtemplates/',
            layoutsDir: 'emails/msgtemplates/',
            defaultLayout: 'reservationacceptcarowner.ejs',
          },
          viewPath: 'emails/msgtemplates/',
          extName: '.ejs',
    }));
}
exports.ViewOptionresetemail = (transport, ejs) => {
    transport.use('compile', ejs({
        viewEngine: {
            extName: '.ejs',
            partialsDir: 'emails/msgtemplates/',
            layoutsDir: 'emails/msgtemplates/',
            defaultLayout: 'resetemail.ejs',
          },
          viewPath: 'emails/msgtemplates/',
          extName: '.ejs',
    }));
}

exports.ViewOptionOrderBeingmade = (transport, ejs) => {
    transport.use('compile', ejs({
        viewEngine: {
            extName: '.ejs',
            partialsDir: 'emails/msgtemplates/',
            layoutsDir: 'emails/msgtemplates/',
            defaultLayout: 'ordermade.ejs',
          },
          viewPath: 'emails/msgtemplates/',
          extName: '.ejs',
    }));
}

exports.ViewOptionVendorrequest = (transport, ejs) => {
    transport.use('compile', ejs({
        viewEngine: {
            extName: '.ejs',
            partialsDir: 'emails/msgtemplates/',
            layoutsDir: 'emails/msgtemplates/',
            defaultLayout: 'vendorrequest.ejs',
          },
          viewPath: 'emails/msgtemplates/',
          extName: '.ejs',
    }));
}
