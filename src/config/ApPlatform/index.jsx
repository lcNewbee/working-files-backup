import NotFound from 'shared/components/NotFound';
import settingsReducer from 'shared/reducers/settings';
import remoteActionMiddleware from 'shared/utils/lib/remote_action_middleware';
import { combineReducers } from 'redux';
import b28n from 'shared/b28n';
import * as appActions from 'shared/actions/app';
import appReducer from 'shared/reducers/app';

//
import 'shared/scss/styles.scss';
import guiConfig from './config.json';
// 多语言工具
const langCn = require('../lang/cn/core.json');
const apCn = require('../lang/cn/ap.json');

b28n.addDict(langCn, 'cn');
b28n.addDict(apCn, 'cn');

window.CB = b28n.init({
  supportLang: ['en', 'cn'],
});
window.guiConfig = guiConfig;


const App = require('../../screens/App');
const pMainAP = require('../../screens/App/screens/MainAP');
const sWizard = require('../../screens/App/screens/MainAP/Wizard');
const sThinModeNotice = require('../../screens/App/screens/MainAP/ThinModeNotice');
// 登录界面
const pLogin = require('../../screens/App/screens/Login');
// 布局
const MainAP = require('../../screens/App/screens/MainAP');
// 网络设置
const pNetworkSettings = require('../../screens/App/screens/MainAP/screens/NetworkSettings');
// 子菜单
const sNetworkSettings = require('../../screens/App/screens/MainAP/screens/NetworkSettings/NetworkSettings');

const pSystemStatus = require('../../screens/App/screens/MainAP/screens/SystemStatus');
// 无线设置
const pWirelessConfig = require('../../screens/App/screens/MainAP/screens/WirelessConfig');
// 子菜单
const sBasic = require('../../screens/App/screens/MainAP/screens/WirelessConfig/Basic');
const sAdvance = require('../../screens/App/screens/MainAP/screens/WirelessConfig/Advance');
// const sQos = require('../../screens/App/screens/MainAP/screens/WirelessConfig/QoS');
const sACL = require('../../screens/App/screens/MainAP/screens/WirelessConfig/ACL');
// 系统维护
const pMaintenance = require('../../screens/App/screens/MainAP/screens/Maintenance');
const sSystemMaintenance = require('../../screens/App/screens/MainAP/screens/Maintenance/SystemMaintenance');
const sTimeSettings = require('../../screens/App/screens/MainAP/screens/Maintenance/TimeSettings');
const sAccountSettings = require('../../screens/App/screens/MainAP/screens/Maintenance/AccountSettings');
const sModeModify = require('../../screens/App/screens/MainAP/screens/ModeModify');
// 工具
const pTools = require('../../screens/App/screens/MainAP/screens/Tools');
const sSpeedTest = require('../../screens/App/screens/MainAP/screens/Tools/SpeedTest');
const sSiteSurvey = require('../../screens/App/screens/MainAP/screens/Tools/SiteSurvey');
const sSystemLogs = require('../../screens/App/screens/MainAP/screens/Tools/SystemLogs');
const sChannelUtilization = require('../../screens/App/screens/MainAP/screens/Tools/ChannelUtilization');

const routes = [{
  path: '/',
  component: App.Screen,
  formUrl: '/goform/get_system_info_forTestUse',
  indexRoute: { component: pLogin.Screen },
  childRoutes: [{
    path: '/main',
    component: MainAP.Screen,
    childRoutes: [{
      id: 'systemstatus',
      fetchUrl: 'goform/get_system_info_forTestUse',
      path: '/main/status',
      icon: 'pie-chart',
      text: _('Device Status'),
      component: pSystemStatus.Screen,
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
          formUrl: 'goform/get_wl_info_forTestUse',
          saveUrl: 'goform/set_wireless_forTestUse',
          component: sBasic.Screen,
        },
        {
          id: 'advance',
          path: '/main/wirelessconfig/advance',
          text: _('Advance'),
          fetchUrl: 'goform/get_adv_wl_info_forTestUse',
          component: sAdvance.Screen,
        },
        {
          id: 'acl',
          fetchUrl: 'goform/get_acl_info_forTestUse',
          path: '/main/wirelessconfig/acl',
          text: 'ACL',
          component: sACL.Screen,
        },
      ],
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
    }, {
      id: 'modemodify',
      path: '/main/maintenance/modemodify',
      text: _('Mode Setting'),
      component: sModeModify.Screen,
    },
    ],
  }, {
    path: '/wizard',
    component: sWizard.Screen,
  }, {
    path: '/thinModeNotice',
    component: sThinModeNotice.Screen,
  }],
}, {
  path: '*',
  component: NotFound,
}];

const reducers = {
  app: appReducer,
  settings: settingsReducer,

  login: pLogin.login,

  networksettings: sNetworkSettings.networksettings,

  systemstatus: pSystemStatus.systemstatus,
  basic: sBasic.basic,
  advance: sAdvance.advance,
  acl: sACL.acl,
  // qos: sQos.qos,

  // 系统维护
  systemmaintenance: sSystemMaintenance.systemmaintenance,
  accountsettings: sAccountSettings.accountsettings,
  timesettings: sTimeSettings.timesettings,
  // tools -> speedtest
  speedtest: sSpeedTest.speedtest,
  sitesurvey: sSiteSurvey.sitesurvey,
  systemlogs: sSystemLogs.systemlogs,
  channelutilization: sChannelUtilization.channelutilization,

  wizard: sWizard.wizard,
  product: pMainAP.product,
};

const stores = remoteActionMiddleware(
  combineReducers(reducers),
  window.devToolsExtension ? window.devToolsExtension() : f => f
);

const ac5000 = {
  reducers,
  routes,
  stores,
};

stores.dispatch(appActions.initAppConfig(guiConfig));

export default ac5000;
