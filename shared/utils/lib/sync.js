var query = require('./query');
var loadedScripts = [];

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
  return response.json();
}

function handleServerError(json) {
  if (!json.state || (json.state && json.state.code !== 2000)) {
    console.log('State code not 2000', json.state);
  }
  return json;
}

var sync = {

  // 默认使用 JSON 格式数据传递
  save: function (url, data) {
    var queryStr = '';

    if (data !== undefined) {
      data = JSON.stringify(data);
    }

    return fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        'If-Modified-Since': '1',
        'Content-Type': 'application/json'
      },
      body: data
    })
      .then(checkStatus)
      .then(parseJSON)
      .then(handleServerError)
      .catch(function (error) {
        console.log('request failed', error)
      });
  },

  postForm: function (url, form) {
    return fetch(url, {
      method: 'POST',
      body: new FormData(form)
    })
  },

  //
  fetch: function (url, data) {
    var queryStr = '';

    if (typeof data === 'object') {
      queryStr = query.queryToParamsStr(data);
    }

    if (queryStr) {
      url += '?' + queryStr;
    }
    return fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        'If-Modified-Since': '1'
      }
    })
      .then(checkStatus)
      .then(parseJSON)
      .then(handleServerError)
      .catch(function (error) {
        console.error('request failed', error)
      });
  },

  loadScript: function (url, callback, isAsync){
    var script = document.createElement("script");
    var myCallback = callback;

    // 防止重复加载同一URL
    if(loadedScripts.indexOf(url) !== -1) {
      return null;
    }

    loadedScripts.push(url);

    // 如果callback不是函数则赋值为空函数
    if (typeof callback !== 'function') {
      myCallback = function(){};
    }

    script.type = "text/javascript";
    script.async = !!isAsync;

    // IE
    if (script.readyState) {
      script.onreadystatechange = function () {
        if (script.readyState == "loaded" || script.readyState == "complete") {
          script.onreadystatechange = null;
          myCallback();
        }
      };

    // Others: Firefox, Safari, Chrome, and Opera
    } else {
      script.onload = function () {
        myCallback();
      };
    }

    script.src = url;
    document.body.appendChild(script);
  },
}

// exports
if (typeof module === "object" &&
  typeof module.exports === "object") {
  module.exports = sync;
}
