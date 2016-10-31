const del = require('del');
const gulp = require('gulp');
const gutil = require('gulp-util');
const runSequence = require('run-sequence');
const argv = require('minimist')(process.argv.slice(2));

const paths = gulp.paths;

// 发布 Access Manager 正式版
gulp.task('clean:pubac', () => {
  let distPath = paths.pubAc;

  if (argv.d) {
    distPath = argv.d;
  }
  return del([distPath], { force: true });
});
gulp.task('pub:copyac', () => {
  let distPath = paths.pubAc;

  if (argv.d) {
    distPath = argv.d;
  }

  gutil.log('切换 AC 发布目标目录：', gutil.colors.magenta(distPath));

  return gulp.src(`${paths.build}/**/*`)
    .pipe(gulp.dest(distPath));
});

gulp.task('pub:ac', (callback) => {
  let distPath = paths.pubAc;

  if (argv.d) {
    distPath = argv.d;
  }

  gutil.log('切换发布目标目录：', gutil.colors.magenta(distPath));
  runSequence('pub:path', ['clean:pubac', 'build'], 'pub:copy', callback);
});

// 发布 Access Manager 测试版本
gulp.task('dev:ac', (callback) => {
  runSequence('bump:dev', ['clean:pubac', 'build'], 'pub:copyac', callback);
});
