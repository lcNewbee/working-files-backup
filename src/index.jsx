require('es6-promise/auto');

const React = require('react');
const ReactDOM = require('react-dom');
const ReactRouterDom = require('react-router-dom');
const appActions = require('shared/containers/app/actions');

const thunkMiddleware = require('redux-thunk').default;
const combineReducers = require('redux').combineReducers;
const applyMiddleware = require('redux').applyMiddleware;
const createStore = require('redux').createStore;
const Provider = require('react-redux').Provider;
const AppContainer = require('react-hot-loader').AppContainer;
const renderRoutesSwitch = require('shared/components/Organism/RouterConfig').renderRoutesSwitch;
const prodConfig = require('./config/axcMonitor').default;

const HashRouter = ReactRouterDom.HashRouter;
const mountNode = document.getElementById('app');

const remoteActionMiddleware = applyMiddleware(
  thunkMiddleware,
)(createStore);

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

function renderApp(renderRoutes) {
  // 主渲染入口
  ReactDOM.render(
    <AppContainer>
      <Provider store={stores}>
        <HashRouter>
          {renderRoutesSwitch(renderRoutes)}
        </HashRouter>
      </Provider>
    </AppContainer>,
    mountNode,
  );
}
renderApp(prodConfig.routes);

// Enable hot reload by react-hot-loader
if (module.hot) {
  module.hot.accept('./config/axcMonitor', () => {
    const nextConfig = require('./config/axcMonitor').default;

    stores.replaceReducer(combineReducers({
      ...nextConfig.reducers,
    }));
    // 主渲染入口
    renderApp(nextConfig.routes);
  });
}
