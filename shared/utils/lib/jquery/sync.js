'use strict';

var warning = require('./warning');

var sync = {

  // 默认或吧URL 中的search参数传回给后台
  // 默认使用 JSON 格式数据传递
  save: function(url, data, options) {
    var _options = {
      url: url,
      type: 'POST',
      cache: false,
      dataType: 'json',
      data: $.extend({}, utils.getQueryObj(), data),
      contentType: 'application/json',
      error: function(xhttp, status, err) {
        warning(false, 'Ajax post Error = ' + err);
      }
    };
    _options.data.client = _options.data.client || {};
    _options.data.id = _options.data.id || 23333;
    _options.data = JSON.stringify(_options.data);

    $.extend(_options, options);

    return $.ajax(_options);
  },

  // 默认或吧URL 中的search参数传回给后台
  fetch: function(url, data, options) {
    var _options = {
      url: url,
      type: 'GET',
      cache: false,
      dataType: 'json',
      data: $.extend({}, utils.getQueryObj(), data),
      error: function(xhttp, status, err) {
        warning(false, 'Ajax fetch Error = ' + err);
      }
    };

    $.extend(_options, options);

    return $.ajax(_options);
  }
};

// exports
if (typeof module === "object" &&
    typeof module.exports === "object" ) {
  module.exports = sync;
}
