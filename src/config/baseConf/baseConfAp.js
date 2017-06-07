import NotFound from 'shared/components/NotFound';
import b28n from 'shared/b28n';
import { reducer as toastrReducer } from 'react-redux-toastr';

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
// window.guiConfig = guiConfig;
const baseComponents = {};
// 公用，一般不会改变，没有必要写入baseComponents
const app = require('shared/containers/app');
const settings = require('shared/containers/settings');
const SharedComponents = require('shared/components');

baseComponents.pMainAP = require('../../screens/MainAP');
baseComponents.sWizard = require('../../screens/MainAP/Wizard');
// baseComponents.sThinModeNotice = require('../../screens/MainAP/ThinModeNotice');
// 登录界面
baseComponents.pLogin = require('../../screens/Login');
// 布局
baseComponents.MainAP = require('../../screens/MainAP');
// 网络设置
baseComponents.sNetworkSettings = require('../../screens/MainAP/screens/NetworkSettings/NetworkSettings');
// 系统状态
baseComponents.pSystemStatus = require('../../screens/MainAP/screens/SystemStatus/MultiRadioOverview');
baseComponents.sSsidDetails = require('../../screens/MainAP/screens/SystemStatus/SsidDetails');
baseComponents.sClientsDetails = require('../../screens/MainAP/screens/SystemStatus/ClientsDetails');
baseComponents.sRadioDetails = require('../../screens/MainAP/screens/SystemStatus/RadioDetails');
// 快速设置
baseComponents.pQuickSetup = require('../../screens/MainAP/screens/QuickSetup/CoverageQuickSetup');
// 无线设置
baseComponents.sBasic = require('../../screens/MainAP/screens/WirelessConfig/Basic/BasicForCoverage');
baseComponents.sAdvance = require('../../screens/MainAP/screens/WirelessConfig/Advance');
baseComponents.sACL = require('../../screens/MainAP/screens/WirelessConfig/ACL');
// baseComponents.sQos = require('../../screens/MainAP/screens/WirelessConfig/QoS');
// 系统维护
baseComponents.sSystemMaintenance = require('../../screens/MainAP/screens/Maintenance/SystemMaintenance');
baseComponents.sTimeSettings = require('../../screens/MainAP/screens/Maintenance/TimeSettings');
baseComponents.sAccountSettings = require('../../screens/MainAP/screens/Maintenance/AccountSettings');
baseComponents.sModeSettings = require('../../screens/MainAP/screens/ModeSettings/ModeSettings');
// 工具
// baseComponents.sSpeedTest = require('../../screens/MainAP/screens/Tools/SpeedTest');
baseComponents.sSiteSurvey = require('../../screens/MainAP/screens/Tools/SiteSurvey');
baseComponents.sSystemLogs = require('../../screens/MainAP/screens/Tools/SystemLogs');
baseComponents.sChannelUtilization = require('../../screens/MainAP/screens/Tools/ChannelUtilization');

// 页面功能项配置
const funConfig = {
  // 覆盖型产品快速设置
  quicksetup: {
    router: true,              // 是否有router模式
  },
  networksettings: {
    router: true,              // 是否有router模式
    hasVlan: true,              // 是否有VLAN功能
    hasMngVlanId: true,         // 是否有管理VLAN ID的填写框
    hasUntagVlanId: true,       // 是否有untag VLAN ID填写框
    hasPortListTable: true,    // 是否有接口VLAN配置的列表显示
    hasVlanInputByTable: true, // 通过后台传递过来的列表显示VLAN输入框，目前是ASW3特有的。
  },
  // 无线设置页面
  basic: {
    radioMaxClientsLimit: true,  // 射频客户端限制
    devicemodeOptions: [
      { value: 'ap', label: __('AP') },
      { value: 'sta', label: __('Station') },
      { value: 'repeater', label: __('Repeater') },
    ],
    // 功能项参见WirelessConfig -> Basic页面下的ssidTableFullMemberOptions变量
    ssidTableKeys: [    // 多SSID配置表格项
      'enable',         // 该SSID是否启用
      'ssid',           // SSID名称
      'maxClients',     // SSID最大客户端限制
      'airTimeEnable',  // 时间公平性
      'speedLimit',     // SSID限速
      'vlanId',         // VLAN ID
      'hideSsid',       // 该SSID是否隐藏
      'isolation',      // 是否启用客户端隔离
      'security',       // 加密配置
      'delete',         // 删除按钮
      'portalEnable',         // portal功能开关
    ],
    portalFun: true,        //是否有portal功能
  },
  advance: {
    ledThreshFun: true, // 信号强度控制LED灯功能
    beaconIntervalFun: true, // Beacon帧间间隔
    dtimIntervalFun: true, // DTIM间隔
    distanceFun: true,          // 距离调整
    segmentThreshFun: true, // 分片阈值
    ampduFun: true, // ampdu值
    rateSetFun: true, // 速率集
    rssiLimitFun: true, // rssi限制
    airTimeFairnessFun: true, // 时间公平性
  },
  systemmaintenance: {
    poeOutFun: true, // POE输出功能
    voipFun: true, // VOIP功能
  },
};

const routes = [{
  path: '/',
  component: app.Screen,
  // formUrl: 'goform/get_product_info',
  indexPath: '/login',
  routes: [{
    path: '/main',
    component: baseComponents.MainAP.Screen,
    routes: [{
      id: 'systemstatus',
      path: '/main/status',
      icon: 'pie-chart',
      text: __('Status'),
      noTree: true,
      routes: [
        {
          id: 'overview',
          fetchUrl: 'goform/get_system_info_forTestUse',
          path: '/main/status/overview',
          component: baseComponents.pSystemStatus.Screen,
        }, {
          id: 'ssiddetails',
          path: '/main/status/ssiddetails',
          component: baseComponents.sSsidDetails.Screen,
          fetchUrl: 'goform/get_system_info_forTestUse',
        }, {
          id: 'clientsdetails',
          path: '/main/status/clientsdetails',
          component: baseComponents.sClientsDetails.Screen,
          fetchUrl: 'goform/get_system_info_forTestUse',
        }, {
          id: 'radiodetails',
          path: '/main/status/radiodetails',
          component: baseComponents.sRadioDetails.Screen,
          fetchUrl: 'goform/get_system_info_forTestUse',
        },
      ],
    }, {
      id: 'quicksetup',
      path: '/main/quicksetup',
      text: __('Quick Setup'),
      icon: 'map-signs',
      fetchUrl: 'goform/get_quicksetup_info_forTestUse',
      saveUrl: 'goform/set_quicksetup',
      funConfig: funConfig.quicksetup,
      component: baseComponents.pQuickSetup.Screen,
    }, {
      id: 'network',
      path: '/main/network',
      icon: 'sphere',
      text: __('Network'),
      component: SharedComponents.TabContainer,
      routes: [
        {
          id: 'networksettings',
          formUrl: 'goform/get_network_info',
          saveUrl: 'goform/set_network',
          path: '/main/network/networksettings',
          funConfig: funConfig.networksettings,
          text: __('Wired Settings'),
          component: baseComponents.sNetworkSettings.Screen,
        },
      ],
    }, {
      id: 'wirelessconfig',
      path: '/main/wirelessconfig',
      icon: 'wifi',
      text: __('Wireless'),
      component: SharedComponents.TabContainer,
      routes: [
        {
          id: 'basic',
          path: '/main/wirelessconfig/basic',
          text: __('Basic'),
          formUrl: 'goform/get_wl_all',
          saveUrl: 'goform/set_wl_all',
          funConfig: funConfig.basic,
          component: baseComponents.sBasic.Screen,
        },
        {
          id: 'advance',
          path: '/main/wirelessconfig/advance',
          text: __('Advance'),
          fetchUrl: 'goform/get_adv_wl_info_forTestUse',
          funConfig: funConfig.advance,
          component: baseComponents.sAdvance.Screen,
        },
        {
          id: 'acl',
          fetchUrl: 'goform/get_acl_info_forTestUse',
          path: '/main/wirelessconfig/acl',
          text: 'ACL',
          component: baseComponents.sACL.Screen,
        },
      ],
    }, {
      id: 'pMaintenance',
      path: '/main/maintenance',
      icon: 'wrench',
      text: __('System'),
      noNav: false,
      component: SharedComponents.TabContainer,
      routes: [
        {
          id: 'systemmaintenance',
          fetchUrl: 'goform/save_config',
          path: '/main/maintenance/systemmaintenance',
          text: __('System Maintenance'),
          component: baseComponents.sSystemMaintenance.Screen,
          funConfig: funConfig.systemmaintenance,
        }, {
          id: 'accountsettings',
          path: '/main/maintenance/accountsettings',
          text: __('Account Settings'),
          noNav: true,
          component: baseComponents.sAccountSettings.Screen,
        }, {
          id: 'timesettings',
          path: '/main/maintenance/timesettings',
          text: __('Time Settings'),
          component: baseComponents.sTimeSettings.Screen,
        },
      ],
    }, {
      id: 'tools',
      path: '/main/tools',
      icon: 'cogs',
      text: __('Tools'),
      component: SharedComponents.TabContainer,
      routes: [
        // {
        //   id: 'speedtest',
        //   path: '/main/tools/speedtest',
        //   text: __('Speed Test'),
        //   saveUrl: '/goform/bandwidth_test',
        //   component: baseComponents.sSpeedTest.Screen,
        // },
        {
          id: 'sitesurvey',
          path: '/main/tools/sitesurvey',
          fetchUrl: 'goform/get_site_survey',
          text: __('Site Survey'),
          component: baseComponents.sSiteSurvey.Screen,
        }, {
          id: 'systemlogs',
          formUrl: 'goform/get_log_list',
          path: '/main/tools/systemlogs',
          text: __('System Logs'),
          component: baseComponents.sSystemLogs.Screen,
        }, {
          id: 'channelutilization',
          path: '/main/tools/channelutilization',
          text: __('Channel Utilization'),
          fetchUrl: 'goform/get_chanutil',
          component: baseComponents.sChannelUtilization.Screen,
        },
      ],
    }, {
      id: 'modesettings',
      path: '/main/modesettings',
      text: __('Mode'),
      icon: 'exchange',
      component: SharedComponents.TabContainer,
      routes: [
        {
          id: 'modesettings',
          path: '/main/modesettings/modesettings',
          text: __('Mode Settings'),
          component: baseComponents.sModeSettings.Screen,
        },
      ],
    },
    ],
  }, {
    path: '/wizard',
    component: baseComponents.sWizard.Screen,
  }, {
    path: '/login',
    mainPath: '/main/status',
    component: baseComponents.pLogin.Screen,
  }],
}, {
  path: '*',
  component: NotFound,
}];

const reducers = {
  app: app.reducer,
  settings: settings.reducer,
  toastr: toastrReducer,

  networksettings: baseComponents.sNetworkSettings.networksettings,
  systemstatus: baseComponents.pSystemStatus.systemstatus,
  ssiddetails: baseComponents.sSsidDetails.ssiddetails,
  clientsdetails: baseComponents.sClientsDetails.clientsdetails,

  quicksetup: baseComponents.pQuickSetup.quicksetup,
  basic: baseComponents.sBasic.basic,
  advance: baseComponents.sAdvance.advance,
  acl: baseComponents.sACL.acl,
  // qos: sQos.qos,
  // 系统维护
  systemmaintenance: baseComponents.sSystemMaintenance.systemmaintenance,
  accountsettings: baseComponents.sAccountSettings.accountsettings,
  timesettings: baseComponents.sTimeSettings.timesettings,
  // tools -> speedtest
  // speedtest: baseComponents.sSpeedTest.speedtest,
  sitesurvey: baseComponents.sSiteSurvey.sitesurvey,
  systemlogs: baseComponents.sSystemLogs.systemlogs,
  channelutilization: baseComponents.sChannelUtilization.channelutilization,

  wizard: baseComponents.sWizard.wizard,
  product: baseComponents.pMainAP.product,
};

export default {
  reducers,
  routes,
  baseComponents,
  appConfig: guiConfig,
};

