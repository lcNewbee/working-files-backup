const gulp = require('gulp');
const shell = require('gulp-shell');

gulp.task('test', shell.task([
  'yarn run test',
]));

gulp.task('test:watch', shell.task([
  'yarn run test:watch',
]));
