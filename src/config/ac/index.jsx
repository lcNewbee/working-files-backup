import b28n from 'shared/b28n';
import NotFound from 'shared/components/NotFound';
import { reducer as toastrReducer } from 'react-redux-toastr';

//
import 'shared/scss/styles.scss';
import guiConfig from './config.json';

// 多语言工具
const langCnCore = require('../lang/cn/core.json');
const langCnAc = require('../lang/cn/ac.json');
const langEn = require('../lang/en/core.json');

const bodyElem = document.getElementsByTagName('body')[0];

b28n.addDict(langCnCore, 'cn');
b28n.addDict(langCnAc, 'cn');
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
const app = require('shared/containers/app');
const appScreen = require('shared/containers/appScreen');
const SharedComponents = require('shared/components');

// 登录界面
const sLogin = require('../../screens/App/screens/Login');
// const sRegister = require('../../screens/App/screens/SignUp');
const sWizard = require('../../screens/App/screens/Wizard');

// 布局
const Main = require('../../screens/App/screens/Main').Screen;

// 热点统计
const sStatus = require('../../screens/App/screens/Main/screens/Stats');

// 设备
const sDevices = require('../../screens/App/screens/Main/screens/Devices');

// 设备地图
// const sDeviceMap = require('../../screens/App/screens/Main/screens/DeviceMap');
// const sStatistics = require('../../screens/App/screens/Main/screens/Statistics');
const sLogs = require('../../screens/App/screens/Main/screens/Logs');
const sClients = require('../../screens/App/screens/Main/screens/Clients');
// const sPreview = require('../../screens/App/screens/Main/screens/Preview');

// 设置
const sGroupSettings =
  require('../../screens/App/screens/Main/screens/Settings/screens/GroupSettings');
const sWireless = require('../../screens/App/screens/Main/screens/Settings/screens/Wireless');
const sPortal = require('../../screens/App/screens/Main/screens/Settings/screens/Portal');
const sGuest = require('../../screens/App/screens/Main/screens/Settings/screens/Guest');
const sVoip = require('../../screens/App/screens/Main/screens/Settings/screens/Voip');
const sMode = require('../../screens/App/screens/Main/screens/Settings/screens/Mode');
const sAdmin = require('../../screens/App/screens/Main/screens/Settings/screens/Admin');


const routes = [
  {
    path: '/',
    component: app.Screen,
    formUrl: '/goform/getAcInfo',
    indexPath: '/login',
    routes: [
      {
        path: '/main',
        component: Main,
        indexPath: '/main/status',
        routes: [
          {
            id: 'status',
            path: '/main/status',
            icon: 'bar-chart',
            text: __('STATISTICS'),
            component: sStatus.Screen,
          }, {
            id: 'devices',
            path: '/main/devices',
            icon: 'bullseye',
            text: __('DEVICES'),
            component: sDevices.Screen,
          }, {
            id: 'clients',
            path: '/main/clients',
            icon: 'desktop',
            text: __('CLIENTS'),
            component: sClients.Screen,
          }, {
            id: 'logs',
            path: '/main/logs',
            icon: 'file-text-o',
            text: __('LOGS'),
            component: sLogs.Screen,
          }, {
            id: 'settings',
            path: '/main/settings',
            icon: 'cog',
            text: __('SETTINGS'),
            component: SharedComponents.TabContainer,
            indexPath: '/main/settings/group',
            routes: [
              {
                path: '/main/settings/group',
                text: __('Groups'),
                component: sGroupSettings.Screen,
              }, {
                id: 'wireless',
                path: '/main/settings/wireless',
                text: __('Wireless'),
                component: sWireless.Screen,
              }, {
                id: 'portal',
                path: '/main/settings/portal',
                text: __(__('Portal')),
                component: sPortal.Screen,
              }, {
                id: 'guest',
                path: '/main/settings/guest',
                text: __('Guest'),
                component: sGuest.Screen,
              }, {
                id: 'voip',
                path: '/main/settings/voip',
                text: __('VoIP'),
                component: sVoip.Screen,
              }, {
                id: 'modeSetting',
                path: '/main/settings/mode',
                fetchUrl: 'goform/getApMode',
                saveUrl: 'goform/setApMode',
                text: __('AP Mode'),
                component: sMode.Screen,
              }, {
                id: 'password',
                path: '/main/settings/admin',
                text: __('Admin'),
                component: sAdmin.Screen,
              },
            ],
          }],
      },
      {
        path: '/wizard',
        component: sWizard.Screen,
      },
      {
        id: 'login',
        path: '/login',
        mainPath: '/main/status',
        component: sLogin.Screen,
      },
    ],
  },
];


// 配置模块页面 store
const reducers = {
  app: app.reducer,
  screens: appScreen.reducer,

  status: sStatus.status,
  devices: sDevices.devices,
  clients: sClients.clients,
  logs: sLogs.logs,
  // statistics: pStatistics.statistics,
  groupSettings: sGroupSettings.settings,
  wireless: sWireless.reducer,
  portal: sPortal.reducer,
  guest: sGuest.reducer,
  voip: sVoip.reducer,
  admin: sAdmin.reducer,

  toastr: toastrReducer,
};

export default {
  reducers,
  routes,
  appConfig: guiConfig,
};

