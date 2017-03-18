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
const ReactRouterDom = require('react-router-dom');
const appActions = require('shared/actions/app');
const thunkMiddleware = require('redux-thunk').default;

const combineReducers = require('redux').combineReducers;
const applyMiddleware = require('redux').applyMiddleware;
const createStore = require('redux').createStore;
const Provider = require('react-redux').Provider;
const AppContainer = require('react-hot-loader').AppContainer;
let prodConfig = require('./config/axc2.5');

const HashRouter = ReactRouterDom.HashRouter;
const unmountComponentAtNode = ReactDOM.unmountComponentAtNode;

const mountNode = document.getElementById('app');

const remoteActionMiddleware = applyMiddleware(
  thunkMiddleware,
)(createStore);

// 引入产品配置
const renderApp = () => {
  let App = null;

  prodConfig = require('./config/axc2.5');
  App = prodConfig.routes[0].component;

  // Store
  const stores = remoteActionMiddleware(
    combineReducers({
      ...prodConfig.reducers,
    }),

    // 支持 chrome 插件 Redux DevTools
    window.devToolsExtension ? window.devToolsExtension() : f => f,
  );

  // 初始化 App Config
  if (prodConfig.appConfig) {
    stores.dispatch(appActions.initAppConfig(prodConfig.appConfig));
  }

  // 主渲染入口
  ReactDOM.render(
    <AppContainer>
      <Provider store={stores}>
        <HashRouter>
          <App routes={prodConfig.routes} />
        </HashRouter>
      </Provider>
    </AppContainer>,
    mountNode,
  );
};

renderApp();

// Enable hot reload by react-hot-loader
if (module.hot) {
  // const reRenderApp = () => {
  //   renderApp();
  // };
  module.hot.accept('./config/axc3.0', () => {
    setImmediate(() => {
      // Preventing the hot reloading error from react-router
      unmountComponentAtNode(mountNode);
      renderApp();
    });
  });
}
