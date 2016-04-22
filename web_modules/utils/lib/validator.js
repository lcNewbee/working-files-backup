'use strict';
var utils = require('./core');
var string = require('./string');
var _ = string.format;
var validator = function(options) {
  return new validator.fn.init(options);
};;

// 验证函数
var vaildate = {
  len: function(str, min, max) {
    var len = str.length;

    if (len < min || len > max) {
      return _('String length range is: %s - %s bit', min, max);
    }
  },

  num: function(str, min, max) {

    if (!isInteger(str)) {
      return _("Must be integer");
    }
    if (min && max) {
      if (parseInt(str, 10) < min || parseInt(str, 10) > max) {

        return _("Input integer range is: %s - %s", min, max);
      }
    }
  },

  mac: {
    all: function(str) {
      var ret = this.specific(str);

      if (ret) {
        return ret;
      }

      if (!(/^([0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}$/).test(str)) {
        return _("Please input a validity MAC address");
      }
    },

    specific: function(str) {
      var subMac1 = str.split(':')[0];
      if (subMac1.charAt(1) && parseInt(subMac1.charAt(1), 16) % 2 !== 0) {
        return _('The second character must be even number.');
      }
      if (str === "00:00:00:00:00:00") {

        return _('Mac can not be 00:00:00:00:00:00');
      }
    }
  },

  ip: {
    all: function(str) {
      var ret = this.specific(str);

      if (ret) {
        return ret;
      }

      if (!(/^([1-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){2}([1-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/).test(str)) {
        return _("Please input a validity IP address");
      }
    },

    specific: function(str) {
      var ipArr = str.split('.'),
        ipHead = ipArr[0];

      if (ipArr[0] === '127') {
        return _("IP address first input don't be 127, becuse it is loopback address.");
      }
      if (ipArr[0] > 223) {
        return _("First input %s greater than 223.", ipHead);
      }
    }
  },

  dns: function() {},

  mask: function(str) {
    var rel = /^(254|252|248|240|224|192|128)\.0\.0\.0$|^(255\.(254|252|248|240|224|192|128|0)\.0\.0)$|^(255\.255\.(254|252|248|240|224|192|128|0)\.0)$|^(255\.255\.255\.(254|252|248|240|224|192|128|0))$/;

    if (!rel.test(str)) {
      return _("Please input a validity subnet mask");
    }
  },

  email: function(str) {
    var rel = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!rel.test(str)) {
      return _("Please input a validity E-mail address");
    }

  },

  time: function(str) {
    if (!(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/).test(str)) {
      return _("Please input a valid time.");
    }
  },

  hex: function(str) {
    if (!(/^[0-9a-fA-F]{1,}$/).test(str)) {
      return _("Must be hex.");
    }
  },

  ascii: function(str, min, max) {

    if (!isAscii(str)) {
      return _("Must be ASCII.");
    }
    if (min || max) {
      return this.len(str, min, max);
    }
  },

  pwd: function(str, minLen, maxLen) {
    var ret;

    if (!(/^[0-9a-zA-Z_]+$/).test(str)) {
      return _('Must be numbers, letters or an underscore');
    }

    if (minLen && maxLen) {
      ret = this.len(str, minLen, maxLen);
      if (ret) {
        return ret;
      }
    }
  },

  username: function(str) {
    if (!(/^\w{1,}$/).test(str)) {
      return _("Please input a validity username.");
    }
  },

  ssidPasword: function(str, minLen, maxLen) {
    var ret;

    ret = this.ascii(str);
    if (!ret && minLen && maxLen) {
      ret = this.len(str, minLen, maxLen);
      if (ret) {
        return ret;
      }
    }

    return ret;
  },

  remarkTxt: function(str, banStr) {
    var len = banStr.length,
      curChar,
      i;

    for (i = 0; i < len; i++) {
      curChar = banStr.charAt(i);
      if (str.indexOf(curChar) !== -1) {
        return _("Can't input: '%s'", curChar);
      }
    }
  },

  required: function(str) {
    if (str === undefined || str === '') {
      return _('It required');
    }
  }
};

function getRuleObj(rule) {
  var ret = {};
  var ruleSplit = rule.split(':');
  var fun = vaildate[ruleSplit[0]];
  var args = ruleSplit[1];

  if(fun) {
    ret.fun = fun;
  }
  if(args) {
    
    if(args.indexOf('[') === 0 &&
        args.indexOf(']') === (args.length - 1)) {
      ret.args = eval(args);
    } else {
      ret.args = [args];
    }
  }

  return ret;
}

function getRulesObj(rules) {
  var ret = [];
  var rulesArr = rules.split('|');
  var ruleObj;

  for (var i = 0; i < rulesArr.length; i++) {
    ruleObj = getRuleObj(rulesArr[i]);

    if (ruleObj.fun) {
      ret.push(ruleObj);
    }
  }

  return ret;
}

/**
 * 只验证明确的错误，验证有 specific 函数
 * @param  {[type]} str   [description]
 * @param  {[type]} rules [description]
 * @return {[type]}       [description]
 */
function checkClear(str, rules) {
  var len = rules.length;
  var ret, args, rulesArr, i, ruleObj;

  if(typeof str !== 'string') {
    throw new TypeError('validate function should be called with string');
  }
  for (i = 0; i < len; i++) {
    args = [str];
    ruleObj = rules[i];

    // 如果没有明确的验证函数
    if(typeof ruleObj.fun.specific === 'function') {
      if(ruleObj.args) {
        args = args.concat(ruleObj.args)
      }
      ret = ruleObj.fun.specific.apply(ruleObj.fun, args);
    }
    
    if(ret) {
      return ret;
    }
  }
}

function check(str, rules) {
  var len = rules.length;
  var ret, args, rulesArr, i, ruleObj;

  if(typeof str !== 'string') {
    throw new TypeError('validate function should be called with string');
  }

  for (i = 0; i < len; i++) {
    args = [str];
    ruleObj = rules[i];

    if(ruleObj.args) {
      args = args.concat(ruleObj.args)
    }

    // 如果是对象
    if(typeof ruleObj.fun.all === 'function') {
      ret = ruleObj.fun.all.apply(ruleObj.fun, args);
    
    // 如果是函数
    } else {
      ret = ruleObj.fun.apply(ruleObj, args);
    }

    if(ret) {
      return ret;
    }
  }
}

validator.fn = validator.prototype = {
  constructor: validator,
  vaildate: vaildate,

  checkClear: function(str) {
    return checkClear(str, this.rules)
  },

  check: function(str) {
    return check(str, this.rules)
  },

  addVaildate: function(funs) {

  }
}

var init = validator.fn.init = function(options) {
  if(!options) {
    return this;
  }

  this.rules = getRulesObj(options.rules);

  return this;
}

init.prototype = validator.fn;

validator.ddd = 2;
export default validator;

