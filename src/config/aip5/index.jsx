import b28n from 'shared/b28n';
import 'shared/scss/styles.scss';
import utils from 'shared/utils';
import baseConf from '../baseConf/baseConfAp';
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

// 客制化快速设置页面
const customComponents = {};
customComponents.pQuickSetup = require('../../screens/MainAP/screens/QuickSetup/P2pQuickSetup');

// 页面功能项配置
const funConfig = {
  // 覆盖型产品快速设置
  quicksetup: {
    router: false, // 是否有router模式
  },
  // 网络设置
  networksettings: {
    router: false, // 是否有router模式
    hasVlan: true, // 是否有VLAN功能
    hasMngVlanId: true, // 是否有管理VLAN ID的填写框
    hasUntagVlanId: true, // 是否有untag VLAN ID填写框
    hasPortListTable: false, // 是否有接口VLAN配置的列表显示
    hasVlanInputByTable: false, // 通过后台传递过来的列表显示VLAN输入框，目前是ASW3特有的。
  },
  // 无线设置页面
  basic: {
    devicemodeOptions: [
      { value: 'ap', label: __('AP') },              // AP模式
      { value: 'sta', label: __('Station') },        // Station模式
      { value: 'repeater', label: __('Repeater') },  // Repeater模式
    ],
    radioMaxClientsLimit: false,    // 射频最大客户端限制
    // 功能项参见WirelessConfig -> Basic页面下的ssidTableFullMemberOptions变量
    // 决定哪些功能在ssid配置表格上出现
    ssidTableKeys: [
      'enable',
      'ssid',
      'vlanId',
      'hideSsid',
      'isolation',
      'security',
      'delete',
      'maxClients',     // SSID最大客户端限制
      // 'speedLimit',
      // 'portalEnable',         // portal功能开关
    ],
  },
  // 无线高级设置页面
  advance: {
    ledThreshFun: true,        // 信号强度控制LED灯功能
    beaconIntervalFun: false,    // Beacon帧间间隔
    distanceFun: true,          // 距离调整
    dtimIntervalFun: false,      // DTIM间隔
    segmentThreshFun: false,     // 分片阈值
    ampduFun: false,             // ampdu值
    rateSetFun: false,           // 速率集
    rssiLimitFun: false,         // rssi限制
    airTimeFairnessFun: false,   // 时间公平性
  },
  // 系统维护页面
  systemmaintenance: {
    poeOutFun: true,            // POE输出功能
    voipFun: false,             // VOIP功能
  },
};

// 如果有客制化的页面替换基本设置中的页面，则相应的reducers也应该修改
const reducers = {
  quicksetup: customComponents.pQuickSetup.quicksetup,
};

const appReducers = Object.assign({}, baseConf.reducers, reducers);
const appConfig = Object.assign({}, baseConf.appConfig, guiConfig);
const appRoutes = utils.config.merge(
  utils.config.merge_funConfig_to_routes(baseConf.routes, funConfig), // 将funConfig合入到routes中
  [{  // 用客制化的快速设置替换基本配置中的快速设置页面
    id: 'quicksetup',
    component: customComponents.pQuickSetup.Screen,
  }],
);

export default {
  reducers: appReducers,
  routes: appRoutes,
  appConfig,
};

