import NotFound from 'shared/components/NotFound';
import settingsReducer from 'shared/reducers/settings';
import remoteActionMiddleware from 'shared/utils/lib/remote_action_middleware';
import { combineReducers } from 'redux';
import b28n from 'shared/b28n';
import * as appActions from 'shared/actions/app';
import appReducer from 'shared/reducers/app';
import { reducer as toastrReducer } from 'react-redux-toastr';

//
import 'shared/scss/styles.scss';
import guiConfig from './config.json';


// 多语言工具
const langCn = require('../lang/cn/core.json');
const langEn = require('../lang/en/core.json');
const apCn = require('../lang/cn/ap.json');

b28n.addDict(langCn, 'cn');
b28n.addDict(langEn, 'en');
b28n.addDict(apCn, 'cn');

window.CB = b28n.init({
  supportLang: ['en', 'cn'],
});
window.guiConfig = guiConfig;

document.getElementsByTagName('body')[0].className += ' ' + b28n.getLang();

/** ***********************************************************
  产品界面配置
 */

// 公用组件

// 主APP
const App = require('../../screens/App');

// system status
const pSystemStatus = require('../../screens/App/screens/Main/screens/SystemStatus');

// Quick Setup
const pQuickSetup = require('../../screens/App/screens/Main/screens/QuickSetup');

// System Settings
const pNetworkSettings = require('../../screens/App/screens/Main/screens/NetworkSettings');
const sNetworkSettings = require('../../screens/App/screens/Main/screens/NetworkSettings/NetworkSettings');
// const sCommonSettings = require('../../screens/App/screens/Main/screens/SystemSettings/CommonSettings');
const sTimeSettings = require('../../screens/App/screens/Main/screens/Maintenance/TimeSettings');
const sAccountSettings = require('../../screens/App/screens/Main/screens/Maintenance/AccountSettings');

// 无线设置
const pWirelessConfig = require('../../screens/App/screens/Main/screens/WirelessConfig');
// 子菜单
const sBasic = require('../../screens/App/screens/Main/screens/WirelessConfig/Basic');
const sAdvance = require('../../screens/App/screens/Main/screens/WirelessConfig/Advance');
// const sQoS = require('../../screens/App/screens/Main/screens/WirelessConfig/QoS');
const sACL = require('../../screens/App/screens/Main/screens/WirelessConfig/ACL');


// 主菜单
// const pMainMenu = require('../../screens/App/screens/Main/screens/MainMenu');
// 主菜单下的子菜单
// const sSystemstatus = require('../../screens/App/screens/Main/screens/MainMenu/screens/Systemstatus');
// const sNetworkmonitor = require('../../screens/App/screens/Main/screens/MainMenu/screens/Networkmonitor');


// 网络服务
// const pNetworkService = require('../../screens/App/screens/Main/screens/NetworkService');
// 子菜单
// const sNTPClient = require('../../screens/App/screens/Main/screens/NetworkService/NTPClient');


// 登录界面
const pLogin = require('../../screens/App/screens/Login');
// const sRegister = require('../../screens/App/screens/SignUp');
const sWizard = require('../../screens/App/screens/Wizard');

// 布局
const Main = require('../../screens/App/screens/Main').Screen;
// const Settings = require('../../screens/App/screens/Main/screens/Settings');

// 热点统计
const pStatus = require('../../screens/App/screens/Main/screens/Stats');

// 设备
// const pDevices = require('../../screens/App/screens/Main/screens/Devices');

// 设备地图
// const pDeviceMap = require('../../screens/App/screens/Main/screens/DeviceMap');
// const pPreview = require('../../screens/App/screens/Main/screens/Preview');

// 维护
const pMaintenance = require('../../screens/App/screens/Main/screens/Maintenance');
const sSystemMaintenance = require('../../screens/App/screens/Main/screens/Maintenance/SystemMaintenance');
// 工具
const pTools = require('../../screens/App/screens/Main/screens/Tools');
const sSpeedTest = require('../../screens/App/screens/Main/screens/Tools/SpeedTest');
// const sAntenna = require('../../screens/App/screens/Main/screens/Tools/Antenna');
const sSiteSurvey = require('../../screens/App/screens/Main/screens/Tools/SiteSurvey');
const sSystemLogs = require('../../screens/App/screens/Main/screens/Tools/SystemLogs');
const sChannelUtilization = require('../../screens/App/screens/Main/screens/Tools/ChannelUtilization');
// 设置
// const pGroupSettings = require('../../screens/App/screens/Main/screens/Settings/screens/GroupSettings');
// const sWireless = require('../../screens/App/screens/Main/screens/Settings/screens/Wireless');
// const sPortal = require('../../screens/App/screens/Main/screens/Settings/screens/Portal');
// const sGuest = require('../../screens/App/screens/Main/screens/Settings/screens/Guest');
// const sVoip = require('../../screens/App/screens/Main/screens/Settings/screens/Voip');
// const sAdmin = require('../../screens/App/screens/Main/screens/Settings/screens/Admin');

const routes = [{
  path: '/',
  component: App.Screen,
  formUrl: '/goform/get_system_info',
  indexRoute: { component: pLogin.Screen },
  childRoutes: [{
    path: '/main',
    component: Main,
    childRoutes: [{
      id: 'systemstatus',
      fetchUrl: 'goform/get_system_info',
      path: '/main/status',
      icon: 'pie-chart',
      text: _('Device Status'),
      component: pSystemStatus.Screen,
    }, {
      id: 'quicksetup',
      path: '/main/quicksetup',
      icon: 'map-signs',
      fetchUrl: 'goform/get_quicksetup_info',
      saveUrl: 'goform/set_quicksetup',
      text: _('Quick Setup'),
      component: pQuickSetup.Screen,
    }, {
      id: 'networksettings',
      path: '/main/networksettings',
      icon: 'sphere',
      text: _('Network'),
      component: pNetworkSettings,
      indexRoute: {
        onEnter: (nextState, replace) => replace('main/networksettings/networksettings'),
      },
      childRoutes: [
        {
          id: 'networksettings',
          formUrl: 'goform/get_network_info',
          saveUrl: 'goform/set_network',
          path: '/main/networksettings/networksettings',
          text: _('LAN Settings'),
          component: sNetworkSettings.Screen,
        },
      ],
    }, {
      id: 'wirelessconfig',
      path: '/main/wirelessconfig',
      icon: 'wifi',
      text: _('Wireless'),
      component: pWirelessConfig,
      indexRoute: {
        onEnter: (nextState, replace) => replace('/main/wirelessconfig/basic'),
      },
      childRoutes: [
        {
          id: 'basic',
          path: '/main/wirelessconfig/basic',
          text: _('Basic'),
          formUrl: 'goform/get_wl_info',
          saveUrl: 'goform/set_wireless',
          component: sBasic.Screen,
        }, {
          id: 'advance',
          path: '/main/wirelessconfig/advance',
          fetchUrl: 'goform/get_adv_wl_info',
          saveUrl: 'goform/set_adv_wireless',
          text: _('Advance'),
          component: sAdvance.Screen,
        }, {
          id: 'acl',
          fetchUrl: 'goform/get_acl_info',
          path: '/main/wirelessconfig/acl',
          text: 'ACL',
          component: sACL.Screen,
        }],
    }, {
      id: 'pMaintenance',
      path: '/main/maintenance',
      icon: 'wrench',
      text: _('Maintenance'),
      component: pMaintenance,
      indexRoute: {
        onEnter: (nextState, replace) => replace('/main/maintenance/systemmaintenance'),
      },
      childRoutes: [
        {
          id: 'systemmaintenance',
          fetchUrl: 'goform/save_config',
          path: '/main/maintenance/systemmaintenance',
          text: _('System Maintenance'),
          component: sSystemMaintenance.Screen,
        }, {
          id: 'accountsettings',
          path: '/main/maintenance/accountsettings',
          text: _('Account Settings'),
          component: sAccountSettings.Screen,
        }, {
          id: 'timesettings',
          path: '/main/maintenance/timesettings',
          text: _('Time Settings'),
          component: sTimeSettings.Screen,
        },
      ],
    }, {
      id: 'tools',
      path: '/main/tools',
      icon: 'cogs',
      text: _('Tools'),
      component: pTools,
      indexRoute: { onEnter: (nextState, replace) => replace('/main/tools/speedtest') },
      childRoutes: [
        {
          id: 'speedtest',
          path: '/main/tools/speedtest',
          text: _('Speed Test'),
          saveUrl: '/goform/bandwidth_test',
          component: sSpeedTest.Screen,
        }, {
          id: 'sitesurvey',
          path: '/main/tools/sitesurvey',
          fetchUrl: 'goform/get_site_survey',
          text: _('Site Survey'),
          component: sSiteSurvey.Screen,
        }, {
          id: 'systemlogs',
          formUrl: 'goform/get_log_list',
          path: '/main/tools/systemlogs',
          text: _('System Logs'),
          component: sSystemLogs.Screen,
        }, {
          id: 'channelutilization',
          path: '/main/tools/channelutilization',
          text: _('Channel Utilization'),
          fetchUrl: 'goform/get_chanutil',
          component: sChannelUtilization.Screen,
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
  app: appReducer,
  settings: settingsReducer,
  toastr: toastrReducer,

  status: pStatus.status,
  // groupSettings: pGroupSettings.settings,
  // wireless: sWireless.reducer,
  // portal: sPortal.reducer,
  // guest: sGuest.reducer,
  // voip: sVoip.reducer,
  // admin: sAdmin.reducer,
  // networkmonitor: sNetworkmonitor.networkmonitor,
  wirelessconfig: pWirelessConfig.wirelessconfig,
  // advance: pAdvance.advance,
  // networkservice: pNetworkService.networkservice,
  // ntpclient: sNTPClient.ntpclient,
  // systemlog: sSystemLog.systemlog,
  // 系统状态
  systemstatus: pSystemStatus.systemstatus,
  // 快速设置
  quicksetup: pQuickSetup.quicksetup,
  // 系统设置
  networksettings: pNetworkSettings.networksettings,
  accountsettings: sAccountSettings.accountsettings,
  timesettings: sTimeSettings.timesettings,

  // 无线配置
  basic: sBasic.basic,
  advance: sAdvance.advance,
  // qos: sQoS.qos,
  acl: sACL.acl,
  // tools -> speedtest
  speedtest: sSpeedTest.speedtest,
  sitesurvey: sSiteSurvey.sitesurvey,
  systemlogs: sSystemLogs.systemlogs,
  channelutilization: sChannelUtilization.channelutilization,

  systemmaintenance: sSystemMaintenance.systemmaintenance,
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

// 初始化app Config
stores.dispatch(appActions.initAppConfig(guiConfig));

export default ac5000;

/* {
      id: 'networkservice',
      path: '/main/networkservice',
      icon: 'cog',
      text: _('NETWORK SERVICE'),
      component: pNetworkService,
      indexRoute: {
        onEnter: (nextState, replace) => replace('/main/networkservice/ntpclient'),
      },
      childRoutes: [
        {
          id: 'ntpclient',
          path: '/main/networkservice/ntpclient',
          text: _('NTP Client'),
          component: sNTPClient.Screen,
        }, {
          id: 'systemlog',
          path: '/main/settings/systemlog',
          text: _('System Log'),
          component: sSystemLog.Screen,
        }],
}
*/
