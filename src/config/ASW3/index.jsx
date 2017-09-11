import 'shared/scss/styles.scss';
import utils from 'shared/utils';
import baseConf from '../baseConf/baseConfAp';
import guiConfig from './config.json';

window.guiConfig = guiConfig;

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
    hasMngVlanId: false, // 是否有管理VLAN ID的填写框
    hasUntagVlanId: false, // 是否有untag VLAN ID填写框
    hasPortListTable: false, // 是否有接口VLAN配置的列表显示
    hasVlanInputByTable: true, // 通过后台传递过来的列表显示VLAN输入框，目前是ASW3特有的。
  },
  // 无线设置页面
  basic: {
    devicemodeOptions: [
      { value: 'ap', label: __('AP') },
      { value: 'sta', label: __('Station') },
      { value: 'repeater', label: __('Repeater') },
    ],
    radioMaxClientsLimit: false, // 射频最大客户端限制
    // 功能项参见WirelessConfig -> Basic页面下的ssidTableFullMemberOptions变量
    ssidTableKeys: [
      'enable',
      'ssid',
      'vlanId',
      'hideSsid',
      'isolation',
      'security',
      'maxClients',
      // 'speedLimit',
      'delete',
      // 'portalEnable',         // portal功能开关
    ],
    portalFun: false,
  },
  advance: {
    ledThreshFun: false, // 信号强度控制LED灯功能
    beaconIntervalFun: true, // Beacon帧间间隔
    distanceFun: false, // 距离值设置拖动条
    dtimIntervalFun: true, // DTIM间隔
    segmentThreshFun: true, // 分片阈值
    ampduFun: true, // ampdu值
    rateSetFun: true, // 速率集
    rssiLimitFun: true, // rssi限制
    airTimeFairnessFun: true, // 时间公平性
  },
  systemmaintenance: {
    poeOutFun: false,
    voipFun: true,
  },
};

const reducers = baseConf.reducers;
// 将funConfig合入到routes中
const routes = utils.config.merge_funConfig_to_routes(baseConf.routes, funConfig);
const appConfig = Object.assign({}, baseConf.appConfig, guiConfig);

export default {
  reducers,
  routes,
  appConfig,
};


/*
{
  id: 'portalsettings',
  path: '/main/portalsettings',
  icon: 'sphere',
  text: __('Portal'),
  component: pPortal,
  indexRoute: {
    onEnter: (nextState, replace) => replace('main/portalsettings/portalsettings'),
  },
  routes: [
    {
      id: 'portalsettings',
      noTree: true,
      path: '/main/portalsettings/portalsettings',
      fetchUrl: 'goform/get_portal_info',
      saveUrl: 'goform/set_portal',
      text: __('Portal Settings'),
      component: sPortalSettings.Screen,
    },
  ],
},
*/
