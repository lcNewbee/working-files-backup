const gulp = require('gulp');
const gutil = require('gulp-util');
const $ = require('gulp-load-plugins')();
const argv = require('minimist')(process.argv.slice(2));

const paths = gulp.paths;
const configReg = /'\.\/config\/(\w+)'/g;
const mainPath = `${paths.src}/index.jsx`;

gulp.task('config', () => {
  let name = 'ac';

  if (argv.n) {
    name = argv.n;
  }
  return gulp.src(mainPath)
    .pipe($.replace(configReg, `'./config/${name}'`))
    .on('end', () => {
      gutil.log('切换到产品：', gutil.colors.magenta(name));
    })
    .pipe(gulp.dest(paths.src));
});

gulp.task('config:axc', () => {
  return gulp.src(mainPath)
    .pipe($.replace(configReg, "'./config/axc'"))
    .on('end', () => {
      gutil.log('切换到产品：', gutil.colors.magenta('AXC'));
    })
    .pipe(gulp.dest(paths.src));
});

gulp.task('config:ap', () => {
  return gulp.src(mainPath)
    .pipe($.replace(configReg, "'./config/ap'"))
    .on('end', () => {
      gutil.log('切换到产品：', gutil.colors.magenta('AP'));
    })
    .pipe(gulp.dest(paths.src));
});
