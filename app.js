require('dotenv').config()
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const sharp = require('sharp');
const btoa = require('btoa');
const fs = require('fs');
const archiver = require('archiver');

// handle uploaded files
app.use(fileUpload());

// serve these files and folders as static content
app.use(express.static(__dirname+'/'+process.env.STATIC_FOLDER));

// handle GET requests
app.get("/", (req, res) => {
   res.sendFile(__dirname + '/app.html');
})

// handle POST requests
app.post('/upload', async function(req, res) {
   let files = req.files;

   if (!files || Object.keys(files).length === 0) {
      return res.status(400).send('No files were uploaded.');
   }
   else{
      const object = {};
      if(typeof files.fileLoad.name === "undefined"){
         let counter = 1;
         for(element of files.fileLoad){
            await sharp(element.data)
            .withMetadata()
            .webp()
            .toFile('compress/'+counter+'.webp');
            counter++;
         }
      }
      else if(typeof files.fileLoad.name === "string"){
         // get the file and modify it
         await sharp(files.fileLoad.data)
            .withMetadata()
            .webp()
            .toFile('compress/1.webp');
      }

      // create a file to stream archive data to.
      const output = fs.createWriteStream(__dirname + '/images.zip');
      const archive = archiver('zip', {
         zlib: { level: 9 } // Sets the compression level.
      });

      // pipe archive data to the file
      archive.pipe(output);

      // append files from a sub-directory, putting its contents at the root of archive
      archive.directory('compress/', false);

      // finalize the archive (ie we are done appending files but streams have to finish yet)
      // 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
      archive.finalize();

      output.on('close', function() {
         fs.readFile(__dirname + '/images.zip', (err, data) => {
            if (err) throw err;
            return res.status(200).json({data:'data:application/zip;base64,'+btoa(arrayBufferToString(data))});
         });
         
         //remove the files
         console.log(archive.pointer() + ' total bytes');
         fs.readdir("compress/", (err, files)=>{
            files.forEach(el =>{
               fs.promises.rm("compress/"+el);
            })
         });
         // remove the zip
         fs.promises.rm("images.zip");
      });
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
