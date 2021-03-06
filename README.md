# sharper
Sharper is a image converter based on the sharp image processor (https://github.com/lovell/sharp). It allows the conversion of JPEG, PNG, WebP, AVIF, TIFF and GIF, into JPEG, PNG, WebP, AVIF and TIFF. It also gives you the option of changing the compression and resolution of the images.

## Necessary modules
```
npm install --save sharp
npm install --save express
npm install --save express-fileupload
npm install --save btoa
npm install --save dotenv
npm install --save archiver
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
This web app doesn't do validation, if you want to make a website with it you will have to implement it for safety reasons. You can also allow users to upload SVG files, but users can inject javascript code in svg, so it's dangerous.
