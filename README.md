<div style="text-align: center;">
  <img src="public/images/icon.svg" style="width: 100px; height: auto;"/>
</div>

# sharper
Sharper is an image converter based on the sharp image processor (https://github.com/lovell/sharp). It allows the conversion of JPEG, PNG, WebP, AVIF, TIFF and GIF, into JPEG, PNG, WebP, AVIF and TIFF. It also gives you the option of changing the compression and resolution of the images.

## Necessary modules
```
npm install --save archiver
npm install --save sharp
npm install --save express
npm install --save express-fileupload
npm install --save btoa
npm install --save dotenv
```

## Optional modules
```
npm install --save-dev nodemon
npm install --save-dev npm-check
```

## Run server
If you installed nodemon:
```
npm start
```
If you didn't install nodemon:
```
node index.js
```

## BE AWARE
This web app doesn't do validation, if you want to make a website with it you will have to implement it yourself. You can also allow users to upload SVG files but users can inject javascript code in SVG so it's dangerous.

## Example image of the App
<img src="public/images/sharper.webp" style="width:100%; display: block">