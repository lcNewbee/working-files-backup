// 浏览器更好的支持es5, fetch,  promise等标准
require('es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');
require('es6-promise').polyfill();
require('whatwg-fetch');
// end 支持

const React = require('react');
const ReactDOM = require('react-dom');
const ReactRouter = require('react-router');
const Provider = require('react-redux').Provider;
<<<<<<< ca21a0d707269bf1ec5190dd8d34ef44a3732de0
const prodConfig = require('./config/ASC120');
=======
const prodConfig = require('./config/axcPortal');
>>>>>>> AXC:切换产品

const Router = ReactRouter.Router;
const hashHistory = ReactRouter.hashHistory;
const mountNode = document.getElementById('app');

// 引入产品配置
const renderApp = () => {
  // 主渲染入口
  ReactDOM.render(
    <Provider store={prodConfig.stores}>
      <Router history={hashHistory} routes={prodConfig.routes} />
    </Provider>,
    mountNode,
  );
};

renderApp();
