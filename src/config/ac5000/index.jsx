import NotFound from 'components/NotFound';
import remoteActionMiddleware from 'utils/lib/remote_action_middleware';
import {combineReducers} from 'redux';

// 公用 样式
import 'scss/main.scss';
import 'font-awesome/css/font-awesome.css';

// 多语言工具
const b28n = require('b28n');
const langCn = require('../lang/cn/core.json');

b28n.addDict(langCn, 'cn');
b28n.init({
  supportLang:['en', 'cn'],
  lang: 'cn'
})

/*************************************************************
 * 产品界面配置
 */

// 公用组件

// 主APP
const App = require('../../screens/App');

// 登录界面
const pLogin = require('../../screens/App/Login');

// 布局
const Main = require('../../screens/App/Main');
const Settings = require('../../screens/App/Main/Settings');

// 热点统计
const pStatus = require('../../screens/App/Main/Stats');

// 设备
const pDevices = require('../../screens/App/Main/Devices');

// 设备地图
const pDeviceMap = require('../../screens/App/Main/DeviceMap');

const pStatistics = require('../../screens/App/Main/Statistics');
const pLogs = require('../../screens/App/Main/Logs');
const pClients = require('../../screens/App/Main/Clients');

// 设置
const pGroupSettings = require('../../screens/App/Main/Settings/GroupSettings');
const sBandwidth = require('../../screens/App/Main/Settings/Bandwidth');
const sWireless = require('../../screens/App/Main/Settings/Wireless');
const sPortal = require('../../screens/App/Main/Settings/Portal');
const sGuest = require('../../screens/App/Main/Settings/Guest');
const sPassword = require('../../screens/App/Main/Settings/Password');

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
          text: _('STATISTICS'),
          component: pStatus.View
        }, {
          id: 'devices',
          path: '/main/devices',
          text: _('DEVICES'),
          component: pDevices.View
        }, {
          id: 'clients',
          path: '/main/clients',
          text: _('CLIENTS'),
          component: pClients.View
        }, {
          id: 'logs',
          path: '/main/logs',
          text: _('LOGS'),
          component: pLogs.View
        }, {
          id: 'statistics',
          path: '/main/statistics',
          text: _('REPORTS'),
          component: pStatistics.View
        }, {
          id: 'settings',
          path: '/main/settings',
          text: _('SETTINGS'),
          component: Settings,
          indexRoute: {
            onEnter: (nextState, replace) => replace('/main/settings/group')
          },
          childRoutes: [{
              path: '/main/settings/group',
              text: _('Groups'),
              component: pGroupSettings.View
            },{
            id: 'bandwidth',
            path: '/main/settings/bandwidth',
            text: _('Bandwidth'),
            component: sBandwidth.Screen
          },{
            id: 'wireless',
            path: '/main/settings/wireless',
            text: _('Wireless'),
            component: sWireless.Screen
          },{
            id: 'portal',
            path: '/main/settings/portal',
            text: _(_('Portal Settings')),
            component: sPortal.Screen
          },{
            id: 'guest',
            path: '/main/settings/guest',
            text: _('Guest'),
            component: sGuest.Screen
          },{
            id: 'password',
            path: '/main/settings/admin',
            text: _('Admin'),
            component: sPassword.Screen
          }
        ]
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
  statistics: pStatistics.statistics,
  groupSettings: pGroupSettings.settings,
  bandwidth: sBandwidth.reducer,
  wireless: sWireless.reducer,
  portal: sPortal.reducer,
  guest: sGuest.reducer,
  password: sPassword.reducer
};

// Store
const stores = remoteActionMiddleware(
  combineReducers(reducers),
  
  // 支持 chrome 插件 Redux DevTools
  window.devToolsExtension ? window.devToolsExtension() : f => f
);

const ac5000 = {
  reducers,
  routes,
  stores
}

export default ac5000;

