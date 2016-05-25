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

gulp.task('webpack', ['clean'],  shell.task([
  'webpack --config webpack.config.prod.js',
  'babel-node tools/buildHtml.js'
]))

gulp.task('build:html', ['webpack'], function() {
 return gulp.src(paths.build + '/index.html')
    .pipe(staticHash({asset: 'static'}))
    .pipe(gulp.dest(paths.build));
});

gulp.task('pub:ac',['build:html'],  shell.task([
  'babel-node ./tools/release.js'
]));

