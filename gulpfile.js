'use strict';
const gulp = require('gulp');
const {series} = require('gulp');
const ts = require('gulp-typescript');
const tsProject = ts.createProject("tsconfig.json");
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const merge = require('merge-stream');
const del = require('del');
const uglify = require("gulp-uglify");
const { watch } = require('gulp');

// empty the build folder
function resetGulp() {
  return del('build/**/*', {force:true});
};

// move the static files to the destination folder
function staticGulp() {
  return merge(gulp.src('./src/public/fonts/**/*', {base:'./src'}), gulp.src('./src/public/images/**/*', {base:'./src'}), gulp.src('./src/**/*.html', {base:'./src'}), gulp.src('./src/public/*.png', {base:'./src'}), gulp.src('./src/public/*.xml', {base:'./src'}), gulp.src('./src/public/*.icon', {base:'./src'}), gulp.src('./src/public/*.webmanifest', {base:'./src'}))
    .pipe(gulp.dest('./build'));
};

// compile scss into css
function sassGulp() {
  return gulp.src('./src/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(gulp.dest('./build'));
};

// compile typescript into javascript
function typescriptGulp() {
    return tsProject.src()
        .pipe(tsProject()).js
        .pipe(uglify())
        .pipe(gulp.dest('./build'));
};

function watchGulp(){
  watch('src/**/*', series(resetGulp, staticGulp, sassGulp, typescriptGulp));
}

exports.default = series(resetGulp, staticGulp, sassGulp, typescriptGulp);

exports.watch = watchGulp;