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

  // more info:https://webpack.github.io/docs/build-performance.html#sourcemaps and https://webpack.github.io/docs/configuration.html#devtool
  devtool: 'eval-source-map',

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
    rules: [
      {
        test: /\.png$/,
        use: [
          {
            loader: 'url-loader',
          }
        ]
      },

      {
        test: /\.jpg$/,
        use: [
          {
            loader: 'url-loader',
          }
        ]
      },

      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'url-loader',
          }
        ]
      },

      {
        test: /\.(ttf|eot|svg|cur)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'file-loader',
          }
        ]
      },

      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          }
        ]
      },

      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          },
          {
            loader: "postcss-loader"
          },
          {
            loader: "sass-loader"
          }
        ]
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
              "presets": [
                ["es2015", { "modules": false }]
              ]
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
  performance: {
    hints: false, // enum
    maxAssetSize: 24000000, // int (in bytes),
    maxEntrypointSize: 40000000, // int (i bytes
  },

  plugins: [
    new webpack.LoaderOptionsPlugin({
      debug: true,

      // set to false to see a list of every file being bundled.
      noInfo: true,

      options: {
        postcss() {
          return [autoprefixerHandle];
        },
      }
    }),
    new webpack.DefinePlugin(GLOBALS.DEFINE_OBJ),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
};

module.exports = config;

