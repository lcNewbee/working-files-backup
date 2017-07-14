var query = require('./query');
var core = require('./core');
var loadedScripts = [];

function checkStatus(response) {
  if (!response.ok) {
    core.warning('Response Status not ok: ', response.statusText);
  }
  return response;
}

function parseJSON(response) {
  var ret = {};

  try {
    ret = response.json();
  } catch(err) {
    core.warning('JSON parse error: ', err);
    ret = err;
  }

  return ret;
}
/**
 *
 *
 * @param {any} json
 * @returns
 */
function handleServerError(json) {
  /* eslint-disable no-console */
  if(!json) {
    console.warn('Not return json', json);
  } else if (!json.state) {
    console.warn('Not state object', json);
  } else if (json.state && json.state.code !== 2000) {
    console.warn('State code not 2000', json.state);
  }
  return json;
}

var sync = {

  // 默认使用 JSON 格式数据传递
  save: function (url, data, option) {
    var baseOption = {
      method: 'POST',
    };
    var subData;
    var subUrl = url;

    // 跨域请求不能设置 credentials 与 headers
    if (option && option.mode === 'cors') {
      baseOption.mode = 'cors';
      subData = query.queryToFormData(data);

    // 同域请求
    } else {
      if (data !== undefined) {
        subData = JSON.stringify(data);
      }
      baseOption.credentials = 'include';
      baseOption.headers = {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        'If-Modified-Since': '1',
        'Content-Type': 'application/json',
      }
    }

    baseOption.body = subData;

    return fetch(subUrl, baseOption)
      .then(checkStatus)
      .then(parseJSON)
      .then(handleServerError);
  },

  postForm: function (url, form, option) {
    var baseOption = {
      method: 'POST',
    };

    // 跨域请求不能设置 credentials 与 headers
    if (option && option.mode === 'cors') {
      baseOption.mode = 'cors';

    // 同域请求
    } else {
      baseOption.credentials = 'include';
    }

    baseOption.body = new FormData(form);

    return fetch(url, baseOption)
      .then(checkStatus)
      .then(parseJSON)
      .then(handleServerError);
  },

  //
  fetch: function (url, data, option) {
    var queryStr = '';
    var baseOption = {
      method: 'GET',
    };

    if (typeof data === 'object') {
      queryStr = query.queryToParamsStr(data);
    }

    if (queryStr) {
      url += '?' + queryStr;
    }

    // 跨域请求不能设置 credentials 与 headers
    if (option && option.mode === 'cors') {
      baseOption.mode = 'cors';

    // 同域请求
    } else {
      baseOption.credentials = 'include';
      baseOption.headers = {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        'If-Modified-Since': '1',
      }
    }

    return fetch(url, baseOption)
      .then(checkStatus)
      .then(parseJSON)
      .then(handleServerError);
  },

  loadScript: function (url, option){
    return new Promise(function(resolve) {
      var myOption = option || {};
      var script = document.createElement("script");
      var thisTimeout = null;
      var myTimeout = myOption.timeout || 6000;
      var scriptElems = document.getElementsByTagName('script');
      var len = scriptElems.length;
      var i;

      // 判断是否已加载了相同的 域名和端口的文件
      for (i = 0; i < len; i++) {
        if (url.split('?')[0] === scriptElems[i].src.split('?')[0]) {
          // resolve('has same');
          return null;
        }
      }

      // 防止重复加载同一URL
      if(loadedScripts.indexOf(url) !== -1) {
        // resolve('has same');
        return null;
      }

      script.type = "text/javascript";
      script.async = !!myOption.isAsync;

      // IE
      if (script.readyState) {
        script.onreadystatechange = function () {
          if (script.readyState == "loaded" || script.readyState == "complete") {
            script.onreadystatechange = null;
            resolve();
            loadedScripts.push(url);
            clearTimeout(thisTimeout);
          }
        };

      // Others: Firefox, Safari, Chrome, and Opera
      } else {
        script.onload = function () {
          resolve();
          loadedScripts.push(url);
          clearTimeout(thisTimeout);
        };
      }

      thisTimeout = setTimeout(function() {
        var urlIndex = loadedScripts.indexOf(url);

        resolve('load script ' + url + ' error!');
        document.body.removeChild(script);

        if (urlIndex !== -1) {
          loadedScripts.splice(urlIndex, 1);
        }
        script = null;
      }, myTimeout);

      if (typeof script.onerror === 'function') {
        script.onerror = function(error) {
          resolve(error);
        }
      }

      script.src = url;
      document.body.appendChild(script);
    });
  },
}

// exports
if (typeof module === "object" &&
  typeof module.exports === "object") {
  module.exports = sync;
}
