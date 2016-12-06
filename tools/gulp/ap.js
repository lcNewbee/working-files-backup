const del = require('del');
const gulp = require('gulp');
const gutil = require('gulp-util');
const runSequence = require('run-sequence');
const argv = require('minimist')(process.argv.slice(2));
const zip = require('gulp-zip');

const paths = gulp.paths;

// 发布 Access Pointer 版本
gulp.task('clean:pubap', () => {
  let distPath = paths.pubAp;

  if (argv.d) {
    distPath = argv.d;
  }

  return del([distPath], { force: true });
});

gulp.task('clean:pubAip5', () => {
  let distPath = paths.pubAip5;
  const dist = '../AIP5_web';
  if (argv.d) {
    distPath = argv.d;
  }

  return del([distPath, `${dist}.zip`], { force: true });
});

gulp.task('clean:pubAip10', () => {
  let distPath = paths.pubAip10;
  const dist = '../AIP10_web';
  if (argv.d) {
    distPath = argv.d;
  }

  return del([distPath, `${dist}.zip`], { force: true });
});

gulp.task('pub:copyap', () => {
  let distPath = paths.pubAp;

  if (argv.d) {
    distPath = argv.d;
  }

  return gulp.src([`${paths.build}/**/*`, `!${paths.build}/portal/`, `!${paths.build}/portal/**/*`])
    .pipe(gulp.dest(distPath));
});

gulp.task('pub:copyAip5', () => {
  let distPath = paths.pubAip5;

  if (argv.d) {
    distPath = argv.d;
  }

  return gulp.src([`${paths.build}/**/*`, `!${paths.build}/portal/`, `!${paths.build}/portal/**/*`])
    .pipe(gulp.dest(distPath));
});

gulp.task('pub:copyAip10', () => {
  let distPath = paths.pubAip10;

  if (argv.d) {
    distPath = argv.d;
  }

  return gulp.src([`${paths.build}/**/*`, `!${paths.build}/portal/`, `!${paths.build}/portal/**/*`])
    .pipe(gulp.dest(distPath));
});

gulp.task('pub:ap', (callback) => {
  let distPath = paths.pubAp;

  if (argv.d) {
    distPath = argv.d;
  }

  gutil.log('切换 AP 发布目标目录：', gutil.colors.magenta(distPath));
  runSequence('pub:path', 'config:ap', ['clean:pubap', 'build'], 'pub:copyap', callback);
});

gulp.task('pub:app', (callback) => {
  let distPath = paths.pubAp;

  if (argv.d) {
    distPath = argv.d;
  }

  gutil.log('切换 AP 发布目标目录：', gutil.colors.magenta(distPath));
  runSequence('pub:path', 'config', ['clean:pubap', 'build'], 'pub:copyap', callback);
});

// 压缩aip5文件夹
gulp.task('compressAip5', () => {
  let distPath = paths.pubAip5;
  if (argv.d) {
    distPath = argv.d;
  }
  const arr = distPath.split('/');
  const name = arr[arr.length - 1];
  const dist = arr.slice(0, 1).join('/');
  return gulp.src(`${distPath}/**`)
        .pipe(zip(`${name}.zip`))
        .pipe(gulp.dest(dist));
});

// 压缩aip10文件夹
gulp.task('compressAip10', () => {
  let distPath = paths.pubAip10;
  if (argv.d) {
    distPath = argv.d;
  }
  const arr = distPath.split('/');
  const name = arr[arr.length - 1];
  const dist = arr.slice(0, 1).join('/');
  return gulp.src(`${distPath}/**`)
        .pipe(zip(`${name}.zip`))
        .pipe(gulp.dest(dist));
});

gulp.task('pub:aip5', (callback) => {
  let distPath = paths.pubAip5;

  if (argv.d) {
    distPath = argv.d;
  }

  gutil.log('切换 AP 发布目标目录：', gutil.colors.magenta(distPath));
  runSequence('pub:path', 'config:aip5', ['clean:pubAip5', 'build'], 'pub:copyAip5', 'compressAip5', callback);
});

gulp.task('pub:aip10', (callback) => {
  let distPath = paths.pubAip10;

  if (argv.d) {
    distPath = argv.d;
  }

  gutil.log('切换 AP 发布目标目录：', gutil.colors.magenta(distPath));
  runSequence('pub:path', 'config:aip10', ['clean:pubAip10', 'build'], 'pub:copyAip10', 'compressAip10', callback);
});


