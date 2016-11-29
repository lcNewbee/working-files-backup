const gulp = require('gulp');
const shell = require('gulp-shell');
const staticHash = require('gulp-static-hash');
const runSequence = require('run-sequence');
const $ = require('gulp-load-plugins')();

const paths = gulp.paths;

gulp.task('webpack', shell.task([
  'webpack --config webpack.config.production.js',
]));

gulp.task('build:assets', () =>
  gulp.src(`${paths.src}/assets/**/*`)
    .pipe(gulp.dest(paths.build))
);

gulp.task('build:html', () =>
  gulp.src(`${paths.build}/index.html`)
    .pipe(staticHash({ asset: 'static' }))
    .pipe(gulp.dest(paths.build))
);

gulp.task('build:header', () =>
  gulp.src(`${paths.build}/scripts/bundle.js`)
    .pipe($.header(`var a_165F8BA5ABE1A5DA = 0;var v_165F8BA5ABE1A5DA = "${gulp.pkg.version}";`))
    .pipe(gulp.dest(`${paths.build}/scripts/`))
);
gulp.task('build:complete', () => {
  const configReg = /'\.\/config\/(\w+)'/g;

  return gulp.src(paths.pubWebpack)
    .pipe($.replace(configReg, "publicPath: '/'"))
    .pipe(gulp.dest('./'));
});
gulp.task('build', (callback) => {
  runSequence(
    'clean',
    ['build:assets', 'webpack'],
    'build:complete',
    callback,
  );
});
