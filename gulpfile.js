var gulp = require('gulp');
var gutil = require('gulp-util');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var pkg = require('./package.json');
var staticHash = require('gulp-static-hash');
var bump = require('gulp-bump');
var del = require('del');
var shell = require('gulp-shell');
var rename = require('gulp-rename');
var paths;
var mochaShellprefix = 'mocha --require ./tools/test/step.js --reporter dot -c';
var argv = require('minimist')(process.argv.slice(2));

paths = gulp.paths = {
  tmp: '.tmp',
  build: 'build',
  release: 'release',
  src: 'src',
  php: 'php/',
  pubWebPath: '/',
  pubNew: '../win_ac/software/web/',
  pubAxc: 'dist',
  pubAp: '../qsdk/package/comlanos/goahead/files/web',
  webpack: './webpack.config.dev.js',
  pubWebpack: './webpack.config.production.js',
};

// 删除
gulp.task('clean', function (callback) {
  return del([paths.build, paths.release]);
});

gulp.task('open:src', shell.task([
  'babel-node ./tools/srcServer.js',
]));

gulp.task('test', shell.task([
  mochaShellprefix + ' \"./test/**/*spec.@(js|jsx)\" --watch --watch-extensions jsx',
]));

gulp.task('test:shared', shell.task([
  mochaShellprefix + ' \"./test/shared/**/*spec.@(js|jsx)\" --watch --watch-extensions jsx',
]));

gulp.task('webpack', shell.task([
  'webpack --config webpack.config.production.js',
  'babel-node tools/buildHtml.js',
]));

gulp.task('webpack:test', shell.task([
  'webpack --config webpack.config.test.js',
  'babel-node tools/buildHtml.js',
]));

gulp.task('build:assets', function () {
  return gulp.src(paths.src + '/assets/**/*')
    .pipe(gulp.dest(paths.build));
});

gulp.task('build:html', function () {
  return gulp.src(paths.build + '/index.html')
    .pipe(staticHash({ asset: 'static' }))
    .pipe(gulp.dest(paths.build));
});

gulp.task('build:header', function () {
  return gulp.src(paths.build + '/scripts/bundle.js')
    .pipe($.header('var a_165F8BA5ABE1A5DA = 0;var v_165F8BA5ABE1A5DA = "' + pkg.version + '";'))
    .pipe(gulp.dest(paths.build + '/scripts/'));
});
gulp.task('build', function (callback) {
  runSequence('clean', ['build:assets', 'webpack'], 'build:header', 'build:html', callback);
});


gulp.task('open:dist', ['build'], shell.task(['babel-node tools/distServer.js']));

gulp.task('clean:pubac', function (callback) {
  var distPath = paths.pubNew;

  if(argv.d) {
    distPath = argv.d;
  }
  return del([distPath], { force: true });
});

gulp.task('pub:path', function () {
  var distPath = paths.pubWebPath;
  var publicPathReg = /publicPath: '(.*)'/g;

  if(argv.p) {
    distPath = argv.p;
  }

  return gulp.src(paths.pubWebpack)
    .pipe($.replace(publicPathReg, "publicPath: '" + distPath + "'"))
    .on('end', function(){
      gutil.log('切换发布web根目录：', gutil.colors.magenta(distPath));
    })
    .pipe(gulp.dest('./'));
});

gulp.task('pub:copy', function () {
  var distPath = paths.pubNew;

  if(argv.d) {
    distPath = argv.d;
  }

  return gulp.src(paths.build + '/**/*')
    .pipe(gulp.dest(distPath));
});

// 发布 Access Manager 正式版
gulp.task('pub:ac', function (callback) {
  runSequence('pub:path', ['clean:pubac', 'build'], 'pub:copy', callback);
});

// 发布 Access Manager 测试版本
gulp.task('dev:ac', function (callback) {
  runSequence('bump:dev', ['clean:pubac', 'build'], 'pub:copy', callback);
});

// 发布 Access Pointer 版本
gulp.task('clean:pubap', function (callback) {
  return del([paths.pubAp], { force: true });
});
gulp.task('pub:copyap', function () {
  var distPath = paths.pubAp;

  if(argv.d) {
    distPath = argv.d;
  }

  return gulp.src(paths.build + '/**/*')
    .pipe(gulp.dest(distPath));
  });
gulp.task('pub:ap', function (callback) {
  runSequence('pub:path', ['clean:pubap', 'build'], 'pub:copyap', callback);
});

// 发布硬AC版本
// 发布 Access Pointer 版本
gulp.task('clean:pubaxc', function (callback) {
  var distPath = paths.pubAxc;

  if(argv.d) {
    distPath = argv.d;
  }

  return del([distPath], { force: true });
});
gulp.task('pub:copyaxc', function () {
  var distPath = paths.pubAxc;

  if(argv.d) {
    distPath = argv.d;
  }

  return gulp.src([paths.build + '/**/*', paths.php + '/**/*'])
    .pipe(gulp.dest(distPath));
});
gulp.task('build:axc', function () {
  return gulp.src([paths.build + '/scripts/**/*'])
    .pipe($.replace(/(\/?)goform/g, 'index.php/goform/'))
    .pipe($.replace('/~zhangfang/axc/', ''))
    .pipe(gulp.dest(paths.build + '/scripts/'));
});

gulp.task('pub:axc', function (callback) {
  runSequence('pub:path', ['build'], 'build:axc', 'pub:copyaxc', callback);
});


/**
 * 更新前端开发平台主版本号
 */
var packageFiles = ['./package.json'];

gulp.task('bump:major', function () {
  gulp.src(packageFiles)
    .pipe(bump({
      type: 'major',
    }))
    .pipe(gulp.dest('./'));
});

/**
 * 更新次版本号
 */
gulp.task('bump:minor', function () {
  gulp.src(packageFiles)
    .pipe(bump({
      type: 'minor',
    }))
    .pipe(gulp.dest('./'));
});

/**
 * 更新Patch布版本号
 */
gulp.task('bump', function () {
  gulp.src(packageFiles)
    .pipe(bump())
    .pipe(gulp.dest('./'));
});

/**
 * 更新预发布版本号
 */
gulp.task('bump:pre', function () {
  gulp.src(packageFiles)
    .pipe(bump({
      type: 'prerelease',
      preid: 'alpha',
    }))
    .pipe(gulp.dest('./'));
});

/**
 * 更新开发调试版本号
 */
gulp.task('bump:dev', function () {
  gulp.src(packageFiles)
    .pipe(bump({
      type: 'prerelease',
      preid: 'dev',
    }))
    .pipe(gulp.dest('./'));
});

var configReg = /\'\.\/config\/(\w+)\'/g;

gulp.task('config', function() {
  var name = 'ac';

  if(argv.n) {
    name = argv.n;
  }
  return gulp.src(paths.src + '/index.jsx')
    .pipe($.replace(configReg, "'./config/" + name + "'"))
    .on('end', function(){
      gutil.log('切换到配置文件：', gutil.colors.magenta(name));
    })
    .pipe(gulp.dest(paths.src));
})
gulp.task('config:ap', function() {
  gulp.src(paths.src + '/index.jsx')
    .pipe($.replace(configReg, "'./config/ap'"))
    .pipe(gulp.dest(paths.src));
})

gulp.task('default', ['open:src']);
