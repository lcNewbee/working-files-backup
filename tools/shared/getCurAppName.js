const fs = require('fs');
const path = require('path');

const configReg = /'\.\/config\/([\w.]+)'/g;

function getCurAppName(defaultName) {
  let str = '';
  let ret = defaultName || '';
  let execResult = null;

  str = fs.readFileSync(path.resolve(__dirname, '../../src/index.jsx'), 'utf-8');
  execResult = configReg.exec(str);

  if (execResult && execResult[1]) {
    ret = execResult[1];
  }

  return ret;
}

module.exports = getCurAppName;
