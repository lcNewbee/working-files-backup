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
gulp.task('clean:pubAIP10L', () => cleanPubPath(paths.pubAIP10L));
gulp.task('clean:pubAEC120', () => cleanPubPath(paths.pubAEC120));
gulp.task('clean:pubASC175', () => cleanPubPath(paths.pubASC175));
gulp.task('clean:pubASW3', () => cleanPubPath(paths.pubASW3));
gulp.task('clean:pubASC120', () => cleanPubPath(paths.pubASC120));
gulp.task('clean:pubAEC60', () => cleanPubPath(paths.pubAEC60));
gulp.task('clean:pubASC3', () => cleanPubPath(paths.pubASC3));
gulp.task('clean:pubASC6', () => cleanPubPath(paths.pubASC6));
gulp.task('clean:pubASW120', () => cleanPubPath(paths.pubASW120));

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
gulp.task('pub:copyAIP10L', () => copyBuild2PubPath(paths.pubAIP10L));
gulp.task('pub:copyAEC120', () => copyBuild2PubPath(paths.pubAEC120));
gulp.task('pub:copyASW3', () => copyBuild2PubPath(paths.pubASW3));
gulp.task('pub:copyASC175', () => copyBuild2PubPath(paths.pubASC175));
gulp.task('pub:copyASC120', () => copyBuild2PubPath(paths.pubASC120));
gulp.task('pub:copyAEC60', () => copyBuild2PubPath(paths.pubAEC60));
gulp.task('pub:copyASC3', () => copyBuild2PubPath(paths.pubASC3));
gulp.task('pub:copyASC6', () => copyBuild2PubPath(paths.pubASC6));
gulp.task('pub:copyASW120', () => copyBuild2PubPath(paths.pubASW120));

// 编译，替换，发布，压缩
function pubAP(name, callback) {
  let distPath = paths[`pub${name}`];
  if (argv.d) {
    distPath = argv.d;
  }
  gutil.log('正在处理产品：', gutil.colors.magenta(name));
  gutil.log('切换 AP 发布目标目录：', gutil.colors.magenta(distPath));
  runSequence('pub:path', `config:${name}`, [`clean:pub${name}`, 'build'], `change${name}Title`, `pub:copy${name}`, `compress${name}`, callback);
}

gulp.task('pub:AIP5', callback => pubAP('AIP5', callback));
gulp.task('pub:AIP10', callback => pubAP('AIP10', callback));
gulp.task('pub:AIP10L', callback => pubAP('AIP10L', callback));
gulp.task('pub:AEC120', callback => pubAP('AEC120', callback));
gulp.task('pub:ASW3', callback => pubAP('ASW3', callback));
gulp.task('pub:ASC175', callback => pubAP('ASC175', callback));
gulp.task('pub:ASC120', callback => pubAP('ASC120', callback));
gulp.task('pub:AEC60', callback => pubAP('AEC60', callback));
gulp.task('pub:ASC3', callback => pubAP('ASC3', callback));
gulp.task('pub:ASC6', callback => pubAP('ASC6', callback));
gulp.task('pub:ASW120', callback => pubAP('ASW120', callback));

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
gulp.task('compressAIP10L', () => compressBulidFile(paths.pubAIP10L));
gulp.task('compressAEC120', () => compressBulidFile(paths.pubAEC120));
gulp.task('compressASW3', () => compressBulidFile(paths.pubASW3));
gulp.task('compressASC175', () => compressBulidFile(paths.pubASC175));
gulp.task('compressASC120', () => compressBulidFile(paths.pubASC120));
gulp.task('compressAEC60', () => compressBulidFile(paths.pubAEC60));
gulp.task('compressASC3', () => compressBulidFile(paths.pubASC3));
gulp.task('compressASC6', () => compressBulidFile(paths.pubASC6));
gulp.task('compressASW120', () => compressBulidFile(paths.pubASW120));

// 执行所有列表中的AP编译工作
gulp.task('pub:all', () => {
  runSequence('test', 'pub:AIP5', 'pub:AIP10', 'pub:ASW3', 'pub:AEC120', 'pub:ASC175', 'pub:ASC120', 'pub:AEC60', 'pub:ASC3', 'pub:ASC6', 'pub:ASW120', 'pub:AIP10L');
  // runSequence('test', 'pub:AIP5', 'pub:ASW3', 'pub:AEC120', 'pub:ASC175', 'pub:ASC120');
});
