import gulp from 'gulp';
import shell from 'gulp-shell';

gulp.task('test', shell.task([
  'yarn run test',
]));

gulp.task('test:watch', shell.task([
  'yarn run test:watch',
]));
