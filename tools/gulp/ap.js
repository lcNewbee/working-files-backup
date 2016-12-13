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

gulp.task('pub:copyap', () => {
  let distPath = paths.pubAp;

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

// 清除发布文件夹中的文件
function cleanPubPath(dstPath) {
  let distPath = dstPath;
  const dist = distPath.split('/').slice(-1)[0];
  if (argv.d) {
    distPath = argv.d;
  }

  return del([distPath, `${dist}.zip`], { force: true });
}

gulp.task('clean:pubAIP5', () => cleanPubPath(paths.pubAIP5));
gulp.task('clean:pubAIP10', () => cleanPubPath(paths.pubAIP10));
gulp.task('clean:pubAEC120', () => cleanPubPath(paths.pubAEC120));
gulp.task('clean:pubASC175', () => cleanPubPath(paths.pubASC175));
gulp.task('clean:pubASW3', () => cleanPubPath(paths.pubASW3));

// 将编译好的文件拷贝到发布文件夹
function copyBuild2PubPath(dstPath) {
  let distPath = dstPath;
  if (argv.d) {
    distPath = argv.d;
  }
  return gulp.src([`${paths.build}/**/*`, `!${paths.build}/portal/`, `!${paths.build}/portal/**/*`])
    .pipe(gulp.dest(distPath));
}

gulp.task('pub:copyAIP5', () => copyBuild2PubPath(paths.pubAIP5));
gulp.task('pub:copyAIP10', () => copyBuild2PubPath(paths.pubAIP10));
gulp.task('pub:copyAEC120', () => copyBuild2PubPath(paths.pubAEC120));
gulp.task('pub:copyASW3', () => copyBuild2PubPath(paths.pubASW3));
gulp.task('pub:copyASC175', () => copyBuild2PubPath(paths.pubASC175));

// 编译，替换，发布，压缩
function pubAP(name, callback) {
  let distPath = paths[`pub${name}`];
  if (argv.d) {
    distPath = argv.d;
  }
  gutil.log('正在处理产品：', gutil.colors.magenta(name));
  gutil.log('切换 AP 发布目标目录：', gutil.colors.magenta(distPath));
  if (callback) {
    runSequence('pub:path', `config:${name}`, [`clean:pub${name}`, 'build'], `change${name}Title`, `pub:copy${name}`, `compress${name}`, callback);
  } else {
    runSequence('pub:path', `config:${name}`, [`clean:pub${name}`, 'build'], `change${name}Title`, `pub:copy${name}`, `compress${name}`);
  }
}

gulp.task('pub:AIP5', () => pubAP('AIP5'));
gulp.task('pub:AIP10', () => pubAP('AIP10'));
gulp.task('pub:AEC120', () => pubAP('AEC120'));
gulp.task('pub:ASW3', () => pubAP('ASW3'));
gulp.task('pub:ASC175', () => pubAP('ASC175'));

// 压缩文件夹,提供给后台开发测试
function compressBulidFile(dstPath) {
  let distPath = dstPath;
  if (argv.d) {
    distPath = argv.d;
  }
  const arr = distPath.split('/');
  const name = arr[arr.length - 1];
  const dist = arr.slice(0, 1).join('/');
  return gulp.src(`${distPath}/**`)
        .pipe(zip(`${name}.zip`))
        .pipe(gulp.dest(dist));
}

gulp.task('compressAIP5', () => compressBulidFile(paths.pubAIP5));
gulp.task('compressAIP10', () => compressBulidFile(paths.pubAIP10));
gulp.task('compressAEC120', () => compressBulidFile(paths.pubAEC120));
gulp.task('compressASW3', () => compressBulidFile(paths.pubASW3));
gulp.task('compressASC175', () => compressBulidFile(paths.pubASC175));

// 执行所有列表中的AP编译工作
gulp.task('pub:all', () => {
  runSequence('pub:AIP10', 'pub:AIP5', 'pub:ASW3', 'pub:AEC120', 'pub:ASC175');
});
