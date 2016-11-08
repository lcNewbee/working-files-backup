var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');

var GLOBALS = {
  DEFINE_OBJ: {
    'process.env.NODE_ENV': JSON.stringify('production'),
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
var autoprefixerHandle = autoprefixer(GLOBALS.autoprefixer);
var vendorList = [
  "es5-shim",
  "es5-shim/es5-sham",
  "es6-promise",
  "classnames",
  "whatwg-fetch",
  "console-polyfill",
  "immutable",
  "react",
  "react-addons-css-transition-group",
  "react-addons-pure-render-mixin",
  "react-addons-shallow-compare",
  "react-dom",
  "react-redux",
  "react-router",
  "react-select",
  "redux",
  "redux-thunk",
  "moment",
];

module.exports = {
  entry: {
    app: './src/index.jsx',
    vendors: vendorList,
  },
  devtool: 'cheap-source-map',
  cache: true,
  module: {
    loaders: [{
        test: /\.png$/,
        loader: 'url-loader',
        query: {
          mimetype: 'image/png',
          limit: 11000,
          name: 'images/[hash].[ext]',
        },
      },

      {
        test: /\.jpg$/,
        loader: 'url-loader',
      },

      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?name=font/[hash].[ext]&limit=10000&mimetype=application/font-woff',
      },

      {
        test: /\.(ttf|eot|svg|cur)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader?name=font/[hash].[ext]',
      },

      {
        test: /\.json$/,
        loader: 'json',
      },

      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader'),
      },

      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('css-loader?minimize!postcss-loader!sass'),
      }, {
        test: /\.(jsx|js)?$/,
        exclude: /node_modules/,
        loader: 'babel?cacheDirectory=true',
      }
    ],
  },
  postcss() {
    return [autoprefixerHandle];
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    modulesDirectories: ['node_modules', 'shared'],
  },
  output: {
    path: GLOBALS.folders.BUILD,
    publicPath: '/',
    filename: 'scripts/[name].bundle.js',
    chunkFilename: 'scripts/[id].bundle.js' //dundle生成的配置
  },
  devServer: {
    contentBase: GLOBALS.folders.BUILD,
    hot: true,
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors', // 将公共模块提取，生成名为`vendors`bundle
      chunks: ['vendors', 'app'], //提取哪些模块共有的部分,名字为上面的vendor
      minChunks: Infinity // 提取至少*个模块共有的部分
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new ExtractTextPlugin('styles/axilspot.css'),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.DefinePlugin(GLOBALS.DEFINE_OBJ),
    new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
      favicon: 'src/favicon.ico', //favicon存放路径
      filename: 'index.html', //生成的html存放路径，相对于 path
      template: 'src/index_pub.html', //html模板路径
      inject: true, //允许插件修改哪些内容，包括head与body
      hash: true, //为静态资源生成hash值
      chunks: ['vendors', 'app'], //需要引入的chunk，不配置就会引入所有页面的资源.名字来源于你的入口文件
      minify: { //压缩HTML文件
        removeComments: false, //移除HTML中的注释
        collapseWhitespace: true //删除空白符与换行符
      }
    })
  ],
};
