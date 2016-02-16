var gulp         = require('gulp');
var browserSync  = require('browser-sync').create();
var sass         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var browserify   = require('gulp-browserify');
var concat       = require('gulp-concat');

// variables
var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
};

var autoprefixerOptions = {
  browsers: ['last 2 versions', '> 5%', 'Firefox ESR'],
  cascade: false
};

var jsSources = [
  'assets/js/first.js',
  'assets/js/second.js'
];

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {
  browserSync.init({
      server: "./"
  });

  gulp.watch(["assets/css/*.scss", "assets/css/**/*.scss"], ['sass']);
  gulp.watch("assets/js/**", ['js']);
  gulp.watch("*.html").on('change', browserSync.reload);
  gulp.watch("views/*.html").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
  return gulp.src("assets/css/style.scss")
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("assets/css"))
    .pipe(browserSync.stream());
});

// Compile all js files and auto-inject into browsers
gulp.task('js', function() {
  return gulp.src(jsSources)
    .pipe(concat('script.js'))
    .pipe(browserify())
    .pipe(gulp.dest('assets/js'))
    .pipe(browserSync.stream());
});

gulp.task('default', ['js', 'sass', 'serve']);
