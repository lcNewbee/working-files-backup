var query = require('./query');
var str = require('./string');
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
  var ret = {};

  try {
    ret = response.json();
  } catch(err) {
    err.response = response

    throw err
  }

  return ret;
}

function handleServerError(json) {
  if (!json.state || (json.state && json.state.code !== 2000)) {
    console.error('State code not 2000', json.state);
  }
  return json;
}

function transformUrl(url) {
  var ret = 'goform/';
  var pathArr = (url || 'goform/login').split('goform/')[1];

  pathArr = pathArr.split('/');

  pathArr.map(function(item, i) {
    if(i === 0) {
      ret += item;
    } else {
      ret += str.toCamel(item);
    }
  })

  return ret;
}

var sync = {

  // 默认使用 JSON 格式数据传递
  save: function (url, data, errorCallback) {

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
        if (typeof errorCallback === 'function') {
          errorCallback(error)
        }
        console.error('request failed', error)
      });
  },

  postForm: function (url, form) {
    return fetch(url, {
      method: 'POST',
      body: new FormData(form)
    })
  },

  //
  fetch: function (url, data, errorCallback) {
    var queryStr = '';

    url = transformUrl(url);

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
        if (typeof errorCallback === 'function') {
          errorCallback(error)
        }
        console.error('request failed', error)
      });
  },

  loadScript: function (url, callback, timeout, isAsync){
    var script = document.createElement("script");
    var myCallback = callback;
    var thisTimeout = null;
    var myTimeout = timeout || 6000;
    var scriptElems = document.getElementsByTagName('script');
    var len = scriptElems.length;
    var i;

    // 判断是否已加载了相同的 域名和端口的文件
    for (i = 0; i < len; i++) {
      if (url.split('?')[0] === scriptElems[i].src.split('?')[0]) {
        return null;
      }
    }

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
          clearTimeout(thisTimeout);
        }
      };

    // Others: Firefox, Safari, Chrome, and Opera
    } else {
      script.onload = function () {
        myCallback();
        clearTimeout(thisTimeout);
      };
    }


    thisTimeout = setTimeout(function() {
      myCallback('load error');
    }, myTimeout)

    script.src = url;
    document.body.appendChild(script);
  },
}

sync.save = sync.fetch;

// exports
if (typeof module === "object" &&
  typeof module.exports === "object") {
  module.exports = sync;
}
