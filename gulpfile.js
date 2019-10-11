const gulp = require('gulp');
const sourcemaps = require("gulp-sourcemaps");
const sass = require('gulp-sass');
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const browserSync = require('browser-sync').create();

function style(done) {
  return gulp.src('./src/scss/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream());
    
  done();
}

function watch() {
  browserSync.init({ server: { baseDir: './dist' } });

  gulp.watch('./src/scss/*.scss', style);
  gulp.watch('./src/scss/**/*.scss', style);
  gulp.watch('./src/**/**/*.html').on('change', browserSync.reload);
  gulp.watch('./dist/**/**/*.html').on('change', browserSync.reload);
  gulp.watch('./src/javascript/**/**/*.js').on('change', browserSync.reload)
}

exports.style = style;
exports.watch = watch;
var build = gulp.parallel(style, watch);
gulp.task('default', build);
