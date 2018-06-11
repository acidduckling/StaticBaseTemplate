require('dotenv').config();
var gulp = require('gulp');
var util = require('gulp-util');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var cached = require('gulp-cached');

console.log('Current Environment: ' + process.env.ENVIRONMENT);
var isProd = process.env.ENVIRONMENT && process.env.ENVIRONMENT.toLowerCase() === 'production';

gulp.task('compile-sass', function() {
  return gulp
    .src([
      'node_modules/bootstrap/scss/bootstrap.scss',
      'node_modules/font-awesome/scss/font-awesome.scss',
      'src/scss/*.scss'
    ])
    .pipe(cached())
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: isProd ? 'compressed' : 'nested' }).on('error', sass.logError))
    .pipe(sourcemaps.write('./maps/'))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});

gulp.task('compile-js', function() {
  return gulp
    .src('src/js/*.js')
    .pipe(cached())
    .pipe(sourcemaps.init())
    .pipe(isProd ? uglify({ compress: true, mangle: true }) : util.noop())
    .pipe(sourcemaps.write('maps/'))
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());
});

gulp.task('move-js', function() {
  return gulp
    .src([
      'node_modules/bootstrap/dist/js/bootstrap.min.js',
      'node_modules/tether/dist/js/tether.min.js',
      'node_modules/jquery/dist/jquery.min.js'
    ])
    .pipe(cached())
    .pipe(gulp.dest('dist/js/'))
    .pipe(browserSync.stream());
});

gulp.task('move-fonts', function() {
  return gulp
    .src(['node_modules/font-awesome/fonts/*', 'src/fonts/**/*'])
    .pipe(cached())
    .pipe(gulp.dest('dist/fonts'))
    .pipe(browserSync.stream());
});

gulp.task('move-images', function() {
  return gulp
    .src(['src/img/**/*'])
    .pipe(cached())
    .pipe(gulp.dest('dist/img'))
    .pipe(browserSync.stream());
});

gulp.task('move-html', function() {
  var result = gulp
    .src(['src/**/*.html'])
    .pipe(cached())
    .pipe(gulp.dest('dist/'));
  if (browserSync.active) browserSync.reload();
  return result;
});

// Launch Server and Watches
gulp.task('launch-server', function() {
  browserSync.init({ server: './dist/', open: false });
  gulp.watch(['src/scss/*.scss'], ['compile-sass']);
  gulp.watch(['src/js/*.js'], ['compile-js']);
  gulp.watch(['src/*.html'], ['move-html']);
  gulp.watch(['src/img/**/*'], ['move-images']);
});

gulp.task('build', ['compile-sass', 'compile-js', 'move-html', 'move-js', 'move-fonts', 'move-images']);

// Default task - run through all build and copy tasks
gulp.task('default', ['build', 'launch-server']);
