import gulp from 'gulp';
import shell from 'gulp-shell';

gulp.task('test', shell.task([
  'npm run test',
]));

gulp.task('test:watch', shell.task([
  'npm run test:watch',
]));
