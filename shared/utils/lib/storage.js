'use strict';
var cookie = require('./cookie');

var storage = {

  get: window.localStorage ? function(key) {
    var ret = '';
    var val = localStorage.getItem(key);

    if(val) {
      try {
        ret = JSON.parse(val);
      } catch (err) {
        ret = val;
      } 
    }
    return ret || void 0;
  } : function(key) {
    //return 'This browser not supports localStorage';
    
    return cookie.get(key);
  },

  set: window.localStorage ? function(key, val) {
    var setVal = val;

    localStorage.removeItem(key);
    
    if(val === void 0 || val === null || val === '') {
      return void 0;
    }
    
    if(typeof val === 'object') {
      setVal = JSON.stringify(setVal);
    }

    return localStorage.setItem(key, setVal) || void 0;

  } : function(key, val) {
    //return 'This browser not supports localStorage';
    return cookie.set(key, val);
  }
}

module.exports = storage;
