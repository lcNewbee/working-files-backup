var coreUtils = require('./core');
var str = {};

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

function trim(str){
  var retStr = str.replace(/^(\s|\u00A0)+/,'');

  for(var i = retStr.length - 1; i >= 0; i--){
    if(/\S/.test(retStr.charAt(i))){
      retStr = retStr.substring(0, i + 1);
      break;
    }
  }
  return retStr;
}

/**
 * To determine whether an integer
 *
 * @param {string} str
 * @returns
 */
function isInteger(str) {
  if (/^(-?)[0-9]{1,}$/.test(str)) {
    return true;
  }

  return false;
}

/**
 * To determine whether an Number
 *
 * @param {string} str
 * @returns
 */
function isNumber(str) {
  if (/^(-?)[0-9]+(.[0-9]{1,})?$/.test(str)) {
    return true;
  }

  return false;
}

function addClassName(oldClassNames, addClassNameStr) {
  var ret = oldClassNames || '';

  ret = trim(ret).split(' ');
  ret.push(addClassNameStr);

  return trim(ret.join(' '));
}

function removeClassName(oldClassNames, removeClassNameStr) {
  var newClassName = oldClassNames || '';
  var removeStr = trim(removeClassNameStr);

  if (removeStr) {
    newClassName = newClassName.split(removeStr);
  } else {
    newClassName = [newClassName];
  }

  return trim(newClassName.join(' '));
}

function changeMaskNumberToIp(num) {
  var ret = [];
  var len = 0;
  var prifex = 0;
  var prifexVal;
  var i, j;

  if (typeof num !== 'string' && typeof num !== 'number') {
    return;
  }

  len = parseInt(num / 8, 10)
  prifex = num % 8;

  if (prifex) {
    prifexVal = '';
    for (j = 0; j < 8; j += 1) {
      if (j < prifex) {
        prifexVal += '1';
      } else {
        prifexVal += '0';
      }
    }
    prifexVal = parseInt(prifexVal, 2);
  }

  for (i = 0; i < 4; i += 1) {
    if (i < len) {
      ret.push('255');
    } else if (i === len && prifexVal) {
      ret.push(prifexVal);
    } else {
      ret.push('0');
    }
  }

  return ret.join('.');
}
function getMaskFormIpSegment(ipSegment) {
  var ret = '0.0.0.0';

  if (typeof ipSegment === 'string') {
    ret = changeMaskNumberToIp(ipSegment.split('/')[1]);
  }

  return ret;
}

str = {
  trim: String.prototype.trim || trim,
  isAscii: isAscii,
  isInteger: isInteger,
  isNumber: isNumber,
  addClassName: addClassName,
  removeClassName: removeClassName,
  changeMaskNumberToIp: changeMaskNumberToIp,
  getMaskFormIpSegment: getMaskFormIpSegment,

  prefixInteger: function(num, length) {
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
  },

  toDecimal: function(x, len) {
    var f = parseFloat(x);
    var UNIT = Math.pow(10, len)

    if (isNaN(f)) {
      return;
    }
    f = Math.round(x * UNIT) / UNIT;

    return f;
  },

  toCamel: function(str) {
    var re = /^(\w)/;

    // 如果为空，null
    if (typeof str !== 'string' || str === '') {
      return '';
    }

    return str.replace(re, function($0) {
      return $0.toUpperCase();
    });
  },

  format: [].reduce ? function() {
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
  } : __format,

  getExtension: function(path) {
    var startIndex = path.lastIndexOf(".");
    var ret = '';

    if(startIndex !== -1) {
      ret = path.substring(startIndex + 1).toLowerCase();
    }

    return ret;
  }
};

// exports
if (typeof module === "object" && typeof module.exports === "object" ) {
  module.exports = str;
}
