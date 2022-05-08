'use strict';
const gulp = require('gulp');
const ts = require('gulp-typescript');
const tsProject = ts.createProject("tsconfig.json");
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const merge = require('merge-stream');
const del = require('del');
const uglify = require("gulp-uglify");

function emptyBuildFolder() {
  return del('./build/**/*', {force:true});
};

function moveStaticFiles() {
  return merge(gulp.src('./src/public/fonts/**/*', {base:'./src'}), gulp.src('./src/public/images/**/*', {base:'./src'}), gulp.src('./src/**/*.html', {base:'./src'}), gulp.src('./src/public/*.png', {base:'./src'}), gulp.src('./src/public/*.xml', {base:'./src'}), gulp.src('./src/public/*.icon', {base:'./src'}), gulp.src('./src/public/*.webmanifest', {base:'./src'}))
    .pipe(gulp.dest('./build'));
};

function transpileSass() {
  return gulp.src('./src/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(gulp.dest('./build'));
};

function transpileTypescript() {
    return tsProject.src()
        .pipe(tsProject()).js
        .pipe(uglify())
        .pipe(gulp.dest('./build'));
};

const gulpTaskSeries = gulp.series(emptyBuildFolder, moveStaticFiles, transpileSass, transpileTypescript);

function gulpWatch(){
  gulp.watch('./src/**/*', gulpTaskSeries);
}

exports.default = gulpTaskSeries;

exports.watch = gulpWatch;