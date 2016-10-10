var gulp = require('gulp');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');
var paths = gulp.paths;

gulp.task('demo:copy', function() {
  gulp.src(['./tools/data/axc/*.*', './tools/data/*.*'])
    .pipe(gulp.dest(paths.build + '/goform/'));
});


gulp.task('demo', function(callback) {
  runSequence(['clean', 'build'], 'demo:copy', callback);
});
