require('dotenv').config()
var express = require('express');
var app = express();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const sharp = require('sharp');

// Serve these files and folders as static content
app.use(express.static(__dirname+'/'+process.env.STATIC_FOLDER));

// Handle GET requests
app.get("/", (req, res) => {
   res.sendFile(__dirname + '/app.html');
})

// Handle POST requests
app.post("/", (req, res, next) => {
   console.log(req.body);
   res.json(req.body);
})

// When the server is started show the port
var server = app.listen(process.env.APP_PORT, function () {
   var port = server.address().port;
   console.log('App running at:', '\n', '- Local:   http://localhost:'+port+'/', '\n' , '- Network: http://192.168.2.162:'+port+'/');
});
