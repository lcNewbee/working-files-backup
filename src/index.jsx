require('shared/shim');

const React = require('react');
const ReactDOM = require('react-dom');
const ReactRouterDom = require('react-router-dom');
const appActions = require('shared/containers/app/actions');
const redux = require('redux');

const thunkMiddleware = require('redux-thunk').default;
const Provider = require('react-redux').Provider;
const AppContainer = require('react-hot-loader').AppContainer;
const prodConfig = require('./config/ac').default;

const combineReducers = redux.combineReducers;
const applyMiddleware = redux.applyMiddleware;
const createStore = redux.createStore;
const HashRouter = ReactRouterDom.HashRouter;
const Route = ReactRouterDom.Route;
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
  const rootRoute = renderRoutes[0];
  const RootContainer = rootRoute.component;

  // 主渲染入口
  ReactDOM.render(
    <AppContainer>
      <Provider store={stores}>
        <HashRouter>
          <Route
            render={props => (
              <RootContainer
                {...props}
                route={rootRoute}
              />
            )}
          />
        </HashRouter>
      </Provider>
    </AppContainer>,
    mountNode,
  );
}
window.onload = () => {
  renderApp(prodConfig.routes);
};

// Enable hot reload by react-hot-loader
if (module.hot) {
  module.hot.accept('./config/ac', () => {
    /* eslint-disable global-require */
    const nextConfig = require('./config/ac').default;

    stores.replaceReducer(combineReducers({
      ...nextConfig.reducers,
    }));
    // 主渲染入口
    renderApp(nextConfig.routes);
  });
}

if (process.env.NODE_ENV !== 'production' && window.dev) {
  const { whyDidYouUpdate } = require('why-did-you-update');
  whyDidYouUpdate(React);
}
