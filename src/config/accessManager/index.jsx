import { combineReducers } from 'redux';
import NotFound from 'shared/components/NotFound';
import remoteActionMiddleware from 'shared/utils/lib/remote_action_middleware';

//
import 'shared/scss/styles.scss';
import guiConfig from './config.json';

// 多语言工具
const b28n = require('shared/b28n');
const langCn = require('../lang/cn/core.json');
const validateCn = require('../lang/cn/validate.json');
const langEn = require('../lang/en/core.json');

const bodyElem = document.getElementsByTagName('body')[0];

b28n.addDict(langCn, 'cn');
b28n.addDict(validateCn, 'cn');
b28n.addDict(langEn, 'en');

window.CB = b28n.init({
  supportLang: ['en', 'cn'],
});
window.guiConfig = guiConfig;

bodyElem.className = `${bodyElem.className} ${b28n.getLang()}`;

/** ***********************************************************
 * 产品界面配置
 */

// 公用组件

// 主APP
const App = require('../../screens/App');

// 登录界面
const pLogin = require('../../screens/App/screens/Login');
// const sRegister = require('../../screens/App/screens/SignUp');
const sWizard = require('../../screens/App/screens/Wizard');

// 布局
const Main = require('../../screens/App/screens/Main').Screen;
const Settings = require('../../screens/App/screens/Main/screens/Settings');

// 热点统计
const pStatus = require('../../screens/App/screens/Main/screens/Stats');

// 设备
const pDevices = require('../../screens/App/screens/Main/screens/Devices');

// 设备地图
// const pDeviceMap = require('../../screens/App/screens/Main/screens/DeviceMap');
const pStatistics = require('../../screens/App/screens/Main/screens/Statistics');
const pLogs = require('../../screens/App/screens/Main/screens/Logs');
const pClients = require('../../screens/App/screens/Main/screens/Clients');
// const pPreview = require('../../screens/App/screens/Main/screens/Preview');

// 设置
const pGroupSettings =
    require('../../screens/App/screens/Main/screens/Settings/screens/GroupSettings');
const sWireless = require('../../screens/App/screens/Main/screens/Settings/screens/Wireless');
const sPortal = require('../../screens/App/screens/Main/screens/Settings/screens/Portal');
const sGuest = require('../../screens/App/screens/Main/screens/Settings/screens/Guest');
const sVoip = require('../../screens/App/screens/Main/screens/Settings/screens/Voip');
const sAdmin = require('../../screens/App/screens/Main/screens/Settings/screens/Admin');


const routes = [{
  path: '/',
  component: App.Screen,
  indexRoute: { component: pLogin.Screen },
  childRoutes: [
    {
      path: '/main',
      component: Main,
      childRoutes: [
        {
          id: 'status',
          isIndex: true,
          path: '/main/status',
          icon: 'bar-chart',
          text: _('STATISTICS'),
          component: pStatus.Screen,
        }, {
          id: 'devices',
          path: '/main/devices',
          icon: 'bullseye',
          text: _('DEVICES'),
          component: pDevices.Screen,
        }, {
          id: 'clients',
          path: '/main/clients',
          icon: 'desktop',
          text: _('CLIENTS'),
          component: pClients.Screen,
        }, {
          id: 'logs',
          path: '/main/logs',
          icon: 'file-text-o',
          text: _('LOGS'),
          component: pLogs.Screen,
        }, {
          id: 'statistics',
          path: '/main/statistics',
          icon: 'file-pdf-o',
          text: _('REPORTS'),
          component: pStatistics.Screen,
        }, {
          id: 'settings',
          path: '/main/settings',
          icon: 'cog',
          text: _('SETTINGS'),
          component: Settings,
          indexRoute: {
            onEnter: (nextState, replace) => replace('/main/settings/group'),
          },
          childRoutes: [
            {
              path: '/main/settings/group',
              text: _('Groups'),
              component: pGroupSettings.Screen,
            }, {
              id: 'wireless',
              path: '/main/settings/wireless',
              text: _('Wireless'),
              component: sWireless.Screen,
            }, {
              id: 'portal',
              path: '/main/settings/portal',
              text: _(_('Portal Settings')),
              component: sPortal.Screen,
            }, {
              id: 'guest',
              path: '/main/settings/guest',
              text: _('Guest Settings'),
              component: sGuest.Screen,
            }, {
              id: 'voip',
              path: '/main/settings/voip',
              text: _('VoIP'),
              component: sVoip.Screen,
            }, {
              id: 'password',
              path: '/main/settings/admin',
              text: _('Admin'),
              component: sAdmin.Screen,
            },
          ],
        }],
    }, {
      path: '/wizard',
      component: sWizard.Screen,
    },
  ],
}, {
  path: '*',
  component: NotFound,
}];


// 配置模块页面 store
const reducers = {
  app: App.app,
  status: pStatus.status,
  devices: pDevices.devices,
  login: pLogin.login,
  clients: pClients.clients,
  logs: pLogs.logs,
  statistics: pStatistics.statistics,
  groupSettings: pGroupSettings.settings,
  wireless: sWireless.reducer,
  portal: sPortal.reducer,
  guest: sGuest.reducer,
  voip: sVoip.reducer,
  admin: sAdmin.reducer,
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
  stores,
};


export default ac5000;

