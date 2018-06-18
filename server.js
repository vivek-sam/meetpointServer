var fs = require('fs');
var express = require('express');
var https = require('https');
var bodyParser = require('body-parser');
const winston = require('winston');
const storage = require('node-persist');

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

function exitHandler(options, err) {
    if (options.cleanup) logger.debug('Server Exiting...');
    if (err) logger.debug(err.stack);
    if (options.exit) {
        logger.debug('Server Exiting...');
        process.exit();
    }
}

//initialize the storage
storage.init({
    dir: '../working/data',
    stringify: JSON.stringify,
    parse: JSON.parse,
    encoding: 'utf8',
    logging: false,  // can also be custom logging function
    ttl: false, // ttl* [NEW], can be true for 24h default or a number in MILLISECONDS
    expiredInterval: 12 * 60 * 1000, // every 2 minutes the process will clean-up the expired cache
    // in some cases, you (or some other service) might add non-valid storage files to your
    // storage dir, i.e. Google Drive, make this true if you'd like to ignore these files and not throw an error
    forgiveParseErrors: false
});

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const tsFormat = () => (new Date()).toLocaleTimeString();
var now = new Date();
var logfile_name = `${logDir}`+ '/' + now.getFullYear() + "-"+ now.getMonth() + "-" + now.getDate() +'server.log';

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
});

app.post('/showhosts', function(req, res) {
    logger.info('Received /showhosts request from IP %s', req.ip);
    var token = req.body.token;
    var validationResult = validateToken(token);
    
    if(validationResult == true) {
        logger.info('Replied /showhosts request');
        var allwanIPs = storage.values();
        res.json({'operation': "showhosts",'status': "SUCCESS", hosts: allwanIPs});
    } else {
        res.json({testingshowhosts: "123"});
    }
});

app.post('/addhost', function(req, res) {
    logger.info('Received /addhost request from IP %s', req.ip);

    var token = req.body.token;
    var validationResult = validateToken(token);
    
    if(validationResult == true) {
        //store the replace the data in the store
        var host = req.body.hostMachine.toString();
        var wanIP = req.body.hostWANIP.toString();

        logger.debug("Host : %s, wanIP : %s", host, wanIP);

        let oldwanIP = storage.getItem(host);

        if (! oldwanIP) {
            storage.setItem(host, wanIP);
            logger.info('Setting Host : %s',host);
        }
        else {
            storage.setItem(host, wanIP);
            logger.info('Resetting Host : %s',host);
        }
        let newwanIP = storage.getItem(host);
        logger.info('wanIP : %s',newwanIP);

        logger.info('Replied /addhost request');
        res.json({operation: "addhost",status: "SUCCESS"});
    } else {
        res.json({testingaddhost: "123"});
    }
});

logger.info('HTTPS Server listening on %s:%s', HOST, PORT);