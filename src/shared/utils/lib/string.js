var coreUtils = require('./core');
var str;

function getText(val) {
  var ret = '';

  if(val !== void 0 && val !== null) {
    if (typeof val === 'object') {
      if(JSON.stringify) {
        ret = JSON.stringify(val);
      }
    } else {
      ret = val;
    }
    
  }

  return ret;
}

function __format() {
  var args = [].slice.call(arguments);
  var ret = args.shift();
  var count = 0;
  var index;

  if(typeof ret !== 'string' || ret === '') {
    return '';
  }

  while ((index = ret.indexOf('%s')) !== -1) {
    ret = ret.slice(0, index) + getText(args[count]) +
      ret.slice(index + 2);
    count = ((count + 1) === args.length) ? count : (count + 1);
  }

  return ret;
}

function isAscii(str) {

  if(typeof str !== 'number' && typeof str !== 'string') {
    return false;
  }

  if (/^[ -~]+$/g.test(str)) {
    return true;
  }

  return false;
}

function isInteger(str) {
  if (/^[0-9]{1,}$/.test(str)) {
    return true;
  }

  return false;
}

function isNumber(str) {
  if (/^[0-9]+(.[0-9]{1,})?$/.test(str)) {
    return true;
  }

  return false;
}

str = {
  isAscii: isAscii,
  isInteger: isInteger,
  isNumber: isNumber
};

str.prefixInteger = function(num, length) {
  var ret = '';
  var defaultLen;

  if(typeof num === 'string') {
    defaultLen = num.length;
  } else if(typeof num === 'number') {
    defaultLen = ('' + num).length;

  } else {
    return ret
  }

  if(!length || length < defaultLen) {
    length = defaultLen;
  }

  return (Array(length).join('0') + num).slice(-length);
}

str.toDecimal = function(x, len) { 
  var f = parseFloat(x);
  var UNIT = Math.pow(10, len)
  
  if (isNaN(f)) { 
    return;
  }
  f = Math.round(x * UNIT) / UNIT;
  
  return f; 
}

str.toCamel = function(str) {
  var re = /^(\w)/;

  // 如果为空，null
  if (typeof str !== 'string' || str === '') {
    return '';
  }

  return str.replace(re, function($0) {
    return $0.toUpperCase();
  });
};

str.format = [].reduce ? function() {
  var args = [].slice.call(arguments);
  var initial = args.shift();

  if(typeof initial !== 'string' || initial === '') {
    return '';
  }

  function replacer(text, replacement) {
    replacement = getText(replacement);
    return text.replace('%s', replacement);
  }
  return args.reduce(replacer, initial);
} : __format;

str.getExtension = function(path) {
  var pathName = coreUtils.toString(path, 'str.getExtension')
  var startIndex = path.lastIndexOf(".");
  var ret = '';
  
  if(startIndex !== -1) {
    ret = path.substring(startIndex + 1).toLowerCase();
  }
  
  return ret;
}

// exports
if (typeof module === "object" && typeof module.exports === "object" ) {
  module.exports = str;
}
