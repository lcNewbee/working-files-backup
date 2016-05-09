import config from '../webpack.config.prod';
import colors from 'colors';
import copy from 'copy';

console.log('Start releas copy to win_ac web dir...'.blue);

copy('build/**/*.*', '../win_ac/ws031202/comlanweb/', function(err, file) {
  console.log(('End releas copy').blue);
})