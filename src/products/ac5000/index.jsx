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
const pDevices = require('../../pages/Devices');

// 设备地图
const pDeviceMap = require('../../pages/DeviceMap');

const pStatistics = require('../../pages/Statistics');
const pLogs = require('../../pages/Logs');
const pClients = require('../../pages/Clients');

// 设置
const pGroupSettings = require('../../pages/GroupSettings');

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
          id: 'devices',
          path: '/main/devices',
          text: '设备',
          component: pDevices.View
        }, {
          id: 'clients',
          path: '/main/clients',
          text: '客户端',
          component: pClients.View
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
          indexRoute: {
            component: pGroupSettings.View
          },
          childRoutes: [{
            id: 'deviceGroup',
            path: '/main/settings',
            text: '组设置',
          },{
            id: 'deviceGroup',
            path: '/main/settings/bandwidth',
            text: '流量设置',
            component: pStatistics.View
          },{
            id: 'deviceGroup',
            path: '/main/settings/wireless',
            text: '无线设置',
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
  devices: pDevices.devices,
  login: pLogin.login,
  clients: pClients.clients,
  logs: pLogs.logs,
  groupSettings: pGroupSettings.settings,
  statistics: pStatistics.statistics
};

const ac5000 = {
  reducers: reducers,
  routes: routes
}

module.exports = ac5000;

