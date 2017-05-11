const gulp = require('gulp');
const gutil = require('gulp-util');
const gulpLoadPlugins = require('gulp-load-plugins');
const minimist = require('minimist');
const del = require('del');
const shell = require('gulp-shell');

const pkg = require('./package.json');

const $ = gulpLoadPlugins();
const argv = minimist(process.argv.slice(2));
const paths = {
  tmp: '.tmp',
  build: 'build',
  zip: 'zip',
  release: 'release',
  src: 'src',
  php: 'php/',
  pubWebPath: '/',
  pub: 'dist',
  pubAc: '../win_ac/software/web/',
  pubAxc: '../axc_r1/web/web',
  pubAxcR1: '../axc_r1/web/web',
  pubAxcIndia: '../axc_branch_india/ac/apps/web/web',
  pubAxcMonitor: '../axc_monitor/apps/web/web',
  pubAp: '../qsdk/package/comlanos/goahead/files/web',
  webpack: './webpack.config.dev.js',
  pubWebpack: './webpack.config.production.js',
  pubAIP5: '../svn/ap_web/AIP5_web',
  pubAIP10: '../svn/ap_web/AIP10_web',
  pubAIP10L: '../svn/ap_web/AIP10L_web',
  pubAEC120: '../svn/ap_web/AEC120_web',
  pubAEC175: '../svn/ap_web/AEC175_web',
  pubASW3: '../svn/ap_web/ASW3_web',
  pubASC175: '../svn/ap_web/ASC175_web',
  pubASC120: '../svn/ap_web/ASC120_web',
  pubAEC60: '../svn/ap_web/AEC60_web',
  pubASC3: '../svn/ap_web/ASC3_web',
  pubASC6: '../svn/ap_web/ASC6_web',
  pubASW120: '../svn/ap_web/ASW120_web',
};

// 默认值
gulp.pkg = pkg;
gulp.paths = paths;

// 获取 App 名称

// 从命令行的参数获取
gulp.shellArgv = argv;

// 引入
require('./tools/gulp/help');
require('./tools/gulp/build');
require('./tools/gulp/demo');
require('./tools/gulp/bump');
require('./tools/gulp/config');
require('./tools/gulp/test');
require('./tools/gulp/serve');

// 发布
require('./tools/gulp/pub');

// 产品相关自定义任务
require('./tools/gulp/ap');
require('./tools/gulp/ac');
require('./tools/gulp/axc');

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
  'babel-node ./tools/srcServer.js --colors',
], {
  env: { FORCE_COLOR: true },
}));

gulp.task('open:build', ['build'], shell.task(['babel-node tools/buildServer.js']));

gulp.task('default', ['open:src']);

// 处理浏览器标题
function changeTitle(name) {
  return gulp.src([`${paths.build}/index.html`])
      .pipe($.replace('<title>Axilspot Access Manager</title>', `<title>Axilspot WIFI ${name}</title>`))
      .pipe(gulp.dest(paths.build));
}
gulp.task('changeAIP5Title', () => changeTitle('Bridge'));
gulp.task('changeAIP10Title', () => changeTitle('AP'));
gulp.task('changeAIP10LTitle', () => changeTitle('AP'));
gulp.task('changeAEC120Title', () => changeTitle('AP'));
gulp.task('changeAEC175Title', () => changeTitle('AP'));
gulp.task('changeASC175Title', () => changeTitle('AP'));
gulp.task('changeASW3Title', () => changeTitle('AP'));
gulp.task('changeASC120Title', () => changeTitle('AP'));
gulp.task('changeAEC60Title', () => changeTitle('AP'));
gulp.task('changeASC3Title', () => changeTitle('AP'));
gulp.task('changeASC6Title', () => changeTitle('AP'));
gulp.task('changeASW120Title', () => changeTitle('AP'));

