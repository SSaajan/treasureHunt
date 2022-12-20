const express = require("express");
const serverless = require("serverless-http");
const bodyParser = require("body-parser");
var cors = require("cors");
var nodemailer = require('nodemailer');
const { google } = require('googleapis');
const config = require('../config.js');
const OAuth2 = google.auth.OAuth2;
const app = express();
app.use(cors({origin:true, credentials:true}));

const OAuth2_client = new OAuth2(config.clientId, config.clientSecret);
OAuth2_client.setCredentials({refresh_token:config.refreshToken});

function sendMailGoogle(subject, mailString) {
    const accessToken = OAuth2_client.getAccessToken();

    var transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: config.user,
            clientId: config.clientId,
            clientSecret: config.clientSecret,
            refreshToken: config.refreshToken,
            accessToken: accessToken
        }
    });

    var mailOptions = {
        from: 'saajansuraj@gmail.com',
        to: 'saajansuraj@gmail.com',
        subject: subject,
        text: mailString
    };

    transport.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });
}

var winners = 0;
var data = []

const router = express.Router();

/* var transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host: 'smtpTransport',
    auth: {
      user: 'saajantest80@gmail.com',
      pass: 'ziyeqmhgrrfhgkfk'
    }
}));

function sendMail(subject, mailString) {
    var mailOptions = {
        from: 'saajantest80@gmail.com',
        to: 'saajantest80@gmail.com',
        subject: subject,
        text: mailString
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });
} */

router.post('/', (req, res) => {
    let valid = true;
    data.forEach((function(item) {
        if(req.body.teamID == item.teamID) {
            res.json({"Status": "Already exists"});
            valid = false;
        }
    }))
    var date = new Date();
    if(valid == true) {
        if(req.body.passphrase == "word" && req.body.key == "key") {
            data.push(req.body);
            if(winners < 3) {
                res.json({'place': winners + 1});
                winners = winners + 1;
                var mailString = "Position: " + winners + "\nTeamID: " + req.body.teamID + "\nTimeStamp: " + date;
                sendMailGoogle("Winner", mailString);
            }
            else {
                var mailString = "TeamID: " + req.body.teamID + "\nTimeStamp: " + date;
                sendMailGoogle("Submission", mailString)
                res.json({'place': 4});
            }
        }
        else {
            res.json({"Status": "Failed"});
        }
    }
});

app.use(express.json({strict: false}));
app.use('/.netlify/functions/api', router);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
module.exports.handler = serverless(app);
