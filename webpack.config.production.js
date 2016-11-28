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
  "react-addons-shallow-compare",
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
    app: './src/index_pub.jsx',
    vendors: vendorList,
  },
  module: {
    rules: [
      {
        test: /\.png$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              mimetype: 'image/png',
              limit: 11000,
              name: 'images/[hash].[ext]',
            },
          }
        ]
      },

      {
<<<<<<< HEAD
        test: /\.(jpg|gif)$/,
        loader: 'url-loader',
=======
        test: /\.jpg$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 11000,
              name: 'images/[hash].[ext]',
            },
          }
        ]
>>>>>>> Common: 更新平台版本，升级webpack2
      },

      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
<<<<<<< HEAD
        loader: 'url-loader?name=font/[hash].[ext]',
=======
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'font/[hash].[ext]',
              limit: 11000,
              mimetype: 'mimetype=application/font-woff',
            }
          }
        ]
>>>>>>> Common: 更新平台版本，升级webpack2
      },

      {
        test: /\.(ttf|eot|svg|cur)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'font/[hash].[ext]',
            }
          }
        ]
      },

      {
        test: /\.json$/,
        use: [
          {
            loader: 'json-loader',
          }
        ]
      },

      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          loader: "css-loader",
        })
      },

      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          publicPath: "styles",
          loader: "css-loader?minimize!postcss-loader!sass-loader",
        })
      },

      {
        test: /\.(js|jsx)?$/,
        include: [
          path.resolve(__dirname, "src"),
          path.resolve(__dirname, "shared"),
          path.resolve(__dirname, "test"),
          path.resolve(__dirname, "tools")
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
    modules: ['node_modules', 'shared'],
  },
  output: {
    path: GLOBALS.folders.BUILD,
    publicPath: '/',
    filename: 'scripts/[name].bundle.js',
    chunkFilename: 'scripts/[id].bundle.js' //dundle生成的配置
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      cache: true,
      options: {
        context: __dirname,
        postcss() {
          return [autoprefixerHandle];
        },
      }
    }),
    new webpack.DefinePlugin(GLOBALS.DEFINE_OBJ),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors', // 将公共模块提取，生成名为`vendors`bundle
      chunks: ['vendors', 'app'], //提取哪些模块共有的部分,名字为上面的vendor
      minChunks: 2  // 提取至少*个模块共有的部分: Infinity
    }),
    new ExtractTextPlugin({
      filename: "styles/axilspot.css",
      disable: false,
      allChunks: true
    }),
    new webpack.optimize.UglifyJsPlugin(),
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
