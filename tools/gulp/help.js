const gulp = require('gulp');
const gutil = require('gulp-util');

gulp.task('help', () => {
  const tasks = Object.keys(gulp.tasks).sort();
  const myTasksObj = {};

  console.log(`${gutil.colors.cyan('usage:')}  gulp [任务名称] [-n 产品名称] [-d 发布dist路径] [-p 部署web路径]`);
  console.log('');
  console.log(gutil.colors.red('任务列表如下：'));
  console.log('');

  tasks.forEach(
    (name) => {
      const taskArr = name.split(':');
      const mainName = taskArr[0];

      if (!myTasksObj[mainName]) {
        myTasksObj[mainName] = [];
      } else {
        myTasksObj[mainName].push(name);
      }
    },
  );

  Object.keys(myTasksObj).forEach(
    (taskName) => {
      const subTasks = myTasksObj[taskName];

      if (subTasks.length > 0) {
        console.log('   ', gutil.colors.cyan(taskName));
        console.log('   ', subTasks.join(gutil.colors.cyan(', ')));
        console.log('');
      }
    },
  );
});
