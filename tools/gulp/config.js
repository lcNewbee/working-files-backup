const gulp = require('gulp');
const gutil = require('gulp-util');
const $ = require('gulp-load-plugins')();
const argv = require('minimist')(process.argv.slice(2));

const paths = gulp.paths;
const configReg = /'\.\/config\/(\w+)'/g;
const mainPath = [`${paths.src}/index.jsx`, `${paths.src}/index_pub.jsx`];

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
gulp.task('config:AIP5', () => configProduct('AIP5'));
gulp.task('config:AIP10', () => configProduct('AIP10'));
gulp.task('config:extraHelp', () => configProduct('extraHelp'));
gulp.task('config:AEC120', () => configProduct('AEC120'));
gulp.task('config:ASC175', () => configProduct('ASC175'));
gulp.task('config:ASW3', () => configProduct('ASW3'));
gulp.task('config:ASC120', () => configProduct('ASC120'));
gulp.task('config:AEC60', () => configProduct('AEC60'));
gulp.task('config:ASC3', () => configProduct('ASC3'));
gulp.task('config:ASC6', () => configProduct('ASC6'));
gulp.task('config:ASW120', () => configProduct('ASW120'));
