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
const remoteActionMiddleware = require('./components/remote_action_middleware');
const Provider = require('react-redux').Provider;
const combineReducers = require('redux').combineReducers;
const Router = ReactRouter.Router;
const hashHistory = ReactRouter.hashHistory;

// 引入产品配置
const prodConfig = require('./products/ac5000');

// Store
const store = remoteActionMiddleware(
  combineReducers(prodConfig.reducers),
  window.devToolsExtension ? window.devToolsExtension() : f => f
);

// 主渲染入口
ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory} routes={prodConfig.routes} />
  </Provider>,
  document.getElementById('app')
);

fetch('/lang/zh-cn.json')
  .then(function(rq) {
    return rq.json();
  })
  .then(function(json) {
    //alert(json)
  })
