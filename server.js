var fs = require('fs');
var express = require('express');
var https = require('https');
var bodyParser = require('body-parser');


var key = fs.readFileSync('wallet/server-key.pem');
var cert = fs.readFileSync('wallet/server-crt.pem');
var ca = fs.readFileSync('wallet/ca-crt.pem');

var https_options = {
    key: key,
    cert: cert,
    ca: ca
};

var PORT = 7443;
var HOST = 'viveksam.southindia.cloudapp.azure.com';
var recognizedToken = fs.readFileSync('wallet/token').toString();

/*
Functions
*/
function validateToken(token) {
    if(token === recognizedToken) {
        return "true";
    }
    return "false";
}

app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

server = https.createServer(https_options, app).listen(PORT);

// routes
app.get('/', function (req, res) {
    res.header('Content-type', 'text/html');
    return res.end('meetingpoint Server, testing server, just to see a reply');
    console.log("Received root request");
});

/*
app.get('/hey', function(req, res) {
    res.header('Content-type', 'text/html');
    return res.end('Hey!');
});

app.post('/ho', function(req, res) {
    res.header('Content-type', 'text/html');
    return res.end('Ho!');
});
*/

app.get('/showvalues', function(req, res) {
    console.log("Received /showvalues request");
    res.json({gettesting: "123"})
    res.end();
});

app.post('/showhosts', function(req, res) {
    console.log("Received /showhosts request");
    console.log(req);
    var token = req.body.token;
    var validationResult = validateToken(token);
    if(validationResult === "true") {
        console.log("Replied /showhosts request");
        res.json({bangalore: "Direct IP"});
    } else {
        res.json({testing: "123"});
    }
    res.end();
});

app.post('/addhost', function(req, res) {
    console.log("Received /addhost request");
    var token = req.body.token;
    var validationResult = validateToken(token);
    if(validationResult === "true") {
        res.json({bangalore: "Direct IP"});
    } else {
        res.json({testing: "123"});
    }
    res.end();
});

console.log('HTTPS Server listening on %s:%s', HOST, PORT);