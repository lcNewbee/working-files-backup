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
<<<<<<< c64286f1c5872e593284587d20a1511fb440e642
<<<<<<< d9dc1cdf1da216ae5a6594e1c7d582052239a49c
<<<<<<< 97e60cfc383ff0cf81edc37b05b9d52ecddd4c74
const renderApp = () => {
  const prodConfig = require('./config/axc');
=======
const prodConfig = require('./config/aip5');
>>>>>>> 平台添加新功能，并修改部分bug
=======
const prodConfig = require('./config/aip10');
>>>>>>> AP：解BUG & 平台继续添加新功能
=======
const prodConfig = require('./config/aip5');
>>>>>>> Ap:添加AP发布的gulp命令

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
<<<<<<< 97e60cfc383ff0cf81edc37b05b9d52ecddd4c74
  const reRenderApp = () => {
    try {
      renderApp();
    } catch (error) {}
  };
=======
  // Enable Webpack hot module replacement for reducers
  module.hot.accept('./config/aip5', () => {
    const newConfig = require('./config/aip5');

    const nextRootReducer = combineReducers(newConfig.reducers);
>>>>>>> 平台添加新功能，并修改部分bug

  module.hot.accept('./config/axc', () => {
    setImmediate(() => {
      // Preventing the hot reloading error from react-router
      unmountComponentAtNode(mountNode);
      reRenderApp();
    });
  });
}

renderApp();
