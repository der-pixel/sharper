require('dotenv').config()
var express = require('express');
var app = express();
const sharp = require('sharp');
var path = require('path');

// Serve these files and folders as static content
app.use(express.static(__dirname+'/'+process.env.STATIC_FOLDER));

app.post("/", (req, res) => {
   
})

// When the server is initialized show the port
var server = app.listen(process.env.APP_PORT, function () {
   var port = server.address().port;
   console.log('App running at:', '\n', '- Local:   http://localhost:'+port+'/', '\n' , '- Network: http://192.168.2.162:'+port+'/');
});
