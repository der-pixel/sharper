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
   // get the files of the formData
   let files = req.files;

   // the counter variable determines the name of the output images
   let counter = 1;
   if(typeof files.fileLoad?.name === "undefined"){
      for(element of files.fileLoad){
         await convert(element.data);
         counter++;
      }
      await exportFiles();
   }
   else if(typeof files.fileLoad.name === "string"){
      // get the file and modify it
      await convert(files.fileLoad.data);
      //await finish();
      //await jpeg(files.fileLoad.data);
      await exportFiles();
         
   }
   
   // the convert function check what's the type of the input file
   async function convert(element){
      // i know, a switch statement is better, but it doesn't execute properly the async functions and it returns an error
      /*if(req.body.output=="jpeg"){
         await jpeg(element);
      }
      else if(req.body.output=="png"){

      }
      else if(req.body.output=="webp"){

      }
      else if(req.body.output=="avif"){

      }
      else if(req.body.output=="tiff"){

      }*/
      if (!fs.existsSync('./compress')){
         fs.mkdirSync('./compress');
      }

      switch(req.body.output){
         case 'jpeg':
            await jpeg(element);
            break;
         case 'png': await png(element); break;
         case 'webp': await webp(element); break;
         case 'avif': await avif(element); break;
         case 'tiff': await tiff(element); break;
      }
   }

   async function jpeg(element){
      await sharp(element)
         .jpeg({quality: Number(req.body.compressionSlider)})
         .resize(Number(req.body.widthSlider), Number(req.body.heightSlider), {
            fit: 'cover',
            position: 'center'})
         .toFile('compress/'+counter+'.'+req.body.output);
   }

   async function png(element){
      await sharp(element)
         .png({quality: (Math.ceil(Number(req.body.compressionSlider)/10))==10?9:Math.ceil(Number(req.body.compressionSlider)/10)})
         .resize(Number(req.body.widthSlider), Number(req.body.heightSlider), {
            fit: 'cover',
            position: 'center'})
         .toFile('compress/'+counter+'.'+req.body.output);
   }

   async function webp(element){
      await sharp(element)
         .webp({quality: Number(req.body.compressionSlider)})
         .resize(Number(req.body.widthSlider), Number(req.body.heightSlider), {
            fit: 'cover',
            position: 'center'})
         .toFile('compress/'+counter+'.'+req.body.output);
   }

   async function avif(element){
      await sharp(element)
         .avif({quality: Number(req.body.compressionSlider)})
         .resize(Number(req.body.widthSlider), Number(req.body.heightSlider), {
            fit: 'cover',
            position: 'center'})
         .toFile('compress/'+counter+'.'+req.body.output);
   }

   async function tiff(element){
      await sharp(element)
         .tiff({quality: Number(req.body.compressionSlider)})
         .resize(Number(req.body.widthSlider), Number(req.body.heightSlider), {
            fit: 'cover',
            position: 'center'})
         .toFile('compress/'+counter+'.'+req.body.output);
   }

   async function exportFiles(){
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
      await archive.finalize();

      output.on('finish', function(){
         // send a response with the zip
         fs.readFile(__dirname + '/images.zip', (err, data) => {
            if (err) throw err;
            return res.status(200).json({data:'data:application/zip;base64,'+btoa(arrayBufferToString(data))});
         });
      });

      output.on('close', function(){
         //remove the files
         fs.readdir("compress/", (err, files)=>{
            files.forEach(el =>{
               fs.promises.rm("compress/"+el);
            })
         });
         // remove the zip
         fs.promises.rm("images.zip");
      });
      // avif files are really slow to make so a delay is put in place, that way when the server tries to make the zip file and delete the images after that, it doesn't crash
      const terminator = req.body.output=="avif"?(5000*counter):0;
      setTimeout(async ()=>{
         // create a file to stream archive data to.
         

         
      }, 5000)
   }

   
   
});




// transform a buffer into an array buffer and then into a string
function arrayBufferToString(buffer){
   var bufView = new Uint16Array(buffer);
   console.log(bufView.byteLength);
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
