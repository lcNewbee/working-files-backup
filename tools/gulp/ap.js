const del = require('del');
const gulp = require('gulp');
const gutil = require('gulp-util');
const runSequence = require('run-sequence');
const argv = require('minimist')(process.argv.slice(2));

const paths = gulp.paths;

// 发布 Access Pointer 版本
gulp.task('clean:pubap', () => del([paths.pubAp], { force: true }));
gulp.task('pub:copyap', () => {
  let distPath = paths.pubAp;

  if (argv.d) {
    distPath = argv.d;
  }

  return gulp.src(`${paths.build}/**/*`)
    .pipe(gulp.dest(distPath));
});
gulp.task('pub:ap', (callback) => {
  let distPath = paths.pubAp;

  if (argv.d) {
    distPath = argv.d;
  }

  gutil.log('切换 AP 发布目标目录：', gutil.colors.magenta(distPath));
  runSequence('pub:path', ['clean:pubap', 'build'], 'pub:copyap', callback);
});
