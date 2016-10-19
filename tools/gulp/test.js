import gulp from 'gulp';
import shell from 'gulp-shell';

const mochaShellprefix = 'mocha --require ./tools/test/step.js --reporter dot -c';

gulp.task('test', shell.task([
  `${mochaShellprefix} \"./test/**/*spec.@(js|jsx)\" --watch --watch-extensions jsx`,
]));

gulp.task('test:shared', shell.task([
  `${mochaShellprefix} \"./test/shared/**/*spec.@(js|jsx)\" --watch --watch-extensions jsx`,
]));
