
// 浏览器更好的支持es5, fetch,  promise等标准
require('es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');
require('es6-promise').polyfill();
require('whatwg-fetch');
// end 支持

const React = require('react');
const ReactDOM = require('react-dom');
const ReactRouterDom = require('react-router-dom');
const appActions = require('shared/actions/app');
const thunkMiddleware = require('redux-thunk').default;

const combineReducers = require('redux').combineReducers;
const applyMiddleware = require('redux').applyMiddleware;
const createStore = require('redux').createStore;
const Provider = require('react-redux').Provider;
const AppContainer = require('react-hot-loader').AppContainer;
const prodConfig = require('./config/axcIndia');

const HashRouter = ReactRouterDom.HashRouter;
const Route = ReactRouterDom.Route;
// const unmountComponentAtNode = ReactDOM.unmountComponentAtNode;

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
  const appRootRoute = renderRoutes[0];

  // 主渲染入口
  ReactDOM.render(
    <AppContainer>
      <Provider store={stores}>
        <HashRouter>
          <Route
            path={appRootRoute.path}
            render={
              props => (
                <appRootRoute.component {...props} route={appRootRoute} />
              )
            }
          />
        </HashRouter>
      </Provider>
    </AppContainer>,
    mountNode,
  );
}

renderApp(prodConfig.routes);


// Enable hot reload by react-hot-loader
if (module.hot) {
  module.hot.accept('./config/axcIndia', () => {
    //setImmediate(() => {
    const nextConfig = require('./config/axcIndia');
    // Preventing the hot reloading error from react-router
    // unmountComponentAtNode(mountNode);

      stores.replaceReducer(combineReducers({
        ...nextConfig.reducers,
      }));
      // 主渲染入口
      renderApp(nextConfig.routes);
    });
  //});
}
