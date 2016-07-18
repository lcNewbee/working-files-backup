/*global -$ */
'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var pkg = require('./package.json');
var staticHash = require('gulp-static-hash')
var bump = require('gulp-bump');
var del = require('del');
var shell = require('gulp-shell')
var rename = require("gulp-rename");
var paths;
var mochaShellprefix = 'mocha --require ./tools/test/step.js --reporter dot -c';

paths = gulp.paths = {
  tmp: '.tmp',
  build: 'build',
  release: 'release',
  src: 'src',
  pub: '../win_ac/ws031202/comlanweb/',
  pubNew: '../win_ac/software/web/',
  webpack: 'webpack.config.dev.js',
  pubWebpack: 'webpack.config.prop.js'
};

// 删除
gulp.task('clean', function(callback) {
  return del([paths.build, paths.release]);
});

gulp.task('open:src', shell.task([
  'babel-node ./tools/srcServer.js'
]));

gulp.task('test', shell.task([
  mochaShellprefix + ' \"./src/**/*spec.@(js|jsx)\" --watch --watch-extensions jsx'
]));

gulp.task('test:shared', shell.task([
  mochaShellprefix + ' \"./shared/**/*spec.@(js|jsx)\" --watch --watch-extensions jsx'
]));

gulp.task('webpack', shell.task([
  'webpack --config webpack.config.prod.js',
  'babel-node tools/buildHtml.js'
]))

gulp.task('webpack:test', shell.task([
  'webpack --config webpack.config.test.js',
  'babel-node tools/buildHtml.js'
]))

gulp.task('build:assets', function() {
  return gulp.src(paths.src + '/assets/**/*')
    .pipe(gulp.dest(paths.build))
});

gulp.task('build:html', function() {
 return gulp.src(paths.build + '/index.html')
    .pipe(staticHash({asset: 'static'}))
    .pipe(gulp.dest(paths.build));
});

gulp.task('build:header', function() {
  return gulp.src(paths.build + '/scripts/bundle.js')
    .pipe($.header('var a_165F8BA5ABE1A5DA = 0;var v_165F8BA5ABE1A5DA = "' + pkg.version + '";'))
    .pipe(gulp.dest(paths.build + '/scripts/'));
})
gulp.task('build', function(callback) {
  runSequence('clean', ['build:assets', 'webpack'], 'build:header', 'build:html', callback);
});

gulp.task('open:dist', ['build'], shell.task(['npm run open:dist']));

gulp.task('clean:pubac', function(callback) {
  return del([paths.pubNew], {force: true});
});

gulp.task('pub:copy', function() {
  return gulp.src(paths.build + '/**/*')
    .pipe(gulp.dest(paths.pub))
    .pipe(gulp.dest(paths.pubNew));
})

// 发布 AC 正式版
gulp.task('pub:ac', function(callback) {
  runSequence(['clean:pubac', 'build' ], 'pub:copy', callback);
});

// 发布AC测试版本
gulp.task('dev:ac', function(callback) {
  runSequence('bump:dev', [ 'clean:pubac', 'build' ], 'pub:copy', callback);
});

/**
 * 更新主版本号
 */
var packageFiles = ['./package.json', '**/app.json'];

gulp.task('bump:major', function() {
  gulp.src(packageFiles)
    .pipe(bump({
      type: 'major',
    }))
    .pipe(gulp.dest('./'));
});

/**
 * 更新次版本号
 */
gulp.task('bump:minor', function() {
  gulp.src(packageFiles)
    .pipe(bump({
      type: 'minor',
    }))
    .pipe(gulp.dest('./'));
});

/**
 * 更新Patch布版本号
 */
gulp.task('bump', function() {
  gulp.src(packageFiles)
    .pipe(bump())
    .pipe(gulp.dest('./'));
});

/**
 * 更新预发布版本号
 */
gulp.task('bump:pre', function() {
  gulp.src(packageFiles)
    .pipe(bump({
      type: 'prerelease',
      preid: 'alpha'
    }))
    .pipe(gulp.dest('./'));
});

/**
 * 更新开发调试版本号
 */
gulp.task('bump:dev', function() {
  gulp.src(packageFiles)
    .pipe(bump({
      type: 'prerelease',
      preid: 'dev'
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('default', ['open:src']);
