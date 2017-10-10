'use strict';
var warning = require('./warning');
var hasOwnProperty = Object.prototype.hasOwnProperty;
var utils = {};
var warned = {};

function toObject(val, callerMsg) {
  var showCallerMsg = callerMsg || (this && this.caller) || '';

  if (val === null || val === undefined) {
    warning(false, showCallerMsg + ' should not be null or undefined');
  }

  return Object(val);
}

function isHighSurrogate(codePoint) {
  return codePoint >= 0xd800 && codePoint <= 0xdbff;
}

function isLowSurrogate(codePoint) {
  return codePoint >= 0xdc00 && codePoint <= 0xdfff;
}

/**
 * objectAssign
 * @param  {[type]} target [description]
 * @param  {[type]} source [description]
 * @return {[type]}        [description]
 */
utils.objectAssign = Object.assign || function (target) {
  var fromObj;
  var ret = toObject(target, 'utils.objectAssign param target');
  var len = arguments.length;

  for (var i = 1; i < len; i++) {
    if (typeof arguments[i] === 'object') {
      fromObj = arguments[i];

      for (var key in fromObj) {
        if (hasOwnProperty.call(fromObj, key)) {
          ret[key] = fromObj[key];
        }
      }
    }
  }

  return ret;
};

utils.extend = function (target) {
  var len = arguments.length;
  var ret;

  if (len === 1) {
    utils.objectAssign(this, target)
    return this;
  }

  ret = utils.objectAssign.apply(Object, [].slice.call(arguments))

  return ret;
};
utils.isArray = Array.isArray ? Array.isArray :
  function isArray(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';
  }

utils.isPromise = function(obj) {
  return obj && obj.then && 'function' === typeof obj.then;
}
utils.isFunc = function(func) {
  return 'function' === typeof func;
}
utils.isString = function(str) {
  return 'string' === typeof str;
}

function property(key) {
  return function (obj) {
    return obj == null ? void 0 : obj[key];
  };
}

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

  /**
   *
   */
  getRulesObj: function getRulesObj(rules, rulesContainer) {
    var ret = [];
    var rulesArr;
    var ruleObj;

    if(typeof rules !== 'string') {
      throw new TypeError('utils.getRulesObj must be called with string');
    }

    rulesArr = rules.split('|');

    for (var i = 0; i < rulesArr.length; i++) {
      ruleObj = utils.getRuleObj(rulesArr[i], rulesContainer);

      if (ruleObj.fun) {
        ret.push(ruleObj);
      }
    }

    return ret;
  },

  getUtf8Length: function (str) {
    var charLength = 0;
    var byteLength = 0;
    var codePoint = null;
    var prevCodePoint = null;

		if (typeof str !== "string") {
      throw new Error("Input must be string");
    }

    charLength = str.length;

    for (var i = 0; i < charLength; i++) {
      codePoint = str.charCodeAt(i);
      // handle 4-byte non-BMP chars
      // low surrogate
      if (isLowSurrogate(codePoint)) {
        // when parsing previous hi-surrogate, 3 is added to byteLength
        if (prevCodePoint != null && isHighSurrogate(prevCodePoint)) {
          byteLength += 1;
        }
        else {
          byteLength += 3;
        }
      }
      else if (codePoint <= 0x7f ) {
        byteLength += 1;
      }
      else if (codePoint >= 0x80 && codePoint <= 0x7ff) {
        byteLength += 2;
      }
      else if (codePoint >= 0x800 && codePoint <= 0xffff) {
        byteLength += 3;
      }
      prevCodePoint = codePoint;
    }

    return byteLength;
	},

  toNumber: function(val, funcName) {
    var valType = typeof val;
    var ret = parseInt(val || '0', 10);

    warning(
      !isNaN(ret),
      '%s expected be called with number or number string, actual is %s and value = %s',
      funcName, valType, val
    );

    return ret;
  },

  toString: function(val, funcName) {
    var valType = typeof val;

    warning(
      typeof valType === 'string',
      '%s expected be called with string, actual is %s and value = %s',
      funcName, valType, val
    );

    return val;
  },
  binds: function(target, keys) {
    var len;
    var i;
    var key;
    var func;

    if (typeof target !== 'object' || !utils.isArray(keys)) {
      warning(false, 'utils.binds should call with object target and array keys');
      return ;
    }

    for (i = 0, len = keys.length; i < len; i++) {
      key = keys[i];
      func = target[key];

      if (typeof func === 'function') {
        target[key] = func.bind(target);
      }
    }
  },
  uuid: function () {
    var i, random;
    var uuid = '';

    for (i = 0; i < 32; i++) {
      random = Math.random() * 16 | 0;
      if (i === 8 || i === 12 || i === 16 || i === 20) {
        uuid += '-';
      }
      uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
    }

    return uuid;
  },

  getIn: function(target, path) {
    var ret;
    var len = 0;
    var i = 0;

    if (target && utils.isArray(path)) {
      ret = target;
      len = path.length;

      while (i < len && ret) {
        ret = ret[path[i]];
        i += 1;
      }
    }

    return ret;
  },
  debounce: function(func, wait, immediate) {
    var timeout, result;

    var later = function(context, args) {
      timeout = null;
      if (args) result = func.apply(context, args);
    };

    var debounced = function() {
      if (timeout) clearTimeout(timeout);
      if (immediate) {
        var callNow = !timeout;
        timeout = setTimeout(later, wait);

        if (callNow) result = func.apply(this, arguments);
      } else {
        timeout = setTimeout(function() {
          later(null, arguments);
        }, wait);
      }

      return result;
    };

    debounced.cancel = function() {
      clearTimeout(timeout);
      timeout = null;
    };

    return debounced;
  },

  noop: function(){},
  warning: warning,
  warningOnce: function (condition, format, args) {
    if (!warned[format]) {
      warning(condition, format, args);
      warned[format] = !condition;
    }
  }
});

// requestAnimationFrame shim
(function () {
  var lastTime = 0;
  var vendors = ['webkit', 'moz', 'ms'];

  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; x ++) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[ vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (callback) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(
        function() {
          callback(currTime + timeToCall);
        },
        timeToCall
      );
      lastTime = currTime + timeToCall;
      return id;
    };
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function (id) {
      clearTimeout(id);
    };
  }
}());

// exports
if (typeof module === "object" && typeof module.exports === "object") {
  module.exports = utils;
}
