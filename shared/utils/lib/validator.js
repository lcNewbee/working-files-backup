'use strict';
var utils = require('./core');
var string = require('./string');
var validator = function(options) {
  return new validator.fn.init(options);
};
var _ = window._;

if(!_) {
  _ = string.format;
}

var msg = {
  thisField: _('This field')
}

// 验证函数
var vaildate = {
  len: function(str, min, max) {
    var len = str.length;

    if (len < min || len > max) {
      return _('String length range is: %s - %s bit', min, max);
    }
  },

  num: function(str, min, max, expand) {

    if (!string.isInteger(str)) {
      return _("Must be integer");
    }

    if(expand !== undefined) {
      if(parseInt(str, 10) === parseInt(expand, 10)) {
        return ;
      }
    }

    if (min !== undefined && max !== undefined) {
      if (parseInt(str, 10) < min || parseInt(str, 10) > max) {
        return _("Range: %s - %s", min, max);
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
        return _("Please input a valid MAC address");
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
        return _("Please input a valid IP address");
      }
    },

    specific: function(str) {
      var ipArr = str.split('.'),
        ipHead = ipArr[0];

      if (ipArr[0] === '127') {
        return _("IP address begin with 127 is a reserved loopback address, please input another value between 1 to 233");
      }
      if (ipArr[0] > 223) {
        return _("Address begin with %s is invalid, please input a value between 1 to 223.", ipHead);
      }
    }
  },

  dns: {
    all: function(str) {
      var ret = this.specific(str);

      if (ret) {
        return ret;
      }

      if (!(/^([1-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){2}([1-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/).test(str)) {
        return _("Please input a valid IP address");
      }
    },

    specific: function(str) {
      var ipArr = str.split('.'),
        ipHead = ipArr[0];

      if (ipArr[0] === '127') {
        return _("IP address begin with 127 is a reserved loopback address, please input another value between 1 to 233");
      }
      if (ipArr[0] > 223) {
        return _("Address begin with %s is invalid, please input a value between 1 to 223.", ipHead);
      }
    }
  },

  mask: function(str) {
    var rel = /^(254|252|248|240|224|192|128)\.0\.0\.0$|^(255\.(254|252|248|240|224|192|128|0)\.0\.0)$|^(255\.255\.(254|252|248|240|224|192|128|0)\.0)$|^(255\.255\.255\.(254|252|248|240|224|192|128|0))$/;

    if (!rel.test(str)) {
      return _("Please input a valid subnet mask");
    }
  },

  email: function(str) {
    var rel = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!rel.test(str)) {
      return _("Please input a valid E-mail address");
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

    if (!string.isAscii(str)) {
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
      return _("Please input a valid username.");
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
        return _("Can't input: %s", curChar);
      }
    }
  },

  required: function(str) {
    if (str === undefined || str === '') {
      return _('%s is required');
    }
  }
};

/**
 * 只验证明确的错误，验证有 specific 函数
 * @param  {[type]} str   [description]
 * @param  {[type]} rules [description]
 * @return {[type]}       [description]
 */
function checkClear(str, rules) {
  var len = rules.length;
  var ret, args, i, ruleObj;

  if(str === undefined) {
    return ;
  }

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
  var ret, args, i, ruleObj;

  if(str === undefined) {
    return ;
  }

  if(typeof str !== 'string') {
    throw new TypeError('validate function should be called with string, but ' + str);
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
    var ret = checkClear(str, this.rules);
    var label = msg.thisField;

    if(this.label) {
      label = this.label;
    }

    if(ret) {
      ret = string.format(ret, label);
    }

    return ret;
  },

  check: function(str) {
    var ret = check(str, this.rules);
    var label = msg.thisField;

    if(this.label) {
      label = this.label;
    }
    if(ret) {
      ret = string.format(ret, label);
    }

    return ret;
  },

  addVaildate: function(ruleName, funs) {
    if(ruleName && typeof vaildate === 'function') {
      vaildate[ruleName] = funs;
    }
  }
}

var init = validator.fn.init = function(options) {
  if(!options) {
    return this;
  }

  if(options.rules) {
    this.rules = utils.getRulesObj(options.rules, vaildate);
  } else {
    this.rules = [];
  }

  this.label = options.label;

  return this;
}

init.prototype = validator.fn;

// 关联验证
function isSameNet(ip_lan, ip_wan, mask_lan, mask_wan) {
  var ip1Arr = ip_lan.split("."),
    ip2Arr = ip_wan.split("."),
    maskArr1 = mask_lan.split("."),
    maskArr2 = mask_wan.split("."),
    i;

  for (i = 0; i < 4; i++) {
    if ((ip1Arr[i] & maskArr1[i]) != (ip2Arr[i] & maskArr2[i])) {
      return false;
    }
  }
  return true;
}

validator.combineValid = {
  //必须一样
  equal: function (str1, str2, msg) {
    if (str1 != str2) {
      return msg;
    }
  },

  //不能一样
  notequal: function (str1, str2) {
    if (str1 == str2) {
      return msg;
    }
  },

  //ip mask gateway 组合验证
  staticIP: function (ip, mask, gateway) {
    if (ip == gateway) {
      return _("Static IP cannot be the same as default gateway.");
    }

    if (!isSameNet(ip, gateway, mask, mask)) {
      return _("Static IP and default gateway must be in the same network segment");
    }
  },

  ipSegment: function (ipElem, maskElem) {
    var ip,
      mask,
      ipArry,
      maskArry,
      len,
      maskArry2 = [],
      netIndex = 0,
      netIndex1 = 0,
      i = 0,
      k;


    ip = ipElem;
    mask = maskElem;

    ipArry = ip.split(".");
    maskArry = mask.split(".");
    len = ipArry.length;

    for (i = 0; i < len; i++) {
      maskArry2[i] = 255 - Number(maskArry[i]);
    }

    for (k = 0; k < 4; k++) { // ip & mask
      if ((ipArry[k] & maskArry[k]) == 0) {
        netIndex1 += 0;
      } else {
        netIndex1 += 1;
      }
    }
    for (k = 0; k < 4; k++) { // ip & 255 - mask
      if ((ipArry[k] & maskArry2[k]) == 0) {
        netIndex += 0;
      } else {
        netIndex += 1;
      }
    }

    if (netIndex == 0 || netIndex1 == 0) {
      return;
    } else {
      return _("Please enter a valid IP segment");
    }
  }
};


validator.mergeProps = function(validOptions) {

  return function(stateProps, dispatchProps, ownProps) {

    return utils.extend({}, ownProps, stateProps, dispatchProps, {
      validateOption: (function() {
        var ret = {};

        // 验证单独框
        validOptions.forEach(function(validates, name) {
          ret[name] = {
            name: name,
            validator: validates,
            errMsg: stateProps.app.getIn(['invalid', name]),
            validateAt: stateProps.app.get('validateAt'),
            onValidError: dispatchProps.reportValidError
          }
        });

        return ret;
      })()
    });
  }
}

validator.checkClear = function(str, rules) {
  if(!rules) {
    return ;
  }
  rules = utils.getRulesObj(rules)

  return checkClear(str, rules);
}

validator.check = function(str, rules) {
  if(!rules) {
    return ;
  }
  rules = utils.getRulesObj(rules);

  return check(str, rules);
}

// exports
if (typeof module === "object" &&
  typeof module.exports === "object") {
  module.exports = validator;
}
