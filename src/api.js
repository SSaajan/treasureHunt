const express = require("express");
const serverless = require("serverless-http");
const bodyParser = require("body-parser");
var cors = require("cors");
var nodemailer = require('nodemailer');
const app = express();
app.use(cors({origin:true, credentials:true}));

var winners = 0;
var data = []

const router = express.Router();
const date = new Date();

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'saajantest80@gmail.com',
      pass: 'ziyeqmhgrrfhgkfk'
    }
});

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
}

router.post('/', (req, res) => {
    let valid = true;
    data.forEach((function(item) {
        if(req.body.teamID == item.teamID) {
            res.json({"Status": "Already exists"});
            valid = false;
        }
    }))
    if(valid == true) {
        if(req.body.passphrase == "word" && req.body.key == "key") {
            data.push(req.body);
            if(winners < 3) {
                res.json({'place': winners + 1});
                winners = winners + 1;
                var mailString = "Position: " + winners + "\nTeamID: " + req.body.teamID + "\nTimeStamp: " + date;
                sendMail("Winner", mailString);
            }
            else {
                var mailString = "Submission: " + req.body.teamID + ". TimeStamp: " + date;
                sendMail("Submission", mailString)
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
