const gulp = require('gulp');
const gutil = require('gulp-util');
const $ = require('gulp-load-plugins')();
const argv = require('minimist')(process.argv.slice(2));

const paths = gulp.paths;
const configReg = /'\.\/config\/(\w+)'/g;
const mainPath = `${paths.src}/index.jsx`;

function configProduct(name) {
  return gulp.src(mainPath)
    .pipe($.replace(configReg, `'./config/${name}'`))
    .on('end', () => {
      gutil.log('切换到产品：', gutil.colors.magenta(name));
    })
    .pipe(gulp.dest(paths.src));
}

gulp.task('config', (callback) => {
  let ret = callback;
  if (argv.n) {
    ret = configProduct(argv.n);
  } else {
    ret = callback();
  }
  return ret;
});
gulp.task('config:axc', () => configProduct('axc'));
gulp.task('config:ap', () => configProduct('ap'));
gulp.task('config:ac', () => configProduct('ac'));
