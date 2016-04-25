// 公用 样式
require('../../components/comlan/scss/main.scss')

/*************************************************************
 * 产品界面配置
 */
// 登录界面
const pLogin = require('../../pages/Login');

// // 布局
const App = require('../../components/App');
const Main = require('../../components/Main');
const TabMenus =require('../../components/TabMenus');

// 通用模块
const NotFound = require('../../components/NotFound');

// 热点统计
const pStatus = require('../../pages/Stats');

// 设备
const pDevice = require('../../pages/Device');

// 设备地图
const pDeviceMap = require('../../pages/DeviceMap');

// 设置
const pSettings = require('../../pages/Settings');
const pStatistics = require('../../pages/Statistics');
const pLogs = require('../../pages/Logs');
const pClients = require('../../pages/Clients');

let routes = [{
    path: '/',
    component: App,
    indexRoute: {component: pLogin.View},
    childRoutes: [{
      path: '/main',
      component: Main,
      childRoutes: [{
          id: 'status',
          isIndex: true,
          path: '/main/status',
          text: '热点统计',
          component: pStatus.View
        }, {
          id: 'device',
          path: '/main/device',
          text: '设备',
          component: pDevice.View
        }, {
          id: 'clients',
          path: '/main/clients',
          text: '客户端',
          component: pClients.View
        }, {
          id: 'deviceMap',
          path: '/main/deviceMap',
          text: '地图',
          component: pDeviceMap.View
        }, {
          id: 'logs',
          path: '/main/logs',
          text: '日志',
          component: pLogs.View
        }, {
          id: 'statistics',
          path: '/main/statistics',
          text: '统计报表',
          component: pStatistics.View
        }, {
          id: 'settings',
          path: '/main/settings',
          text: '设置',
          component: TabMenus,
          indexRoute: {component: pDevice.View},
          childRoutes: [{
            id: 'deviceGroup',
            path: '/main/settings/deviceGroup',
            text: '组设置',
            component: pStatistics.View
          }]
      }]
    }]
  }, {
    path: '*',
    component: NotFound
}];

// 配置模块页面 store
const reducers = {
  status: pStatus.status,
  device: pDevice.device,
  login: pLogin.login,
  clients: pClients.clients,
  logs: pLogs.logs,
  settings: pSettings.settings,
  statistics: pStatistics.statistics
};

const ac5000 = {
  reducers: reducers,
  routes: routes
}

module.exports = ac5000;

