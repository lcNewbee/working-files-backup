// 浏览器更好的支持es5, fetch,  promise等标准
require('console-polyfill');
require('classlist-polyfill');
require('es5-shim');
require('es5-shim/es5-sham');
require('es6-promise');
require('whatwg-fetch');
// end 支持

const React = require('react');
const ReactDOM = require('react-dom');
const ReactRouter = require('react-router');
const Provider = require('react-redux').Provider;
const combineReducers = require('redux').combineReducers;

const Router = ReactRouter.Router;
const hashHistory = ReactRouter.hashHistory;

// 引入产品配置
const prodConfig = require('./config/ap');

if (module.hot) {
  // Enable Webpack hot module replacement for reducers
  module.hot.accept('./config/ap', () => {
    const newConfig = require('./config/ap');
    const nextRootReducer = combineReducers(newConfig.reducers);

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
