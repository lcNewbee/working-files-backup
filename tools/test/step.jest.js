var sinon = require('sinon');

// Register babel so that it will transpile ES6 to ES5
// before our tests run.
global.sinon = sinon;

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
process.env.NODE_ENV = 'test';

// Disable webpack-specific features for tests since
// Mocha doesn't know what to do with them.
require.extensions['.css'] = noop;
require.extensions['.scss'] = noop;
require.extensions['.png'] = noop;
require.extensions['.jpg'] = noop;
