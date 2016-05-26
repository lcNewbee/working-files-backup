var coreUtils = require('./core');
var helper = {};
var init;
var filter = function (filterStr) {
  return new filter.fn.init(filterStr)
};

filter.fn = filter.prototype = {
  constructor: filter,
  helper: helper,

  transform: function (str) {
    var len = this.rules.length;
    var ret = str;
    var args, rulesArr, i, ruleObj;

    if (str === undefined) {
      return;
    }

    for (i = 0; i < len; i++) {
      args = [ret];
      ruleObj = this.rules[i];

      // 转换
      if (typeof ruleObj.fun === 'function') {
        if (ruleObj.args) {
          args = args.concat(ruleObj.args)
        }
        ret = ruleObj.fun.apply(ruleObj, args);
      }
    }

    return ret;
  }
}

init = filter.fn.init = function (ruleStr) {
  if (!ruleStr) {
    return this;
  }

  this.rules = coreUtils.getRulesObj(ruleStr, helper);

  return this;
}
init.prototype = filter.fn;

helper.connectTime = function (time, unit) {
  var ret = '';
  var remainder = coreUtils.toNumber(time, 'connectTime');
  var days, hours, minutes, seconds;

  days = parseInt(remainder / 86400, 10);
  remainder = remainder % 86400;

  hours = parseInt(remainder / 3600, 10);
  remainder = remainder % 3600;

  minutes = parseInt(remainder / 60, 10);
  remainder = remainder % 60;

  seconds = remainder;

  // 大于一天
  if (time >= 86400) {
    ret = days + '天，' + hours + '小时';

    // 大于一小时
  } else if (time >= 3600) {
    ret = hours + '小时，' + minutes + '分钟';

    // 大于1 分钟
  } else if (time >= 60) {
    ret = minutes + '分钟，' + seconds + '秒';

  } else {
    ret = seconds + '秒';
  }

  return ret;
}

helper.add = function (str, val) {
  return str + val;
}

helper.translate = window._;

filter.helper = helper;

// exports
if (typeof module === "object" && typeof module.exports === "object") {
  module.exports = filter;
}