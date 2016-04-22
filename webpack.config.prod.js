var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');

var GLOBALS = {
  DEFINE_OBJ: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    __DEV__: true
  },

  folders: {
    SRC: path.resolve(__dirname, 'src'),
    COMPONENT: path.resolve(__dirname, 'src/components'),
    BUILD: path.resolve(__dirname, 'build'),
    BOWER: path.resolve(__dirname, 'bower_components'),
    NPM: path.resolve(__dirname, 'node_modules')
  },

  autoprefixer: {
    browsers: [
      'Android 2.3',
      'Android >= 2.3',
      'Chrome >= 20',
      'Firefox >= 24', // Firefox 24 is the latest ESR
      'iOS >= 6',
      'Opera >= 12',
      'Safari >= 6'
    ]
  }
};

// 自动添加兼容性css
var autoprefixerHandle = autoprefixer(GLOBALS.autoprefixer);

module.exports = {
  entry: [
    './src/index.jsx'
  ],
  module: {
    loaders: [
      {
        test: /\.png$/,
        loader: "url-loader",
        query: {
          mimetype: "image/png",
          limit: 11000
        }
      },

      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract("css-loader?minimize!postcss-loader!sass")
      },
      {
      test: /\.jsx|js?$/,
      exclude: /node_modules/,
      loader: 'es3ify!babel'
    }]
  },
  postcss: function() {
    return [autoprefixerHandle];
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: GLOBALS.folders.BUILD,
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: GLOBALS.folders.BUILD,
    hot: true
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new ExtractTextPlugin('styles/comlanos.css'),
    // new webpack.optimize.DedupePlugin(),
    // new webpack.optimize.UglifyJsPlugin(),
    new webpack.DefinePlugin(GLOBALS.DEFINE_OBJ)
  ]
};
