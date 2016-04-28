var query = require('./query');

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

function parseJSON(response) {
  return response.json()
}

var sync = {

  // 默认或吧URL 中的search参数传回给后台
  // 默认使用 JSON 格式数据传递
  save: function(url, data) {
    var queryStr = '';

    if(typeof data === 'object') {
      queryStr = query.queryToParamsStr(data);
    }

    return fetch(url, {
        method: 'POST',
        body: queryStr
      })
      .then(checkStatus)
      .then(parseJSON)
      .catch(function(error) {
        console.log('request failed', error)
      });
  },

  // 默认或吧URL 中的search参数传回给后台
  fetch: function(url, data) {
    var queryStr = '';

    if(typeof data === 'object') {
      queryStr = query.queryToParamsStr(data);
    }

    if(queryStr) {
      url += '?' + queryStr;
    }
    return fetch(url)
      .then(checkStatus)
      .then(parseJSON)
      .catch(function(error) {
        console.error('request failed', error)
      });
  }
};

// exports
if (typeof module === "object" &&
    typeof module.exports === "object" ) {
  module.exports = sync;
}
