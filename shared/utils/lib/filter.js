var coreUtils = require('./core');
var stringUtils = require('./string');
var helper = {};
var init;

var filter = function (filterStr) {
  return new filter.fn.init(filterStr)
};

function translate(str) {
  var translateFunc = window.__ || stringUtils.format;

  return translateFunc(str);
}

function transformComplex(num, unit) {
  var ret = unit;

  if(num > 1) {
    ret = num + translate(ret + 's');
  } else {
    ret = num + translate(ret);
  }

  return ret;
}

helper = {
  translate: translate,

  toDecimal: function(x, len) {
    var f = parseFloat(x);
    var UNIT = Math.pow(10, len)

    if (isNaN(f)) {
      return;
    }
    f = Math.round(x * UNIT) / UNIT;

    return f;
  },

  checkbox: function(val) {
    var ret = translate('Enabled');

    if(!val || val == '0') {
      ret = translate('Disabled')
    }

    return ret;
  },

  connectTime: function (time) {
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
      ret = days + 'd ' + hours + 'h';

      // 大于一小时
    } else if (time >= 3600) {
      ret = hours + 'h ' + minutes + 'm';

      // 大于1 分钟
    } else if (time >= 60) {
      ret = minutes + 'm ' + seconds + 's';

    } else {
      ret = seconds + 's';
    }

    return ret;
  },

  flowRate: function (rate, unitType) {
    var ret = 0;
    var UNIT_TB = 1024 * 1024 * 1024 * 1024;
    var UNIT_GB = 1024 * 1024 * 1024;
    var UNIT_MB = 1024 * 1024;
    var UNIT_KB = 1024;
    var unitSize = coreUtils.toNumber(rate, 'helper.flowRate');
    var unit;

    if(unitType === "KB") {
      UNIT_TB = 1024 * 1024 * 1024;
      UNIT_GB = 1024 * 1024;
      UNIT_MB = 1024 ;
      UNIT_KB = 1;
    }

    if (unitSize > UNIT_TB) {
      ret = unitSize / (UNIT_TB);
      unit = 'TB';
    } else if (unitSize > UNIT_GB) {
      ret = unitSize / (UNIT_GB);
      unit = 'GB';
    } else if(unitSize > UNIT_MB) {
      ret = unitSize / (UNIT_MB);
      unit = 'MB';
    } else if(unitSize > UNIT_KB) {
      ret = unitSize / (UNIT_KB);
      unit = 'KB';
    } else {
      ret = unitSize;
      unit = 'B'
    }

    return helper.toDecimal(ret, 1) + unit;
  },

  add: function(str, num) {
    var ret = coreUtils.toNumber(str, 'helper.add');

    num = coreUtils.toNumber(num, 'helper.add');
    ret += num;
    return ret;
  }
};

filter.fn = filter.prototype = {
  constructor: filter,
  helper: helper,

  transform: function (str) {
    var len = this.rules.length;
    var ret = str;
    var args, i, ruleObj;

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
filter.helper = helper;

// exports
if (typeof module === "object" && typeof module.exports === "object") {
  module.exports = filter;
}
