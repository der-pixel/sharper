<p align="center">
  <img src="src/public/images/icon.svg" width="100" height="100"/>
</p>

# sharper
Sharper is an image converter based on NodeJS and the sharp image processor (https://github.com/lovell/sharp). It allows the conversion of JPEG, PNG, WebP, AVIF, TIFF and GIF, into JPEG, PNG, WebP, AVIF and TIFF. It also gives you the option of changing the compression and resolution of the images.

## Install packages
### Global packages
You need to have gulp-cli and nodemon globally installed
```
npm install -g nodemon
npm install -g gulp-cli
```

### Local packages
```
npm install
```

## Build project
```
npm run build
```

## Watch files
```
npm run watch
```

## Run server
```
npm run start
```

## BE AWARE
This web app doesn't do validation, if you want to make a website with it you will have to implement it yourself. You can also allow users to upload SVG files but users can inject javascript code in SVG so it's dangerous.

## Example image of the App
<img src="src/public/images/sharper.webp" style="width:100%; display: block">