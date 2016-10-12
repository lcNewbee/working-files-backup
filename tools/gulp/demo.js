var gulp = require('gulp');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var $ = require('gulp-load-plugins')();
var paths = gulp.paths;
var argv = require('minimist')(process.argv.slice(2));

gulp.task('demo:copy', function() {
  var name = 'ac';

  if(argv.n) {
    name = argv.n;
  }
  return gulp.src(['./tools/data/' + name + '/*.*', './tools/data/*.*'])
    .pipe(rename(function(path) {
      path.extname = '';
    }))
    .on('end', function() {
      gutil.log('拷贝Ajax测试文件', gutil.colors.magenta(name));
    })
    .pipe(gulp.dest(paths.build + '/goform/'));
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


gulp.task('demo', function(callback) {
  runSequence('clean', 'config', 'build', 'demo:copy', 'demo:serve', callback);
});
