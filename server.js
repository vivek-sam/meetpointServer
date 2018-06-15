var fs = require('fs');
var express = require('express');
var https = require('https');
var bodyParser = require('body-parser');
const winston = require('winston');

const logDir = '../working/log';
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
    token = token.trim();
    recognizedToken = recognizedToken.trim();
    
    logger.debug('Token : %s', token);
    logger.debug('recognized Token : %s', recognizedToken);

    return token === recognizedToken;
}

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const tsFormat = () => (new Date()).toLocaleTimeString();
var now = new Date();
var logfile_name = `${logDir}` + now.getFullYear() + "-"+ now.getMonth() + "-" + now.getDate() +'/server.log';

var logger = new (winston.Logger)({
    transports: [
    // colorize the output to the console
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
      level: 'info'
    }),
    new (winston.transports.File)({
      filename: logfile_name,
      timestamp: tsFormat,
      datePattern: 'yyyy-MM-dd',
      prepend: true,
      level: 'silly'
    })
    ]
});

app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

server = https.createServer(https_options, app).listen(PORT);

// routes
app.get('/', function (req, res) {
    res.header('Content-type', 'text/html');
    logger.info('Request from IP %s', req.ip);
    return res.end('meetingpoint Server, testing service, just to see a reply...');
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
    logger.info('Received /showvalues request from IP %s', req.ip);
    res.json({gettesting: "123"})
    req.end();
});

app.post('/showhosts', function(req, res) {
    logger.info('Received /showhosts request from IP %s', req.ip);
    var token = req.body.token;
    var validationResult = validateToken(token);
    
    if(validationResult == true) {
        logger.info('Replied /showhosts request');
        res.json({bangalore: "Direct IP"});
    } else {
        res.json({testingshowhosts: "123"});
    }
    req.end();
});

app.post('/addhost', function(req, res) {
    logger.info('Received /addhost requestfrom IP %s', req.ip);

    var token = req.body.token;
    var validationResult = validateToken(token);
    
    if(validationResult === "true") {
        logger.info('Replied /addhost request');
        res.json({bangalore: "Direct IP"});
    } else {
        res.json({testingaddhost: "123"});
    }
    req.end();
});

logger.info('HTTPS Server listening on %s:%s', HOST, PORT);