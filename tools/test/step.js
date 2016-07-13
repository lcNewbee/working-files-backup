var babelRegister = require('babel-core/register');
var jsdom = require('jsdom');
var chai = require('chai');
var chaiImmutable = require('chai-immutable');
var path = require('path');
var doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
var win = doc.defaultView;

// Register babel so that it will transpile ES6 to ES5
// before our tests run.
babelRegister();

global.document = doc;
global.window = win;

Object.keys(window).forEach(function(key) {
  if (!(key in global)) {
    global[key] = window[key];
  }
});

function noop() {
  return null;
}

// Tests are placed alongside files under test.
 // This file does the following:
// 1. Sets the environment to 'production' so that
//    dev-specific babel config in .babelrc doesn't run.
// 2. Disables Webpack-specific features that Mocha doesn't understand.
// 3. Registers babel for transpiling our code for testing.

// This assures the .babelrc dev config (which includes
// hot module reloading code) doesn't apply for tests.
process.env.NODE_ENV = 'production';

// Disable webpack-specific features for tests since
// Mocha doesn't know what to do with them.
require.extensions['.css'] = noop;
require.extensions['.scss'] = noop;
require.extensions['.png'] = noop;
require.extensions['.jpg'] = noop;

chai.use(chaiImmutable);
