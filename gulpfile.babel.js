import gulp from 'gulp';
import gutil from 'gulp-util';
import gulpLoadPlugins from 'gulp-load-plugins';
import minimist from 'minimist';
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
gulp.pkg = pkg;

// 引入
require('./tools/gulp/build');
require('./tools/gulp/demo');
require('./tools/gulp/bump');
require('./tools/gulp/config');
require('./tools/gulp/test');

// 产品相关自定义任务
require('./tools/gulp/ap');
require('./tools/gulp/ac');
require('./tools/gulp/axc');

// 任务开始时全局提示信息

// 删除
gulp.task('clean', () => del([paths.build, paths.release]));

gulp.task('pub:path', () => {
  const publicPathReg = /publicPath: '(.*)'/g;
  const utilIndexPath = 'shared/utils/index.js';
  let pubWebPath = paths.pubWebPath;

  if (argv.p) {
    pubWebPath = argv.p;
  }

  // 处理 demo发布时修改的 sync的链接
  gulp.src(utilIndexPath)
    .pipe($.replace("require('./lib/sync_demo')", "require('./lib/sync')"))
    .pipe(gulp.dest('shared/utils/'));

  gutil.log(gutil.colors.red('切换web发布根目录：'), gutil.colors.magenta(pubWebPath));
  return gulp.src(paths.pubWebpack)
    .pipe($.replace(publicPathReg, `publicPath: '${pubWebPath}'`))
    .pipe(gulp.dest('./'));
});

gulp.task('open:src', shell.task([
  'babel-node ./tools/srcServer.js',
]));
gulp.task('open:dist', ['build'], shell.task(['babel-node tools/distServer.js']));

gulp.task('default', ['open:src']);
