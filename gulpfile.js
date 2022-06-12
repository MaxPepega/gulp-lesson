const gulp = require('gulp'); 
const gulpPug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const gulpPlumber = require('gulp-plumber');
const gulpBabel = require('gulp-babel');
const gulpAutoprefixer = require('gulp-autoprefixer');
const gulpCleanCss = require('gulp-clean-css');
const gulpUglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const del = require('del');

function clean () {
  return del('build');
};


function pug2html() {
  return gulp.src('develop/pug/pages/*.pug')
  .pipe(gulpPlumber())
  .pipe(gulpPug({
    pretty: true
  }))
  .pipe(gulpPlumber.stop())
  .pipe(gulp.dest('build'))
};

function scss2css() {
  return gulp.src('develop/static/styles/styles.scss')
  .pipe(gulpPlumber())
  .pipe(sass())
  .pipe(browserSync.stream())
  .pipe(gulpCleanCss())
  .pipe(gulpAutoprefixer())
  .pipe(gulpPlumber.stop())
  .pipe(gulp.dest('build/static/css/'))
};

function script() {
  return gulp.src('develop/static/js/main.js')
  .pipe(gulpBabel({
    presets: ['@babel/env']}))
  .pipe(gulpUglify())
  .pipe(gulp.dest('build/static/js/'))
};

function watch () {
  browserSync.init({
    server: {
      baseDir: "build"
    }
  });
  gulp.watch("develop/pug/**/*.pug", pug2html);
  gulp.watch("develop/static/styles/**/*.scss", scss2css);
  gulp.watch("build/*.html").on('change', browserSync.reload);
};

exports.default = gulp.series( clean, pug2html, scss2css, script, watch );