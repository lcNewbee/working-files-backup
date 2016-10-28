import gulp from 'gulp';
import bump from 'gulp-bump';

/**
 * 更新前端开发平台主版本号
 */
const packageFiles = ['./package.json'];

gulp.task('bump:major', () => {
  gulp.src(packageFiles)
    .pipe(bump({
      type: 'major',
    }))
    .pipe(gulp.dest('./'));
});

/**
 * 更新次版本号
 */
gulp.task('bump:minor', () => {
  gulp.src(packageFiles)
    .pipe(bump({
      type: 'minor',
    }))
    .pipe(gulp.dest('./'));
});

/**
 * 更新Patch布版本号
 */
gulp.task('bump', () => {
  gulp.src(packageFiles)
    .pipe(bump())
    .pipe(gulp.dest('./'));
});

/**
 * 更新预发布版本号
 */
gulp.task('bump:pre', () => {
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
gulp.task('bump:dev', () => {
  gulp.src(packageFiles)
    .pipe(bump({
      type: 'prerelease',
      preid: 'dev',
    }))
    .pipe(gulp.dest('./'));
});
