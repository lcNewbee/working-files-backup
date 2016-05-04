// 公用 样式
require('../../../web_modules/comlan/scss/main.scss')
require('font-awesome/css/font-awesome.css');
var lang = require('../../lang/zh-cn.json');

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
          text: 'STATISTICS',
          component: pStatus.View
        }, {
          id: 'devices',
          path: '/main/devices',
          text: 'DEVICES',
          component: pDevices.View
        }, {
          id: 'clients',
          path: '/main/clients',
          text: 'CLIENTS',
          component: pClients.View
        }, {
          id: 'logs',
          path: '/main/logs',
          text: 'LOGS',
          component: pLogs.View
        }, {
          id: 'statistics',
          path: '/main/statistics',
          text: 'REPORTS',
          component: pStatistics.View
        }, {
          id: 'settings',
          path: '/main/settings',
          text: 'SETTINGS',
          component: TabMenus,
          indexRoute: {
            onEnter: (nextState, replace) => replace('/main/settings/group')
          },
          childRoutes: [{
              path: '/main/settings/group',
              text: 'Groups',
              component: pGroupSettings.View
            },{
            id: 'bandwidth',
            path: '/main/settings/bandwidth',
            text: 'Bandwidth',
            component: pStatistics.View
          },{
            id: 'wireless',
            path: '/main/settings/wireless',
            text: 'Wireless',
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

