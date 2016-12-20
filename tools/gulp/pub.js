const del = require('del');
const gulp = require('gulp');
const gutil = require('gulp-util');
const runSequence = require('run-sequence');
const $ = require('gulp-load-plugins')();
const argv = require('minimist')(process.argv.slice(2));

const paths = gulp.paths;

// 发布硬AC版本
// 发布 AXC版本
gulp.task('pub:clean', () => {
  let distPath = paths.pub;

  if (argv.d) {
    distPath = argv.d;
  }

  return del([distPath], { force: true });
});

gulp.task('pub:build', () =>
  gulp.src([`${paths.build}/scripts/**/*`])
    .pipe($.replace(/(\/?)goform\//g, 'index.php/goform/'))
    .pipe($.replace('/~zhangfang/axc/', ''))
    .pipe(gulp.dest(`${paths.build}/scripts/`)),
);

gulp.task('pub:copy', () => {
  let distPath = paths.pub;

  if (argv.d) {
    distPath = argv.d;
  }

  return gulp.src([`${paths.build}/**/*`, `${paths.php}/**/*`])
    .pipe(gulp.dest(distPath));
});


gulp.task('pub', (callback) => {
  let distPath = paths.pub;

  if (argv.d) {
    distPath = argv.d;
  }

  gutil.log('切换发布目标目录：', gutil.colors.magenta(distPath));

  runSequence('pub:clean', 'config', 'pub:path', ['build'], 'pub:build', 'pub:copy', callback);
});
