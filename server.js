var fs = require('fs');
var express = require('express');
var https = require('https');
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
app = express();

server = https.createServer(https_options, app).listen(PORT);

// routes
app.get('/', function (req, res) {
    res.header('Content-type', 'text/html');
    return res.end('Hello World!');
});

app.get('/hey', function(req, res) {
    res.header('Content-type', 'text/html');
    return res.end('Hey!');
});
app.post('/ho', function(req, res) {
    res.header('Content-type', 'text/html');
    return res.end('Ho!');
});

console.log('HTTPS Server listening on %s:%s', HOST, PORT);