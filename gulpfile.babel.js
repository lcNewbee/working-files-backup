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
  pubAxcIndia: '../axc_branch_india/ac/apps/web/web',
  pubAp: '../qsdk/package/comlanos/goahead/files/web',
  webpack: './webpack.config.dev.js',
  pubWebpack: './webpack.config.production.js',
  pubAIP5: '../platform/COMLANOS/package/goahead/files/AIP5_web',
  pubAIP10: '../platform/COMLANOS/package/goahead/files/AIP10_web',
  pubAEC120: '../platform/COMLANOS/package/goahead/files/AEC120_web',
  pubASW3: '../platform/COMLANOS/package/goahead/files/ASW3_web',
  pubASC175: '../platform/COMLANOS/package/goahead/files/ASC175_web',
  pubASC120: '../platform/COMLANOS/package/goahead/files/ASC120_web',
};
gulp.pkg = pkg;

// 引入
require('./tools/gulp/build');
require('./tools/gulp/demo');
require('./tools/gulp/bump');
require('./tools/gulp/config');
require('./tools/gulp/test');

// 发布
require('./tools/gulp/pub');

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
], {
  env: { FORCE_COLOR: true },
}));
gulp.task('open:dist', ['build'], shell.task(['babel-node tools/distServer.js']));

gulp.task('default', ['open:src']);

// 处理浏览器标题
function changeTitle(name) {
  return gulp.src([`${paths.build}/index.html`])
      .pipe($.replace('<title>Axilspot Access Manager</title>', `<title>Axilspot ${name}</title>`))
      .pipe(gulp.dest(paths.build));
}
gulp.task('changeAIP5Title', () => changeTitle('AIP5'));
gulp.task('changeAIP10Title', () => changeTitle('AIP10'));
gulp.task('changeAEC120Title', () => changeTitle('AEC120'));
gulp.task('changeASC175Title', () => changeTitle('ASC175'));
gulp.task('changeASW3Title', () => changeTitle('ASW3'));
gulp.task('changeASC120Title', () => changeTitle('ASC120'));

