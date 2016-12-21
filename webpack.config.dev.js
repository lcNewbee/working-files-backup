let webpack = require('webpack');
let path = require('path');
let autoprefixer = require('autoprefixer');
let GLOBALS = {
  DEFINE_OBJ: {
    'process.env.NODE_ENV': JSON.stringify('development'),
    __DEV__: true,
  },

  folders: {
    SRC: path.resolve(__dirname, 'src'),
    COMPONENT: path.resolve(__dirname, 'src/components'),
    BUILD: path.resolve(__dirname, 'build'),
    BOWER: path.resolve(__dirname, 'bower_components'),
    NPM: path.resolve(__dirname, 'node_modules'),
  },

  autoprefixer: {
    browsers: [
      'Android 2.3',
      'Android >= 2.3',
      'Chrome >= 20',
      'Firefox >= 24', // Firefox 24 is the latest ESR
      'iOS >= 6',
      'Opera >= 12',
      'Safari >= 6',
    ],
  },
};

// 自动添加兼容性css
let autoprefixerHandle = autoprefixer(GLOBALS.autoprefixer);

let config = {
  debug: true,

  // more info:https://webpack.github.io/docs/build-performance.html#sourcemaps and https://webpack.github.io/docs/configuration.html#devtool
  devtool: 'eval-source-map',

  // set to false to see a list of every file being bundled.
  noInfo: true,

  entry: {
    index: [
       // necessary for hot reloading with IE:
      'eventsource-polyfill',
      'react-hot-loader/patch',
      'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',

      './src/index.jsx',
    ],
  },

  // necessary per https://webpack.github.io/docs/testing.html#compile-and-test
  target: 'web',
  output: {
    path: GLOBALS.folders.BUILD,
    publicPath: '/',
    filename: 'scripts/bundle.js',
  },

  module: {
    loaders: [
      {
        test: /\.png$/,
        loader: 'url-loader',
        query: {
          mimetype: 'image/png',
        },
      },

      {
        test: /\.jpg$/,
        loader: 'url-loader',
      },

      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?mimetype=application/font-woff',
      },

      {
        test: /\.(ttf|eot|svg|cur)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
      },

      {
        test: /\.json$/,
        loader: 'json',
      },

      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },

      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!postcss-loader!sass',
      },

      {
        test: /\.(js|jsx)?$/,
        include: [
          path.resolve(__dirname, "src"),
          path.resolve(__dirname, "shared"),
          path.resolve(__dirname, "test"),
          path.resolve(__dirname, "tools"),
          path.resolve(__dirname, "node_modules/react-dates"),
        ],
        // exclude: /node_modules/,
        loader: 'babel',
      },
    ],
  },
  postcss() {
    return [autoprefixerHandle];
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    modulesDirectories: ['node_modules', 'shared'],
  },

  plugins: [
    new webpack.DefinePlugin(GLOBALS.DEFINE_OBJ),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
};

module.exports = config;

