var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');

var GLOBALS = {
  DEFINE_OBJ: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    __DEV__: false,
  },

  folders: {
    TMP: path.resolve(__dirname, '.tmp'),
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

// 配置公用模块
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
  "react-dom",
  "react-redux",
  "react-router",
  "react-select",
  "react-dates",
  "rc-time-picker",
  "redux",
  "redux-thunk",
  "moment",

  /**
   * echarts图标按需引入
   */
  'echarts/lib/echarts',
  // 引入柱状图
  'echarts/lib/chart/bar',

  // 引入折线图
  'echarts/lib/chart/line',
  'echarts/lib/chart/lines',

  // 引入折饼图
  'echarts/lib/chart/pie',

  // 仪表盘
  'echarts/lib/chart/gauge',

  // 引入提示框和标题组件
  'echarts/lib/component/tooltip',
  'echarts/lib/component/legend',
  'echarts/lib/component/title',
];

module.exports = {
  entry: {
    vendors: ['./src/config/scripts/vendors.js'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        include: [
          path.resolve(__dirname, "src"),
          path.resolve(__dirname, "shared"),
        ],
        use: [
          {
            loader: "babel-loader",
            options: {
              "presets": [
                ["es2015", { "modules": false }]
              ],
              cacheDirectory: true,
            }
          },
        ]
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      path.resolve(__dirname, "node_modules"),
      path.resolve(__dirname, "shared"),
    ],
  },
  output: {
    path: path.resolve(__dirname, "src/assets/"),
    publicPath: '/',
    filename: 'scripts/[name].dll.js',
    library: "[name]"
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      cache: true,
      // set to false to see a list of every file being bundled.
      noInfo: true,

      options: {
        context: __dirname,
      }
    }),
    new webpack.DllPlugin({
      path: path.join(__dirname, "src/config/scripts", "[name]-manifest.json"),
      name: "[name]",
      context: 'dll'
    }),
    new webpack.DefinePlugin(GLOBALS.DEFINE_OBJ),
    new webpack.optimize.UglifyJsPlugin(),
  ]
};
