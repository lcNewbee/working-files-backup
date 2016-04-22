'use strict';
var version = '0.0.1';
var utils = require('./lib/core');

// extend utils self key
utils.version = version;
utils.extend(require('./lib/string'));
utils.extend(require('./lib/query'));

// extend utils self module
utils.extend({
  moment: require('./lib/moment'),
  storage: require('./lib/storage')
});

// exports
if (typeof module === "object" && typeof module.exports === "object" ) {
  module.exports = utils;
}
