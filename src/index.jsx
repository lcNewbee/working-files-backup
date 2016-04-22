// 支持 ie8
require('es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');
require('es6-promise');
require('fetch-detector');
require('fetch-ie8');
// end 支持 ie8

const utils = require('utils');
const React = require('react');
const ReactDOM = require('react-dom');
const ReactRouter = require('react-router');
const Redux = require('redux');
const ReactRedux = require('react-redux');
const App = require('./components/App');
const remoteActionMiddleware = require('./components/remote_action_middleware');
const Router = ReactRouter.Router;
const Route = ReactRouter.Route;
const IndexRoute = ReactRouter.IndexRoute;
const hashHistory = ReactRouter.hashHistory;
const Provider = ReactRedux.Provider;
const combineReducers = Redux.combineReducers;

// 公用 样式
require('./components/comlan/scss/main.scss')


/*************************************************************
 * 产品界面配置
 */
// main
const configObj = {
  mainNav: [
    {
      id: 'status',
      path: '/main/status',
      text: '热点统计'
    },
    {
      id: 'device',
      path: '/main/device',
      text: '设备'
    },
    {
      id: 'clients',
      path: '/main/clients',
      text: '客户端'
    },
    {
      id: 'deviceMap',
      path: '/main/deviceMap',
      text: '地图'
    },
    {
      id: 'logs',
      path: '/main/logs',
      text: '日志'
    },
    {
      id: 'statistics',
      path: '/main/statistics',
      text: '统计报表'
    },
    {
      id: 'settings',
      path: '/main/settings',
      text: '设置'
    }
  ],
  name: '测试产品'
};
// Login
const pLogin = require('./pages/Login');

// 主界面
const MainContainer = require('./components/Main').MainContainer;

// 热点统计
const pStatus = require('./pages/Stats');

// 设备
const pDevice = require('./pages/Device');

// 设备地图
const pDeviceMap = require('./pages/DeviceMap');

// 设置
const pSettings = require('./pages/Settings');
const pStatistics = require('./pages/Statistics');
const pLogs = require('./pages/Logs');
const pClients = require('./pages/Clients');

function config(state = configObj, action) {
  return state;
};
// 配置模块页面 store
const appReducers = combineReducers({
  config,
  status: pStatus.status,
  device: pDevice.device,
  login: pLogin.login,
  clients: pClients.clients,
  logs: pLogs.logs,
  settings: pSettings.settings,
  statistics: pStatistics.statistics
});

// 界面菜单路由配置
const routes = <Route path='/' component={App}>
  <IndexRoute component={pLogin.View} />
  <Route path="/main" component={MainContainer} >
    <IndexRoute component={pStatus.View} />
    <Route path="status" component={pStatus.View} />
    <Route path="device" component={pDevice.View} />
    <Route path="clients" component={pClients.View} />
    <Route path="logs" component={pLogs.View} />
    <Route path="settings" component={pSettings.View} />
  </Route>
</Route>;

/*
 * End 产品界面配置
 *************************************************************/


// main
const store = remoteActionMiddleware(appReducers);
ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>{routes}</Router>
  </Provider>,
  document.getElementById('app')
);
