var fs = require('fs');
var express = require('express');
var https = require('https');
var key = fs.readFileSync('wallet/privateKey.key');
var cert = fs.readFileSync('wallet/certificate.crt')

var https_options = {
    key: key,
    cert: cert
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