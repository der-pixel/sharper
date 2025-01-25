"use strict";
import { src, dest, watch, series } from "gulp";
import gulpTypescript from "gulp-typescript";
const tsProject = gulpTypescript.createProject("tsconfig.json");
import * as dartSass from "sass";
import gulpSass from "gulp-sass";
const sass = gulpSass(dartSass);
import merge from "merge-stream";
import { deleteAsync } from "del";
import uglify from "gulp-uglify";
import debug from 'gulp-debug';

// empty the build folder
async function resetGulp() {
  const deletedFilePaths = await deleteAsync("build/**/*");
  return deletedFilePaths;
}

// move the static files to the destination folder
function staticGulp() {
  return merge(
    src("./src/public/**/*", { base: "./src" }).pipe(debug({ title: "Public files:" })),
    src("./src/**/*.html", { base: "./src" }).pipe(debug({ title: "HTML:" })),
  ).pipe(dest("./build"));
}

// compile scss into css
function sassGulp() {
  return src("./src/**/*.scss")
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(dest("./build"))
    .pipe(debug({ title: "SASS:" }));
}

// compile typescript into javascript
function typescriptGulp() {
  return tsProject
    .src()
    .pipe(tsProject())
    .js.pipe(uglify())
    .pipe(dest("./build"))
    .pipe(debug({ title: "Typescript:" }));
}

function watchGulp() {
  watch("src/**/*", series(resetGulp, staticGulp, sassGulp, typescriptGulp));
}

const _default = series(resetGulp, staticGulp, sassGulp, typescriptGulp);
export { _default as default };

const _watch = watchGulp;
export { _watch as watch };
