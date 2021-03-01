# sharper
Sharper is a image converter based on the sharp image processor (https://github.com/lovell/sharp). It allows the conversion of JPEG, PNG, WebP, AVIF, TIFF, GIF or SVG, into JPEG, PNG, WebP, AVIF, TIFF, HEIF or GIF. It also gives you the option of changing the compression and resolution of the images.

## Necessary modules
```
npm install --save sharp
npm install --save express
npm install --save dotenv
npm install --save node-7z
npm install --save 7zip-bin
```

## Optional modules
Be aware that if you don't install these modules you will have to modify the package.json file 
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
