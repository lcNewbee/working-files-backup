'use strict';
var utilsCore = require('shared/utils/lib/core');
var string = require('shared/utils/lib/string');
var validate = require('./validates/single');
var combineValidate = require('./validates/combine');

var validator = function(options) {
  return new validator.fn.init(options);
};
var _ = window._;

if(!_) {
  _ = string.format;
}

var msg = {
  thisField: __('This field')
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
  if(typeof str !== 'string' && typeof str !== 'number') {
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

  if(typeof str !== 'string' && typeof str !== 'number') {
    throw new TypeError('validate function should be called with string or number, but type ' + (typeof str));
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

/**
 * 处理排除规则
 */
function isExclueString(obj, str) {
  var ret = false;
  var exclude = obj.exclude;
  var i, len, curExclude, curType;

  if (typeof exclude === 'string' && exclude === str) {
    ret = true;
  } else if (utilsCore.isArray(exclude)) {
    for(i = 0, len = exclude.length; i < len; i += 1) {
      curExclude = exclude[i];
      curType = typeof curExclude;

      // 单纯过滤字符串
      if (curType === 'string' && curExclude === str) {
        ret = true;

      // 如果是过滤函数
      } else if(curType === 'function') {
        ret = curExclude(str);
      }

      if (ret) {
        return ret;
      }
    }
  }

  return ret;
}

/**
 * 初始化
 */
function init(options) {
  if(!options) {
    return this;
  }

  if(options.rules) {
    this.rules = utilsCore.getRulesObj(options.rules, validate);
  } else {
    this.rules = [];
  }

  if(options.exclude) {
    this.exclude = options.exclude;
  }

  this.label = options.label;

  return this;
}

validator.fn = validator.prototype = {
  constructor: validator,
  validate: validate,

  checkClear: function(str) {
    var ret;
    var label = msg.thisField;

    if(!isExclueString(this, str)) {
      ret = checkClear(str, this.rules);

      if(this.label) {
        label = this.label || '';
      }

      if(ret) {
        ret = string.format(ret, label);
      }
    }

    return ret;
  },

  check: function(str) {
    var ret;
    var label = msg.thisField;

    if(!isExclueString(this, str)) {
      ret = check(str, this.rules);

      if(this.label) {
        label = this.label || '';
      }

      if(ret) {
        ret = string.format(ret, label);
      }
    }

    return ret;
  },

  addVaildate: function(ruleName, funs) {
    if(ruleName && typeof validate === 'function') {
      validate[ruleName] = funs;
    }
  }
}
validator.fn.init = init;
init.prototype = validator.fn;

// 扩展 自己的工具函数
utilsCore.extend(validator, {
  combine: combineValidate,
  validate: validate,
  checkClear: function(str, rules) {
    if(!rules) {
      return ;
    }
    rules = utilsCore.getRulesObj(rules)

    return checkClear(str, rules);
  },
  check: function(str, rules) {
    if(!rules) {
      return ;
    }
    rules = utilsCore.getRulesObj(rules);

    return check(str, rules);
  },

  mergeProps: function(validOptions) {

    return function(stateProps, dispatchProps, ownProps) {

      return utilsCore.extend({}, ownProps, stateProps, dispatchProps, {
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
});

// exports
if (typeof module === "object" &&
  typeof module.exports === "object") {
  module.exports = validator;
}
