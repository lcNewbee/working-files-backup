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
