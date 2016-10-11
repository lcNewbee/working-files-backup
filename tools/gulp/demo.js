var gulp = require('gulp');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var paths = gulp.paths;

gulp.task('demo:copy', function() {
  gulp.src(['./tools/data/axc/*.*', './tools/data/*.*'])
    .pipe(rename(function(path) {
      path.extname = '';
    }))
    .pipe(gulp.dest(paths.build + '/goform/'));
});


gulp.task('demo', function(callback) {
  runSequence(['clean', 'build'], 'demo:copy', 'demo:serve', callback);
});

gulp.task('demo:serve', function(callback) {

  // Run Browsersync
  browserSync({
    port: 3000,
    ui: {
      port: 3001,
    },
    server: {
      baseDir: 'build',
    },
  });

  callback();
});
