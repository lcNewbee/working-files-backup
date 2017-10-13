// This file configures a web server for testing the production build
// on your local machine.

const browserSync = require('browser-sync');
const historyApiFallback = require('connect-history-api-fallback');
const serverApiMiddleware = require('./middleware/api');

// Run Browsersync
browserSync({
  port: 3000,
  ui: {
    port: 3001,
  },
  server: {
    baseDir: 'build',
  },

  files: [
    'build/*.html',
  ],

  middleware: [
    {
      route: '/goform',
      handle: serverApiMiddleware(),
    },
    historyApiFallback(),
  ],
});
