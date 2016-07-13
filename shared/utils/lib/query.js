'use strict';
// 查询数据相关
var query;

/**
 * get query object on search string
 * @param  {[string]} search search string
 * @return {[object]}        query object value is decode
 */
function getQuery(search) {
  var ret = {};
  var keyVal, len, strs, key, val, i;

  if(typeof search !== 'string') {
    throw new TypeError('getQuery cannot be called with string');
  }

  if (search.indexOf('?') === 0) {
    search = search.substr(1)
  }

  if(search.indexOf('=') !== -1) {
    strs = search.split('&');
    len = strs.length;

    for(i = 0; i < len; i ++) {
      keyVal = strs[i].split('=');
      key = keyVal[0];
      val = window.decodeURIComponent(keyVal[1] || '');

      // handle val is number
      // TODO: handle val is JOSN string
      if(/^[\d.]+$/.test(val)) {
        val =  parseInt(val, 10);
      }
      ret[key] = val;
    }
  }
  
  return ret;
}

function getUrlQuery() {
  var ret = {};

  ret = getQuery(window.location.search);

  return ret;  
}

/**
 * Query object to http request params string
 * @param  {object} query The query object
 * @return {string}       The http request params string
 */
function queryToParamsStr(query) {
  var ret = [];

  if(typeof query !== 'object') {
    return '';
  }

  for ( var key in query ) {
    if(query.hasOwnProperty(key)) {
      ret.push(key + '=' + encodeURIComponent(query[key]));
    }
  }

  return ret.join('&');
}

/**
 * [queryToJSON description]
 * @param  {[object]} query [description]
 * @return {[JOSN]}       [description]
 */
function queryToJSON(query) {
  var ret = '';
  var encodeObj = {};

  if(typeof query !== 'object') {
    return ret;
  }

  for ( var key in query ) {
    if(query.hasOwnProperty(key)) {

      // not number
      if(/^[\d.]+$/.test(query[key])) {
        encodeObj[key] = query[key];
      } else {
        encodeObj[key] = encodeURIComponent(query[key]);
      }
      
    }
  }

  if(JSON.stringify) {
    ret = JSON.stringify(encodeObj);
  }

  return ret;
}

query = {
  getQuery: getQuery,
  queryToParamsStr: queryToParamsStr,
  queryToJSON: queryToJSON,
  getUrlQuery: getUrlQuery
};

if (typeof module === "object" && typeof module.exports === "object" ) {
  module.exports = query;
}
