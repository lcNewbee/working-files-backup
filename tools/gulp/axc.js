const del = require('del');
const gulp = require('gulp');
const gutil = require('gulp-util');
const runSequence = require('run-sequence');
const $ = require('gulp-load-plugins')();
const argv = require('minimist')(process.argv.slice(2));
const shell = require('gulp-shell');
const zip = require('gulp-zip');

const paths = gulp.paths;
let distPath = paths.pubAxc;
let name = 'axc';

if (argv.d) {
  distPath = argv.d;
}

if (argv.n) {
  name = argv.n;
}

// 发布硬AC版本
// 发布 AXC版本
gulp.task('clean:pubaxc', () => {
  return del([distPath], { force: true });
});
gulp.task('pub:copyaxc', () => {
  if (argv.z) {
    return gulp.src([`${paths.build}/**/*`, `${paths.php}/**/*`])
      .pipe(gulp.dest(distPath))
      .pipe(zip(`${name}.zip`))
      .pipe(gulp.dest(paths.tmp));
  }

  return gulp.src([`${paths.build}/**/*`, `${paths.php}/**/*`])
    .pipe(gulp.dest(distPath));
});
gulp.task('build:axc', () =>
  gulp.src([`${paths.build}/scripts/**/*`])
    .pipe($.replace(/(\/?)goform\//g, 'index.php/goform/'))
    .pipe($.replace('/~zhangfang/axc/', ''))
    .pipe(gulp.dest(`${paths.build}/scripts/`)),
);

gulp.task('pub:axc', (callback) => {
  gutil.log('切换 AXC 发布目标目录：', gutil.colors.magenta(distPath));
  runSequence('clean:pubaxc', 'test', 'config:axc', 'pub:path', ['build'], 'build:axc', 'pub:copyaxc', callback);
});

gulp.task('pub:axcIndia', shell.task([
  `gulp pub -n axcIndia -d ${paths.pubAxcIndia}`,
], {
  env: { FORCE_COLOR: true },
}));

gulp.task('pub:axc2.0', shell.task([
  `gulp pub -n axc2.0 -d ${paths.dist}`,
], {
  env: { FORCE_COLOR: true },
}));

gulp.task('pub:axc3.0', shell.task([
  `gulp pub -n axc3.0 -d ${paths.pubAxcR1}`,
], {
  env: { FORCE_COLOR: true },
}));
