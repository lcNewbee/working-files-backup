import NotFound from 'components/NotFound';
import remoteActionMiddleware from 'utils/lib/remote_action_middleware';
import {combineReducers} from 'redux';

// 公用 样式
import 'scss/styles.scss';
import 'font-awesome/css/font-awesome.css';

// 多语言工具
const b28n = require('b28n');
const langCn = require('../lang/cn/core.json');
const curLang = 'cn';

b28n.addDict(langCn, 'cn');
b28n.init({
  supportLang:['en', curLang],
  lang: curLang
});

document.getElementsByTagName('body')[0].className += ' ' + curLang;

/*************************************************************
 * 产品界面配置
 */

// 公用组件

// 主APP
const App = require('../../screens/App');

// 登录界面
const pLogin = require('../../screens/App/screens/Login');
const sRegister = require('../../screens/App/screens/SignUp');

// 布局
const Main = require('../../screens/App/screens/Main');
const Settings = require('../../screens/App/screens/Main/screens/Settings');

// 热点统计
const pStatus = require('../../screens/App/screens/Main/screens/Stats');

// 设备
const pDevices = require('../../screens/App/screens/Main/screens/Devices');

// 设备地图
const pDeviceMap = require('../../screens/App/screens/Main/screens/DeviceMap');
const pStatistics = require('../../screens/App/screens/Main/screens/Statistics');
const pLogs = require('../../screens/App/screens/Main/screens/Logs');
const pClients = require('../../screens/App/screens/Main/screens/Clients');

// 设置
const pGroupSettings = require('../../screens/App/screens/Main/screens/Settings/screens/GroupSettings');
const sBandwidth = require('../../screens/App/screens/Main/screens/Settings/screens/Bandwidth');
const sWireless = require('../../screens/App/screens/Main/screens/Settings/screens/Wireless');
const sPortal = require('../../screens/App/screens/Main/screens/Settings/screens/Portal');
const sGuest = require('../../screens/App/screens/Main/screens/Settings/screens/Guest');
const sPassword = require('../../screens/App/screens/Main/screens/Settings/screens/Password');

let routes = [{
    path: '/',
    component: App,
    indexRoute: {component: pLogin.View},
    childRoutes: [
      {
        path: '/main',
        component: Main,
        childRoutes: [{
            id: 'status',
            isIndex: true,
            path: '/main/status',
            icon: 'bar-chart',
            text: _('STATISTICS'),
            component: pStatus.View
          }, {
            id: 'devices',
            path: '/main/devices',
            icon: 'bullseye',
            text: _('DEVICES'),
            component: pDevices.View
          }, {
            id: 'clients',
            path: '/main/clients',
            icon: 'desktop',
            text: _('CLIENTS'),
            component: pClients.View
          }, {
            id: 'logs',
            path: '/main/logs',
            icon: 'file-text-o',
            text: _('LOGS'),
            component: pLogs.View
          }, {
            id: 'statistics',
            path: '/main/statistics',
            icon: 'file-pdf-o',
            text: _('REPORTS'),
            component: pStatistics.View
          }, {
            id: 'settings',
            path: '/main/settings',
            icon: 'cog',
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
      }, {
        path: '/register',
        component: sRegister.Screen
      }
    ]
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

