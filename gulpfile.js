/*global -$ */
'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var pkg = require('./package.json');
var staticHash = require('gulp-static-hash')
var del = require('del');
var shell = require('gulp-shell')
var paths;

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

gulp.task('webpack', shell.task([
  'webpack --config webpack.config.prod.js',
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

gulp.task('build', function(callback) {
  runSequence('clean', ['build:assets', 'webpack'], 'build:html', callback);
});


gulp.task('clean:pubac', function(callback) {
  return del([paths.pubNew], {force: true});
});

gulp.task('pub:ac',['clean:pubac', 'build'], function() {
  return gulp.src(paths.build + '/**/*')
    .pipe(gulp.dest(paths.pub))
    .pipe(gulp.dest(paths.pubNew));
});

gulp.task('default', ['open:src']);

