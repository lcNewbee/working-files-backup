import NotFound from 'shared/components/NotFound';
import settingsReducer from 'shared/reducers/settings';
import b28n from 'shared/b28n';
import appReducer from 'shared/reducers/app';
import { reducer as toastrReducer } from 'react-redux-toastr';

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

const SharedComponents = require('shared/components');
const App = require('../../screens/App');
const pMainAP = require('../../screens/App/screens/MainAP');
const sWizard = require('../../screens/App/screens/MainAP/Wizard');
// const sThinModeNotice = require('../../screens/App/screens/MainAP/ThinModeNotice');
// 登录界面
const pLogin = require('../../screens/App/screens/Login');
// 布局
const MainAP = require('../../screens/App/screens/MainAP');
// 网络设置
const sNetworkSettings = require('../../screens/App/screens/MainAP/screens/NetworkSettings/NetworkSettings');

const pSystemStatus = require('../../screens/App/screens/MainAP/screens/SystemStatus/MultiRadioOverview');
const sSsidDetails = require('../../screens/App/screens/MainAP/screens/SystemStatus/SsidDetails');
const sClientsDetails = require('../../screens/App/screens/MainAP/screens/SystemStatus/ClientsDetails');
const sRadioDetails = require('../../screens/App/screens/MainAP/screens/SystemStatus/RadioDetails');
// 快速设置
const pQuickSetup = require('../../screens/App/screens/MainAP/screens/QuickSetup/CoverageQuickSetup');

// 无线设置
// 子菜单
const sBasic = require('../../screens/App/screens/MainAP/screens/WirelessConfig/Basic/BasicForCoverage');
const sAdvance = require('../../screens/App/screens/MainAP/screens/WirelessConfig/Advance');
// const sQos = require('../../screens/App/screens/MainAP/screens/WirelessConfig/QoS');
const sACL = require('../../screens/App/screens/MainAP/screens/WirelessConfig/ACL');
// 系统维护
const sSystemMaintenance = require('../../screens/App/screens/MainAP/screens/Maintenance/SystemMaintenance');
const sTimeSettings = require('../../screens/App/screens/MainAP/screens/Maintenance/TimeSettings');
const sAccountSettings = require('../../screens/App/screens/MainAP/screens/Maintenance/AccountSettings');
const sModeSettings = require('../../screens/App/screens/MainAP/screens/ModeSettings/ModeSettings');
// 工具
const sSpeedTest = require('../../screens/App/screens/MainAP/screens/Tools/SpeedTest');
const sSiteSurvey = require('../../screens/App/screens/MainAP/screens/Tools/SiteSurvey');
const sSystemLogs = require('../../screens/App/screens/MainAP/screens/Tools/SystemLogs');
const sChannelUtilization = require('../../screens/App/screens/MainAP/screens/Tools/ChannelUtilization');


// 页面功能项配置
const funConfig = {
  // 覆盖型产品快速设置
  coverageQuickSetup: {
    router: false, // 是否有router模式
  },
  network: {
    router: false, // 是否有router模式
    hasVlan: true, // 是否有VLAN功能
  },
  // 无线设置页面
  basic: {
    radioMaxClientsLimit: false, // 射频客户端限制
    devicemodeOptions: [
      { value: 'ap', label: _('AP') },
      { value: 'sta', label: _('Station') },
      { value: 'repeater', label: _('Repeater') },
    ],
    // 功能项参见WirelessConfig -> Basic页面下的ssidTableFullMemberOptions变量
    ssidTableKeys: [
      'enable',
      'ssid',
      'vlanId',
      'hideSsid',
      'isolation',
      'security',
      'delete',
      'maxClients',
      // 'airTimeEnable',
      'speedLimit',
      // 'portalEnable',         // portal功能开关
    ],
    portalFun: false,
  },
  advance: {
    ledThreshFun: false, // 信号强度控制LED灯功能
    beaconIntervalFun: true, // Beacon帧间间隔
    dtimIntervalFun: true, // DTIM间隔
    segmentThreshFun: true, // 分片阈值
    ampduFun: true, // ampdu值
    rateSetFun: true, // 速率集
    rssiLimitFun: true, // rssi限制
    airTimeFairnessFun: true, // 时间公平性
  },
  systemmaintenance: {
    poeOutFun: false,
  },
};

const routes = [{
  path: '/',
  component: App.Screen,
  formUrl: 'goform/get_product_info',
  indexPath: '/login',
  routes: [{
    path: '/main',
    component: MainAP.Screen,
    routes: [{
      id: 'systemstatus',
      path: '/main/status',
      icon: 'pie-chart',
      text: _('Status'),
      noTree: true,
      routes: [
        {
          id: 'overview',
          fetchUrl: 'goform/get_system_info_forTestUse',
          path: '/main/status/overview',
          component: pSystemStatus.Screen,
        }, {
          id: 'ssiddetails',
          path: '/main/status/ssiddetails',
          component: sSsidDetails.Screen,
          fetchUrl: 'goform/get_system_info_forTestUse',
        }, {
          id: 'clientsdetails',
          path: '/main/status/clientsdetails',
          component: sClientsDetails.Screen,
          fetchUrl: 'goform/get_system_info_forTestUse',
        }, {
          id: 'radiodetails',
          path: '/main/status/radiodetails',
          component: sRadioDetails.Screen,
          fetchUrl: 'goform/get_system_info_forTestUse',
        },
      ],
    }, {
      id: 'quicksetup',
      path: '/main/quicksetup',
      text: _('Quick Setup'),
      icon: 'map-signs',
      fetchUrl: 'goform/get_quicksetup_info_forTestUse',
      saveUrl: 'goform/set_quicksetup',
      funConfig: funConfig.coverageQuickSetup,
      component: pQuickSetup.Screen,
    }, {
      id: 'networksettings',
      path: '/main/networksettings',
      icon: 'sphere',
      text: _('Network'),
      component: SharedComponents.TabContainer,
      routes: [
        {
          id: 'networksettings',
          formUrl: 'goform/get_network_info',
          saveUrl: 'goform/set_network',
          path: '/main/networksettings/networksettings',
          funConfig: funConfig.network,
          text: _('Wired Settings'),
          component: sNetworkSettings.Screen,
        },
      ],
    }, {
      id: 'wirelessconfig',
      path: '/main/wirelessconfig',
      icon: 'wifi',
      text: _('Wireless'),
      component: SharedComponents.TabContainer,
      routes: [
        {
          id: 'basic',
          path: '/main/wirelessconfig/basic',
          text: _('Basic'),
          formUrl: 'goform/get_wl_all',
          saveUrl: 'goform/set_wl_all',
          funConfig: funConfig.basic,
          component: sBasic.Screen,
        },
        {
          id: 'advance',
          path: '/main/wirelessconfig/advance',
          text: _('Advance'),
          fetchUrl: 'goform/get_adv_wl_info_forTestUse',
          funConfig: funConfig.advance,
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
      text: _('System'),
      noNav: false,
      component: SharedComponents.TabContainer,
      routes: [
        {
          id: 'systemmaintenance',
          fetchUrl: 'goform/save_config',
          path: '/main/maintenance/systemmaintenance',
          text: _('System Maintenance'),
          component: sSystemMaintenance.Screen,
          funConfig: funConfig.systemmaintenance,
        }, {
          id: 'accountsettings',
          path: '/main/maintenance/accountsettings',
          text: _('Account Settings'),
          noNav: true,
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
      component: SharedComponents.TabContainer,
      routes: [
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
      id: 'modesettings',
      path: '/main/modesettings',
      text: _('Mode'),
      icon: 'exchange',
      component: SharedComponents.TabContainer,
      routes: [
        {
          id: 'modesettings',
          path: '/main/modesettings/modesettings',
          text: _('Mode Settings'),
          component: sModeSettings.Screen,
        },
      ],
    },
    ],
  }, {
    path: '/wizard',
    component: sWizard.Screen,
  }, {
    path: '/login',
    mainPath: '/main/status',
    component: pLogin.Screen,
  }],
}, {
  path: '*',
  component: NotFound,
}];

const reducers = {
  app: appReducer,
  settings: settingsReducer,
  toastr: toastrReducer,
  networksettings: sNetworkSettings.networksettings,
  systemstatus: pSystemStatus.systemstatus,
  ssiddetails: sSsidDetails.ssiddetails,
  clientsdetails: sClientsDetails.clientsdetails,

  quicksetup: pQuickSetup.quicksetup,
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

const ac5000 = {
  reducers,
  routes,
  appConfig: guiConfig,
};

export default ac5000;
