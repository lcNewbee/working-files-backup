const del = require('del');
const gulp = require('gulp');
const gutil = require('gulp-util');
const runSequence = require('run-sequence');
const $ = require('gulp-load-plugins')();
const argv = require('minimist')(process.argv.slice(2));
const zip = require('gulp-zip');

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

gulp.task('pub:build', (callback) => {
  // 产品系列：axc（默认值）, ap, ac
  let productSeries = 'axc';

  if (argv.n && argv.n.indexOf('axc') !== 0) {
    productSeries = argv.n;
  }

  // 只有在 AXC 系列才需要做，goform 路径相关替换
  if (productSeries === 'axc') {
    return gulp.src([`${paths.build}/scripts/**/*`])
      .pipe($.replace(/(\/?)goform\//g, 'index.php/goform/'))
      .pipe($.replace('/~zhangfang/axc/', ''))
      .pipe(gulp.dest(`${paths.build}/scripts/`));
  }
  return callback();
});

gulp.task('pub:copy', () => {
  let distPath = paths.pub;
  let name = 'axc';

  if (argv.d) {
    distPath = argv.d;
  }
  if (argv.n) {
    name = argv.n;
  }

  if (argv.z) {
    return gulp.src([`${paths.build}/**/*`, `${paths.php}/**/*`])
      .pipe(gulp.dest(distPath))
      .pipe(zip(`${name}.zip`))
      .pipe(gulp.dest(paths.tmp));
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

  runSequence(['pub:clean', 'test'], 'config', 'pub:path', ['build'], 'pub:build', 'pub:copy', callback);
});
