require('dotenv').config()
import express from 'express';
import fileUpload from 'express-fileupload';
const app = express();
import sharp from 'sharp';
import bufferToString from 'btoa';
import fs from 'fs';
import archiver from 'archiver';

// name of the folder where the images will be created
const compressFolder = "/compress";

 // listen for uploaded images
app.use(fileUpload());

// serve the files from the static folder as static files
app.use(express.static(__dirname+'/'+process.env.STATIC_FOLDER));

// handle GET requests
app.get("/", (req, res) => {
   res.sendFile(__dirname + '/app.html');
})

// handle POST requests
app.post('/upload', async function(req, res) {
   // create an files variable and assign the files from the request
   const files = req.files?req.files:undefined;
   // the counter variable determines the name of the images: 0,1,2,3,4 and so on
   let counter = 1;
   // if files exists
    if(files){
      // check if files.fileLoad is an array
      // this is because if express-fileupload only gets one file it doesn't create an array of objects, it just adds the object. So instead of always doing {[files]} it does {file} when it's only one file
      if(Array.isArray(files.fileLoad)){
         // loop through the  to get the data of each image
         for(let element of files.fileLoad){
            // convert the images
            await convert(element.data, (__dirname + compressFolder + '/' + counter+'.' + req.body.output));
            // increase the counter
            counter++;
         }
         // export the images inside a zip file
         // delete the created images and zip after exporting
         await exportFiles();
      }
      // if files.fileLoad is NOT an array
      else{
         // convert the file
         await convert(files.fileLoad.data, (__dirname + compressFolder + '/'+counter + '.' + req.body.output));
         // export the images inside a zip file
         // delete the created images and zip after exporting
         await exportFiles();
      }
   }
   
   // check what's the output file format and depending on it it execute a different function to convert the images
   async function convert(element: any, toFile: any){
      // check if the folder where you are going to export the images exists, if it doesn't then create it
      if (!fs.existsSync(__dirname + compressFolder)){
         fs.mkdirSync(__dirname + compressFolder);
      }
      // depending on the selected output file format execute a function to convert the images to that format
      switch(req.body.output){
         // export to JPEG
         case 'jpeg': await jpeg(element, toFile); break;
         // export to PNG
         case 'png': await png(element, toFile); break;
         // export to WebP
         case 'webp': await webp(element, toFile); break;
         // export to AVIF
         case 'avif': await avif(element, toFile); break;
         // export to TIFF
         case 'tiff': await tiff(element, toFile); break;
      }
   }

   // take a file and convert it to JPEG
   async function jpeg(element: any, toFile: any){
      await sharp(element)
         .jpeg({quality: Number(req.body.compressionSlider)})
         .resize(Number(req.body.widthSlider), Number(req.body.heightSlider), {
            fit: 'cover',
            position: 'center'})
         .toFile(toFile);
   }

   // take a file and convert it to PNG
   async function png(element: any, toFile: any){
      await sharp(element)
         .png({quality: (Math.ceil(Number(req.body.compressionSlider)/10))==10?9:Math.ceil(Number(req.body.compressionSlider)/10)})
         .resize(Number(req.body.widthSlider), Number(req.body.heightSlider), {
            fit: 'cover',
            position: 'center'})
         .toFile(toFile);
   }

   // take a file and convert it to WebP
   async function webp(element: any, toFile: any){
      await sharp(element)
         .webp({quality: Number(req.body.compressionSlider)})
         .resize(Number(req.body.widthSlider), Number(req.body.heightSlider), {
            fit: 'cover',
            position: 'center'})
         .toFile(toFile);
   }

   // take a file and convert it to AVIF
   async function avif(element: any, toFile: any){
      await sharp(element)
         .avif({quality: Number(req.body.compressionSlider)})
         .resize(Number(req.body.widthSlider), Number(req.body.heightSlider), {
            fit: 'cover',
            position: 'center'})
         .toFile(toFile);
   }

   // take a file and convert it to TIFF
   async function tiff(element: any, toFile: any){
      await sharp(element)
         .tiff({quality: Number(req.body.compressionSlider)})
         .resize(Number(req.body.widthSlider), Number(req.body.heightSlider), {
            fit: 'cover',
            position: 'center'})
         .toFile(toFile);
   }

   // export the files
   async function exportFiles(){
      // set the directory to which write the zip to
      const output = fs.createWriteStream(__dirname + '/images.zip');
      // creates a zip file
      const archive = archiver('zip', {
         // set the compression level
         zlib: { level: 9 } 
      });
      // stream the archive data to the output file
      archive.pipe(output);
      // get the images from the compressFolder
      archive.directory(__dirname + compressFolder+'/', false);
      // finalize the archive (ie we are done appending files but streams have to finish yet)
      await archive.finalize();
      // finish is always executed before close independently of where they were declared
      // on finish
      output.on('finish', function(){
         // send a response with the zip
         fs.readFile(__dirname + '/images.zip', (err, data) => {
            if (err) throw err;
            return res.status(200).json({data:'data:application/zip;base64,'+bufferToString(arrayBufferToString(data))});
         });
      });
      // on close
      output.on('close', function(){
         //remove the images from compressFolder
         fs.promises.rmdir(__dirname + compressFolder, { recursive: true});
         // remove the zip file
         fs.promises.rm(__dirname + "/images.zip");
      });
   }
});

// transform a buffer into a string
function arrayBufferToString(buffer: Buffer){
   // transform the buffer into a Typed array
   const bufferArray = new Uint16Array(buffer);
   // transform bufferArray into an number[] array to be able to send it to String.fromCharCode.apply(null, number[])
   var bufferNumbers: number[] = Array.from(bufferArray);
   // lenght of the ArrayBuffer
   var length = bufferArray.length;
   // string that will contain all the data of the image in base64
   var result = '';
   // size of the chunks that you will get from the array
   var addition = Math.pow(2,16)-1;
   // loop through bufferNumbers to get the bytes by chunks
   // the reason why this is needed is becasuse if you use String.fromCharCode.apply(null, number[]) in a file that is too large it will crash
   for(var i = 0;i<length;i+=addition){
       if(i + addition > length){
           addition = length - i;
       }
       // get a chunk of the array and convert it to a string
       result += String.fromCharCode.apply(null, bufferNumbers.slice(i,i+addition));
   }
   // return the final string
   return result;
}

// listen to the designated port
app.listen(process.env.APP_PORT, function () {
   // display the port on the terminal
   console.log('App running at:', '\n', '- Local:   http://localhost:'+process.env.APP_PORT+'/', '\n' , '- Network: http://192.168.2.162:'+process.env.APP_PORT+'/');
});