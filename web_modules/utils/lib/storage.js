'use strict';

var storage = {

  get: window.localStorage ? function(key) {
    var ret = '';

    if(localStorage.getItem(key)) {
      ret = JSON.parse(localStorage.getItem(key))
    }
    return ret || void 0;
  } : function(key) {
    return 'This browser not supports localStorage';
  },

  set: window.localStorage ? function(key, val) {
    var setVal = val;

    if(typeof val === 'object') {
      setVal = JSON.stringify(setVal);
    }

    localStorage.removeItem(key);

    return localStorage.setItem(key, setVal) || void 0;

  } : function(key, val) {
    return 'This browser not supports localStorage';
  },

}

module.exports = storage;
