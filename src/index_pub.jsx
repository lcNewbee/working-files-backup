// import 'core-js/shim';
require('shared/shim');

const React = require('react');
const ReactDOM = require('react-dom');
const ReactRouterDom = require('react-router-dom');
const redux = require('redux');
const appActions = require('shared/containers/app/actions');
const thunkMiddleware = require('redux-thunk').default;
const Provider = require('react-redux').Provider;
const RouteSwitches = require('shared/components/Organism/RouterConfig').RouteSwitches;
const prodConfig = require('./config/AEC120').default;

const combineReducers = redux.combineReducers;
const applyMiddleware = redux.applyMiddleware;
const createStore = redux.createStore;
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
    <Provider store={stores}>
      <HashRouter>
        <RouteSwitches
          routes={renderRoutes}
        />
      </HashRouter>
    </Provider>,
    mountNode,
  );
}

renderApp(prodConfig.routes);
