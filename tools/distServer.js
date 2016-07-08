// This file configures a web server for testing the production build
// on your local machine.

import browserSync from 'browser-sync';
import historyApiFallback from 'connect-history-api-fallback';
import serverApiMiddleware from './middleware/api';

// Run Browsersync
browserSync({
  port: 3000,
  ui: {
    port: 3001
  },
  server: {
    baseDir: 'build'
  },

  files: [
    'build/*.html'
  ],

  middleware: [
    {
      route: "/goform",
      handle: serverApiMiddleware()
    },
    historyApiFallback()
  ]
});
