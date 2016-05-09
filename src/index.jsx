// 支持 ie8
require('es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');
require('es6-promise');
require('fetch-detector');
require('fetch-ie8');
// end 支持 ie8

const React = require('react');
const ReactDOM = require('react-dom');
const ReactRouter = require('react-router');
const Provider = require('react-redux').Provider;
const Router = ReactRouter.Router;
const hashHistory = ReactRouter.hashHistory;

// 引入产品配置
const prodConfig = require('./config/ac5000');

if (module.hot) {
  // Enable Webpack hot module replacement for reducers
  module.hot.accept('./config/ac5000', () => {
    const nextRootReducer = require('./config/ac5000').reducers;
    prodConfig.stores.replaceReducer(nextRootReducer);
  });
}

// 主渲染入口
ReactDOM.render(
  <Provider store={prodConfig.stores}>
    <Router history={hashHistory} routes={prodConfig.routes} />
  </Provider>,
  document.getElementById('app')
);