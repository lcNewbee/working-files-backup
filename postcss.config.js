/* eslint-disable global-require */
module.exports = () => ({
  plugins: [
    require('autoprefixer')({
      browsers: [
        'Android 2.3',
        'Android >= 2.3',
        'Chrome >= 20',
        'Firefox >= 24', // Firefox 24 is the latest ESR
        'iOS >= 6',
        'Opera >= 12',
        'Safari >= 6',
        'ie >= 9',
      ],
    }),
    require('cssnano')({
      safe: true,
    }),
  ],
});
