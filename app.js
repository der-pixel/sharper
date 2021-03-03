require('dotenv').config()
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const sharp = require('sharp');

// Handle uploaded files
app.use(fileUpload());

// Serve these files and folders as static content
app.use(express.static(__dirname+'/'+process.env.STATIC_FOLDER));

// Handle GET requests
app.get("/", (req, res) => {
   res.sendFile(__dirname + '/app.html');
})

// Handle POST requests
app.post('/upload', function(req, res) {
   let files = req.files;

   if (!files || Object.keys(files).length === 0) {
      return res.status(400).send('No files were uploaded.');
   }
   else{
      const object = {download: []};
      if(typeof files.fileLoad === Array){
         files.filesLoad.forEach(
            element => {
               object.download.push(element);
            }
         )
      }
      else{
         object.download.push(files.fileLoad);
      }
      
      return res.status(200).json(object);
   }
});

// When the server is started show the port
var server = app.listen(process.env.APP_PORT, function () {
   var port = server.address().port;
   console.log('App running at:', '\n', '- Local:   http://localhost:'+port+'/', '\n' , '- Network: http://192.168.2.162:'+port+'/');
});
