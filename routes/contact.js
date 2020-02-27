require("dotenv").config();

const express = require('express');
const request = require('request');
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const contactRoutes = express.Router();

//---------------------------------------------------------------
//-------------TO GET OAUTH2 TOKENS TO SEND EMAIL----------------
//---------------------------------------------------------------

const oauth2Client = new OAuth2(
  process.env.CLIENT_ID, // ClientID
  process.env.CLIENT_SECRET, // ClientSecret
  // "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
  refresh_token: '1//04NFeb4x0Y4xUCgYIARAAGAQSNwF-L9IrMFd0XEkub2DRAx4F-TnnHSMfv--DSppSwvzGXb4r5N18t92ThxtfXMQFF8f2URmb0CI'
  //process.env.REFRESH_TOKEN
});

const accessToken = oauth2Client.getAccessToken()
//-----------------------------------------------------------------
//-----------------------------------------------------------------

contactRoutes.post('/contact', (req,res,next) => {
  console.log("ceci est le request body: ", req.body);
  if(req.body.recaptchaResponse === undefined || req.body.recaptchaResponse === '' || req.body.recaptchaResponse === null) {
     return res.send('Please select captcha')
  }

  else {

  let secretKey = process.env.CAPTCHA_SITE_SECRET;

  let verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body.recaptchaResponse + "&remoteip=" + req.connection.remoteAddress;

  

  let transporter = nodemailer.createTransport({
    host : 'smtp.gmail.com',
    secure: true,
    port: 465,
    auth : {
        type: 'oauth2',
        user: process.env.GMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: '1//04NFeb4x0Y4xUCgYIARAAGAQSNwF-L9IrMFd0XEkub2DRAx4F-TnnHSMfv--DSppSwvzGXb4r5N18t92ThxtfXMQFF8f2URmb0CI',
        // process.env.REFRESH_TOKEN,
        accessToken: accessToken,
        
    }

  });

  
  let mailOptions = {
    from: req.body.email,
    to: process.env.GMAIL_USER,
    subject: req.body.subject,
    text: "FROM " + req.body.email + " message " + req.body.message,
    html: '<p>FROM : '+ req.body.email + "<br><b>MESSAGE :</b><br> " + req.body.message + '</p>'
  };
  
  // console.log(verificationUrl);
  // console.log(accessToken);
  // console.log("MAILOPTIONS",mailOptions)
  
  request(verificationUrl,function(error,response,body) {
    body = JSON.parse(body);
    console.log(body)
    
    if (body.success) {
     
      transporter.sendMail(mailOptions, function(error, info){
        if(error){
           return console.log('THERE IS A PROBLEM', error );
        }
        else{
          console.log('Message sent: ' + info.response);
          res.json({msg: 'success'})
        }
    });
    }
    
  });
  
  transporter.close(); 
 
  
  
   }

})

module.exports = contactRoutes;