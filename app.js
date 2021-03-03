require('dotenv').config()
const express = require('express');
const fileUpload = require('express-fileupload');
const fileSystem = require('fs')
const app = express();
const sharp = require('sharp');
const btoa = require('btoa');

const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf-8');

// Handle uploaded files
app.use(fileUpload());

// Serve these files and folders as static content
app.use(express.static(__dirname+'/'+process.env.STATIC_FOLDER));

// Handle GET requests
app.get("/", (req, res) => {
   res.sendFile(__dirname + '/app.html');
})

// Handle POST requests
app.post('/upload', async function(req, res) {
   let files = req.files;

   if (!files || Object.keys(files).length === 0) {
      return res.status(400).send('No files were uploaded.');
   }
   else{
      const object = {download: []};
      if(typeof files.fileLoad.name === "undefined"){
         for(element of files.fileLoad){
            await sharp(element.data)
            .withMetadata()
            .webp()
            .toBuffer()
            .then(data =>{
               object.download.push('data:image/webp;base64,'+btoa(arrayBufferToString(data)));
            });
         }
      }
      else if(typeof files.fileLoad.name === "string"){
         await sharp(files.fileLoad.data)
         .withMetadata()
         .webp()
         .toBuffer()
         .then(data =>{
            object.download.push('data:image/webp;base64,'+btoa(arrayBufferToString(data)));
         });
      }
      
      return res.status(200).json(object);
   }
});

function arrayBufferToString(buffer){

   var bufView = new Uint16Array(buffer);
   var length = bufView.length;
   var result = '';
   var addition = Math.pow(2,16)-1;

   for(var i = 0;i<length;i+=addition){

       if(i + addition > length){
           addition = length - i;
       }
       result += String.fromCharCode.apply(null, bufView.subarray(i,i+addition));
   }

   return result;

}

// When the server is started show the port
var server = app.listen(process.env.APP_PORT, function () {
   var port = server.address().port;
   console.log('App running at:', '\n', '- Local:   http://localhost:'+port+'/', '\n' , '- Network: http://192.168.2.162:'+port+'/');
});
