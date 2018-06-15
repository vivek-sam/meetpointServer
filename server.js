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

app.configure(function(){
    app.use(app.router);
});

server = https.createServer(https_options, app).listen(PORT, HOST);
console.log('HTTPS Server listening on %s:%s', HOST, PORT);


// routes
app.get('/hey', function(req, res) {
    res.send('HEY!');
});
app.post('/ho', function(req, res) {
    res.send('HO!');
});