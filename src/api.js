const express = require("express");
const serverless = require("serverless-http");
const app = express();
/* const data = require("../data.json");
let port = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Hello world");
});

app.get("/data", (req, res) => {
    res.send(data);
});

app.listen(port, () => {
    console.log('Example is listening on port ' + port);
}); */

const router = express.Router();
router.get('/', (req, res) => {
    res.json({'test':'HI'});
});

app.use('/.netlify/functions/api', router);
module.exports.handler = serverless(app);