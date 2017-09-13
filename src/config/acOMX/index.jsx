import b28n from 'shared/b28n';
import { reducer as toastrReducer } from 'react-redux-toastr';

//
import 'shared/scss/styles.scss';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';
import guiConfig from './config.json';

// 多语言工具
const langCnCore = require('../../lang/cn/core.json');
const langCnAc = require('../../lang/cn/ac.json');
const langEn = require('../../lang/en/core.json');

const bodyElem = document.getElementsByTagName('body')[0];

b28n.addDict(langCnCore, 'cn');
b28n.addDict(langCnAc, 'cn');
b28n.addDict(langEn, 'en');

window.CB = b28n.init({
  supportLang: ['en', 'cn'],
});
window.guiConfig = guiConfig;

bodyElem.className = `${bodyElem.className} app-omx ${b28n.getLang()}`;

/** ***********************************************************
 * 产品界面配置
 */

// 公用组件
const app = require('shared/containers/app');
const appScreen = require('shared/containers/appScreen');
const SharedComponents = require('shared/components');

// 登录界面
const sLogin = require('../../screens/Login');
// const sRegister = require('../../screens/SignUp');
const sWizard = require('../../screens/Wizard');

// 布局
const Main = require('../../screens/MainAc').Screen;

// 热点统计
const sOverview = require('../../screens/MainAc/screens/Overview');

// 设备
const sDevices = require('../../screens/MainAc/screens/Devices');

// 设备地图
// const sDeviceMap = require('../../screens/MainAc/screens/DeviceMap');
// const sStatistics = require('../../screens/MainAc/screens/Statistics');
const sLogs = require('../../screens/MainAc/screens/Logs');
const sClients = require('../../screens/MainAc/screens/Clients');
// const sPreview = require('../../screens/MainAc/screens/Preview');

// 设置
const sGroupSettings =
  require('../../screens/MainAc/screens/Settings/screens/GroupSettings');
const sWireless = require('../../screens/MainAc/screens/Settings/screens/Wireless');
const sPortal = require('../../screens/MainAc/screens/Settings/screens/Portal');
const sGuest = require('../../screens/MainAc/screens/Settings/screens/Guest');
const sVoip = require('../../screens/MainAc/screens/Settings/screens/Voip');
const sMode = require('../../screens/MainAc/screens/Settings/screens/Mode');
const sSystem = require('../../screens/MainAc/screens/Settings/screens/System');
const sAdmin = require('../../screens/MainAc/screens/Settings/screens/Admin');
const sAPMaintenance = require('../../screens/MainAc/screens/Settings/screens/AP');

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
        routes: [
          {
            id: 'status',
            path: '/main/overview',
            icon: 'tachometer',
            text: __('OVERVIEW'),
            component: sOverview.Screen,
          },
          {
            id: 'devices',
            path: '/main/devices',
            icon: 'bullseye',
            text: __('DEVICES'),
            component: sDevices.Screen,
          },
          {
            id: 'clients',
            path: '/main/clients',
            icon: 'desktop',
            text: __('CLIENTS'),
            component: sClients.Screen,
          },
          {
            id: 'logs',
            path: '/main/logs',
            icon: 'file-text-o',
            text: __('LOGS'),
            component: sLogs.Screen,
          },
          {
            id: 'settings',
            path: '/main/settings',
            icon: 'cogs',
            text: __('SETTINGS'),
            component: SharedComponents.TabContainer,
            routes: [
              {
                path: '/main/settings/group',
                text: __('Groups'),
                component: sGroupSettings.Screen,
              },
              {
                id: 'modeSetting',
                path: '/main/settings/mode',
                fetchUrl: 'goform/getApMode',
                saveUrl: 'goform/setApMode',
                text: __('AP Mode'),
                component: sMode.Screen,
              },
              {
                id: 'wireless',
                path: '/main/settings/wireless',
                text: __('Wireless'),
                component: sWireless.Screen,
              },
              // {
              //   id: 'portal',
              //   path: '/main/settings/portal',
              //   text: __(__('Portal')),
              //   component: sPortal.Screen,
              // },
              {
                id: 'guest',
                path: '/main/settings/guest',
                text: __('Guest'),
                component: sGuest.Screen,
              },
              {
                id: 'voip',
                path: '/main/settings/voip',
                text: __('VoIP'),
                component: sVoip.Screen,
              },
            ],
          }, {
            id: 'system',
            path: '/main/system',
            icon: 'cog',
            text: __('SYSTEM'),
            component: SharedComponents.TabContainer,
            routes: [
              {
                id: 'apMaintenance',
                path: '/main/system/apMaintenance',
                fetchUrl: '/goform/getApFirmware',
                saveUrl: '/goform/modifyApFirmware',
                text: __('AP Maintenance'),
                component: sAPMaintenance.Screen,
              },
              {
                id: 'systemSetting',
                path: '/main/system/setting',
                text: __('Settings'),
                component: sSystem.Screen,
              },
              {
                id: 'password',
                path: '/main/system/admin',
                text: __('Admin'),
                component: sAdmin.Screen,
              },
            ],
          },
        ],
      },
      {
        path: '/wizard',
        component: sWizard.Screen,
      },
      {
        id: 'login',
        path: '/login',
        mainPath: '/main/overview',
        component: sLogin.Screen,
      },
    ],
  },
];


// 配置模块页面 store
const reducers = {
  app: app.reducer,
  screens: appScreen.reducer,

  status: sOverview.status,
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

