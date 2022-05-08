const gulp = require('gulp');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');
const gulpSass = require('gulp-sass');
const nodeSass = require('node-sass');
gulpSass.compiler = nodeSass;
const merge = require('merge-stream');
const del = require('del');
const uglify = require('gulp-uglify');

function emptyBuildFolder() {
    return del('./build/**/*', { force: true });
}

function copyStaticFiles() {
    return merge([
        gulp.src('./src/public/fonts/**/*', { base: './src' }),
        gulp.src('./src/public/images/**/*', { base: './src' }),
        gulp.src('./src/**/*.html', { base: './src' }),
        gulp.src('./src/public/*.png', { base: './src' }),
        gulp.src('./src/public/*.xml', { base: './src' }),
        gulp.src('./src/public/*.icon', { base: './src' }),
        gulp.src('./src/public/*.webmanifest', { base: './src' }),
    ]).pipe(gulp.dest('./build'));
}

function transpileSass() {
    return gulp
        .src('./src/**/*.scss')
        .pipe(gulpSass({ outputStyle: 'compressed' }))
        .pipe(gulp.dest('./build'));
}

function transpileTypescript() {
    return tsProject.src().pipe(tsProject()).js.pipe(uglify()).pipe(gulp.dest('./build'));
}

const gulpSeries = gulp.series(emptyBuildFolder, copyStaticFiles, transpileSass, transpileTypescript);

function gulpWatch() {
    gulp.watch('./src/**/*', gulpSeries);
}

exports.default = gulpSeries;

exports.watch = gulpWatch;
