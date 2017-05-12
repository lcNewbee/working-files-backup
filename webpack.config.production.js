var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');
var HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');

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
};

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

var polyfillList = [
  "es6-promise/auto",
  "whatwg-fetch",
]

module.exports = {
  entry: {
    app: ['core-js/shim', 'isomorphic-fetch', './src/index_pub.jsx'],
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
              name: 'images/[name].[ext]',
            },
          }
        ]
      },

      {
        test: /\.(jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'images/[hash].[ext]',
            },
          }
        ]
      },

      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
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
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: [
            "css-loader",
            "postcss-loader",
          ],
        })
      },

      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: [
            "css-loader",
            "postcss-loader",
            "sass-loader"
          ],
        })
      },

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
              presets: [
                ["es2015", { "modules": false }]
              ],
              plugins: ['syntax-dynamic-import'],
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
    path: GLOBALS.folders.BUILD,
    publicPath: '/',
    filename: 'scripts/[name].bundle.js',
    chunkFilename: 'scripts/[id].bundle.js' //dundle生成的配置
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      debug: false,
      cache: true,
      // set to false to see a list of every file being bundled.
      noInfo: true,

      options: {
        context: __dirname,
      }
    }),
    // new webpack.ProvidePlugin({
    //   'fetch': 'isomorphic-fetch',
    // }),
    new webpack.DllReferencePlugin({
      context: "dll",
      manifest: require("./src/config/scripts/vendors-manifest.json")
    }),

    new webpack.DefinePlugin(GLOBALS.DEFINE_OBJ),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: ['vendors'], // 将公共模块提取，生成名为`vendors`bundle
    //   chunks: ['vendors', 'app'], //提取哪些模块共有的部分,名字为上面的vendor
    //   minChunks: 2, // Infinity // 提取至少*个模块共有的部分
    // }),
    new ExtractTextPlugin({
      filename: "styles/axilspot.css",
      allChunks: true
    }),
    new webpack.optimize.UglifyJsPlugin(),

    new HtmlWebpackIncludeAssetsPlugin({
      assets: ['scripts/vendors.bundle.js'],
      append: false,
      hash: true
    }),
    new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
      favicon: 'src/favicon.ico', //favicon存放路径
      filename: 'index.html', //生成的html存放路径，相对于 path
      template: 'src/index_pub.html', //html模板路径
      inject: true, //允许插件修改哪些内容，包括head与body
      hash: true, //为静态资源生成hash值
      //chunks: ['manifest', 'vendors', 'app'], //需要引入的chunk，不配置就会引入所有页面的资源.名字来源于你的入口文件
      minify: { //压缩HTML文件
        removeComments: false, //移除HTML中的注释
        collapseWhitespace: true //删除空白符与换行符
      }
    }),
  ],
};
