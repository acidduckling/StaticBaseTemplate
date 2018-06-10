var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var cssnano = require('gulp-cssnano');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('compile-sass', function() {
  return gulp
    .src([
      'node_modules/bootstrap/scss/bootstrap.scss',
      'node_modules/font-awesome/scss/font-awesome.scss',
      'src/scss/*.scss'
    ])
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(cssnano())
    .pipe(sourcemaps.write('./maps/'))
    .pipe(
      rename({
        extname: '.min.css'
      })
    )
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});

gulp.task('compile-js', function() {
  return gulp
    .src('src/js/*.js')
    .pipe(sourcemaps.init())
    .pipe(
      uglify({
        compress: true,
        mangle: true
      })
    )
    .pipe(sourcemaps.write('dist/js/maps/'))
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
    .pipe(gulp.dest('dist/js/'))
    .pipe(browserSync.stream());
});

gulp.task('move-fonts', function() {
  return gulp
    .src(['node_modules/font-awesome/fonts/*', 'src/fonts/**/*'])
    .pipe(gulp.dest('dist/fonts'))
    .pipe(browserSync.stream());
});

gulp.task('move-html', function() {
  var result = gulp.src(['src/**/*.html']).pipe(gulp.dest('dist/'));
  if (browserSync.active) browserSync.reload();
  return result;
});

// Run sass when server runs
// Run server
// Watch for any changes in src/scss folder and reload the browser
// Watch for HTML changes
gulp.task('launch-server', function() {
  browserSync.init({
    server: './dist/',
    open: false
  });
  gulp.watch(['src/scss/*.scss'], ['compile-sass']);
  gulp.watch(['src/js/*.js'], ['compile-sass']);
  gulp.watch(['src/*.html'], ['move-html']);
});

// Run gulp
// Launch server and browser
// execute JS task
gulp.task('default', [
  'compile-sass',
  'compile-js',
  'move-html',
  'move-js',
  'move-fonts',
  'launch-server'
]);
