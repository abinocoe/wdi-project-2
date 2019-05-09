const gulp = require("gulp"); // => use gulp
const babel = require("gulp-babel"); // => es6 to es5 conversion
const cleanCSS = require("gulp-clean-css"); // => minify css
const stripCssComments = require("gulp-strip-css-comments"); // => strip comments from css
const sass = require("gulp-sass"); // => write scss and convert to css
const autoprefixer = require("gulp-autoprefixer"); // => add web prefixes to CSS
const uglify = require("gulp-uglify"); // => uglify js
const livereload = require("gulp-livereload"); // => no browser refresh on changes
const nodemon = require("gulp-nodemon"); // => run nodemon
const filter = require("gulp-filter"); // => selects files of a certain type
const flatten = require("gulp-flatten"); // => brings all files into one directory
const concat = require("gulp-concat"); // => compress multiple files into one
const order = require("gulp-order"); // => change order of gulp tasks
const cache = require("gulp-cached"); // => only look at files that have changed
const wait = require("gulp-wait");
const mainBowerFiles = require("main-bower-files"); // => grab main files for bower
const del = require("del"); // => delete files from directory
const replace = require("gulp-replace");
const strip = require("gulp-strip-comments");
const bower = mainBowerFiles({
  overrides: {
    bootstrap: {
      main: ["dist/css/bootstrap.css", "dist/js/bootstrap.js"]
    },
    "font-awesome": {
      main: "css/font-awesome.css"
    }
  }
});

const src = "src";
const dist = "public";

// bower
const gulpBower = gulp.series(gulp.series(bowerJs, bowerCss, bowerFonts));

function bowerJs() {
  return gulp
    .src(bower)
    .pipe(cache(bowerJs))
    .pipe(filter(["**/*.js"]))
    .pipe(concat("_bower.js"))
    .pipe(gulp.dest(`${src}/js`));
}

function bowerCss() {
  return gulp
    .src(bower)
    .pipe(cache(bowerCss))
    .pipe(filter(["**/*.css"]))
    .pipe(concat("_bower.scss"))
    .pipe(stripCssComments())
    .pipe(gulp.dest(`${src}/scss`));
}

function bowerFonts() {
  return gulp
    .src(bower)
    .pipe(cache(bowerFonts))
    .pipe(filter(["**/*.{eot,svg,ttf,woff,woff2}"]))
    .pipe(flatten())
    .pipe(gulp.dest(`${src}/fonts`));
}

// nodemon
function gulpNodemon() {
  return nodemon({
    script: "index.js"
  }).on("readable", () => {
    this.stdout.on("data", chunk => {
      if (/^listening/.test(chunk)) {
        livereload.reload();
      }
      process.stdout.write(chunk);
    });
  });
}

function gulpSass() {
  return gulp
    .src(`${src}/scss/style.scss`)
    .pipe(cache(sass))
    .pipe(sass().on("error", sass.logError))
    .pipe(stripCssComments())
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(flatten())
    .pipe(autoprefixer())
    .pipe(gulp.dest(`${dist}/css`))
    .pipe(livereload());
}

function scripts() {
  return gulp
    .src(`${src}/**/*.js`)
    .pipe(
      babel({
        presets: ["es2015"],
        compact: true,
        ignore: ["_bower.js"]
      })
    )
    .pipe(flatten())
    .pipe(order(["_bower.js", "**/*.js"]))
    .pipe(concat("app.js"))
    .pipe(uglify())
    .pipe(gulp.dest(`${dist}/js`))
    .pipe(wait(1500))
    .pipe(livereload());
}

const copy = gulp.series(copyFonts, copyImages);

function copyFonts() {
  return gulp.src(`${src}/**/*.{eot,svg,ttf,woff,woff2}`).pipe(gulp.dest(dist));
}

function copyImages() {
  return gulp.src(`${src}/**/*.{png,gif,jpg,ico}`).pipe(gulp.dest(dist));
}

function cleanPublic() {
  return del(["public/**/*"]);
}

function html() {
  return gulp.src("./index.html").pipe(livereload());
}

function watch() {
  livereload.listen();
  gulp.watch("./index.html", html);
  gulp.watch(`${src}/**/*.js`, gulp.series(gulpBower, scripts));
  gulp.watch(`${src}/**/*.scss`, gulpSass);
}

const main = gulp.series(
  cleanPublic,
  gulpBower,
  gulpSass,
  copy,
  scripts,
  watch,
  gulpNodemon
);

gulp.task("default", main);
