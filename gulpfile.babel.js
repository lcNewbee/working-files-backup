import gulp from 'gulp';
import gutil from 'gulp-util';
import gulpLoadPlugins from 'gulp-load-plugins';
import minimist from 'minimist';
import runSequence from 'run-sequence';
import staticHash from 'gulp-static-hash';
import del from 'del';
import shell from 'gulp-shell';

import pkg from './package.json';

const $ = gulpLoadPlugins();
const argv = minimist(process.argv.slice(2));
const paths = gulp.paths = {
  tmp: '.tmp',
  build: 'build',
  release: 'release',
  src: 'src',
  php: 'php/',
  pubWebPath: '/',
  pub: 'dist',
  pubAc: '../win_ac/software/web/',
  pubAxc: '../axc/apps/web/web',
  pubAp: '../qsdk/package/comlanos/goahead/files/web',
  webpack: './webpack.config.dev.js',
  pubWebpack: './webpack.config.production.js',
};

// 引入
require('./tools/gulp/demo');
require('./tools/gulp/bump');
require('./tools/gulp/config');
require('./tools/gulp/test');

// 删除
gulp.task('clean', () => del([paths.build, paths.release]));

gulp.task('open:src', shell.task([
  'babel-node ./tools/srcServer.js',
]));

gulp.task('webpack', shell.task([
  'webpack --config webpack.config.production.js',
  'babel-node tools/buildHtml.js',
]));

gulp.task('webpack:test', shell.task([
  'webpack --config webpack.config.test.js',
  'babel-node tools/buildHtml.js',
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
    .pipe($.header(`var a_165F8BA5ABE1A5DA = 0;var v_165F8BA5ABE1A5DA = "${pkg.version}";`))
    .pipe(gulp.dest(`${paths.build}/scripts/`))
);
gulp.task('build', (callback) => {
  runSequence('clean', ['build:assets', 'webpack'], 'build:header', 'build:html', callback);
});


gulp.task('open:dist', ['build'], shell.task(['babel-node tools/distServer.js']));

gulp.task('clean:pubac', () => {
  let distPath = paths.pubAc;

  if (argv.d) {
    distPath = argv.d;
  }
  return del([distPath], { force: true });
});

gulp.task('pub:path', () => {
  const publicPathReg = /publicPath: '(.*)'/g;
  let pubWebPath = paths.pubWebPath;

  if (argv.p) {
    pubWebPath = argv.p;
  }

  gutil.log('切换web发布根目录：', gutil.colors.magenta(pubWebPath));
  return gulp.src(paths.pubWebpack)
    .pipe($.replace(publicPathReg, `publicPath: '${pubWebPath}'`))
    .pipe(gulp.dest('./'));
});

gulp.task('pub:copy', () => {
  let distPath = paths.pubAc;

  if (argv.d) {
    distPath = argv.d;
  }

  gutil.log('切换 AC 发布目标目录：', gutil.colors.magenta(distPath));

  return gulp.src(`${paths.build}/**/*`)
    .pipe(gulp.dest(distPath));
});

// 发布 Access Manager 正式版
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
  runSequence('bump:dev', ['clean:pubac', 'build'], 'pub:copy', callback);
});

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

// 发布硬AC版本
// 发布 AXC版本
gulp.task('clean:pubaxc', () => {
  let distPath = paths.pubAxc;

  if (argv.d) {
    distPath = argv.d;
  }

  return del([distPath], { force: true });
});
gulp.task('pub:copyaxc', () => {
  let distPath = paths.pubAxc;

  if (argv.d) {
    distPath = argv.d;
  }

  return gulp.src([`${paths.build}/**/*`, `${paths.php}/**/*`])
    .pipe(gulp.dest(distPath));
});
gulp.task('build:axc', () =>
  gulp.src([`${paths.build}/scripts/**/*`])
    .pipe($.replace(/(\/?)goform/g, 'index.php/goform/'))
    .pipe($.replace('/~zhangfang/axc/', ''))
    .pipe(gulp.dest(`${paths.build}/scripts/`))
);

gulp.task('pub:axc', (callback) => {
  let distPath = paths.pubAxc;

  if (argv.d) {
    distPath = argv.d;
  }

  gutil.log('切换 AXC 发布目标目录：', gutil.colors.magenta(distPath));
  runSequence('pub:path', ['build'], 'build:axc', 'pub:copyaxc', callback);
});


gulp.task('default', ['open:src']);
