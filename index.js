var express = require('express');
var app = express();
const sharp = require('sharp');

app.get('/', function (req, res) {
   res.send('Hello World');
})

var server = app.listen(8080, function () {
   var port = server.address().port
   console.log('App running at:', '\n', '- Local:   http://localhost:'+port+'/', '\n' , '- Network: http://192.168.2.162:'+port+'/');
})