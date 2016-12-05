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
const AppContainer = require('react-hot-loader').AppContainer;

const unmountComponentAtNode = ReactDOM.unmountComponentAtNode;
const Router = ReactRouter.Router;
const hashHistory = ReactRouter.hashHistory;

const mountNode = document.getElementById('app');

// 引入产品配置
const renderApp = () => {
  const prodConfig = require('./config/axc');

  // 主渲染入口
  ReactDOM.render(
    <AppContainer>
      <Provider store={prodConfig.stores}>
        <Router history={hashHistory} routes={prodConfig.routes} />
      </Provider>
    </AppContainer>,
    mountNode,
  );
};

// Enable hot reload by react-hot-loader
if (module.hot) {
  const reRenderApp = () => {
    try {
      renderApp();
    } catch (error) {}
  };

<<<<<<< e2fb2375c88cfcb9299ad467cb84d66003b1cdf6
  module.hot.accept('./config/axc', () => {
=======
  module.hot.accept('./config/aip10', () => {
>>>>>>> AP: 首次登陆的快速设置页面排版及功能完成
    setImmediate(() => {
      // Preventing the hot reloading error from react-router
      unmountComponentAtNode(mountNode);
      reRenderApp();
    });
  });
}

renderApp();
