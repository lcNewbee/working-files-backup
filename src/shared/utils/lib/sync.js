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
  return response.json();
}

function handleServerError(json) {
  if(!json.state || (json.state && json.state.code !== 2000)) {
    console.log('State code not 2000', json.state);
  }
  return json;
}

var sync = {

  // 默认使用 JSON 格式数据传递
  save: function(url, data) {
    var queryStr = '';
    
    if(data !== undefined) {
      data = JSON.stringify(data);
    }

    return fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: data
      })
      .then(checkStatus)
      .then(parseJSON)
      .then(handleServerError)
      .catch(function(error) {
        console.log('request failed', error)
      });
  },
  
  postForm: function(url, form) {
    return fetch(url, {
      method: 'POST',
      body: new FormData(form)
    })
  },

  // 
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
      .then(handleServerError)
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
