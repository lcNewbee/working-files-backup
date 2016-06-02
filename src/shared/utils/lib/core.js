'use strict';
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;
var utils = {};

function toObject(val) {
  if (val === null || val === undefined) {
    throw new TypeError('utils.extend cannot be called with null or undefined');
  }

  return Object(val);
}

/**
 * objectAssign
 * @param  {[type]} target [description]
 * @param  {[type]} source [description]
 * @return {[type]}        [description]
 */
utils.objectAssign = Object.assign || function (target, source) {
  var fromObj;
  var ret = toObject(target);
  var len = arguments.length;

  for (var i = 1; i < len; i++) {
    fromObj = toObject(arguments[i]);

    for (var key in fromObj) {
      if (hasOwnProperty.call(fromObj, key)) {
        ret[key] = fromObj[key];
      }
    }
  }

  return ret;
};

utils.extend = function (target, source) {
  var len = arguments.length;
  var ret;

  if (len === 1) {
    utils.objectAssign(this, target)
    return this;
  }

  ret = utils.objectAssign.apply(Object, [].slice.call(arguments))

  return ret;
};

function property(key) {
  return function (obj) {
    return obj == null ? void 0 : obj[key];
  };
};

// Helper for collection methods to determine whether a collection
// should be iterated as an array or as an object.
// Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
// Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
var getLength = property('length');
var isArrayLike = function (collection) {
  var length = getLength(collection);
  return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
};


utils.findIndex = function (array, predicate) {
  var length = getLength(array);
  var dir = 1;
  var index = dir > 0 ? 0 : length - 1;

  for (; index >= 0 && index < length; index += dir) {
    if (predicate.call(array[index], array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

utils.findKey = function (obj, predicate) {
  var key;

  for (key in obj) {
    if (predicate.call(obj[key], key, obj)) {
      return key;
    }
  }

  return key;
}

utils.find = function (obj, predicate) {
  var key;

  // 类数组
  if (isArrayLike(obj)) {
    key = utils.findIndex(obj, predicate);

    // 对象
  } else {
    key = utils.findKey(obj, predicate);
  }

  if (key !== void 0 && key !== -1) return obj[key];
};

utils.extend({
  getRuleObj: function getRuleObj(rule, rulesContainer) {
    var ret = {};
    var ruleSplit = rule.split(':');
    var fun = rulesContainer[ruleSplit[0]];
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
  },
  getRulesObj: function getRulesObj(rules, rulesContainer) {
    var ret = [];
    var rulesArr = rules.split('|');
    var ruleObj;
    
    if(typeof rules !== 'string') {
      throw new TypeError('utils.getRulesObj must be called with string');
    }

    for (var i = 0; i < rulesArr.length; i++) {
      ruleObj = this.getRuleObj(rulesArr[i], rulesContainer);

      if (ruleObj.fun) {
        ret.push(ruleObj);
      }
    }

    return ret;
  },
  
  toNumber: function(val, funcName) {
    var valType = typeof val;
    var ret = parseInt(val, 10);

    if (isNaN(ret)) {
      throw new TypeError(funcName + ' expected be called with number or number string,'+
          ' actual is' + valType);
    }

    return ret;
  },
  
  toString: function(val, funcName) {
    var valType = typeof val;
    
    if(valType !== 'string') {
      throw new TypeError(funcName + ' expected be called with string, actual is ' + valType);
    }
    
    return val;
  }
})

// exports
if (typeof module === "object" && typeof module.exports === "object") {
  module.exports = utils;
}
