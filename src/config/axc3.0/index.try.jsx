import b28n from 'shared/b28n';
import NotFound from 'shared/components/NotFound';
import stringUtils from 'shared/utils/lib/string';
import moment from 'moment';
import { reducer as toastrReducer } from 'react-redux-toastr';

// 公用 样式
import 'shared/scss/styles.scss';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';

// 公用组件

// 产品配置
import guiConfig from './config.json';

// 多语言处理
const cnCore = require('../lang/cn/core.json');
const cnAxc = require('../lang/cn/axc.json');
const cnPortal = require('../lang/cn/portal.json');
const langEn = require('../lang/en/core.json');

const bodyElem = document.getElementsByTagName('body')[0];

b28n.addDict(cnCore, 'cn');
b28n.addDict(cnAxc, 'cn');
b28n.addDict(cnPortal, 'cn');
b28n.addDict(langEn, 'en');
window.CB = b28n.init({
  supportLang: ['en', 'cn'],
});

guiConfig.versionCode = guiConfig.version.split('.').reduce(
  (x, y, index) => {
    let ret = parseInt(x, 10);
    const nextVal = parseInt(y, 10);

    if (index === 1) {
      ret = (10000 * ret) + (nextVal * 100);
    } else if (index === 2) {
      ret += nextVal;
    }

    return ret;
  },
);
window.guiConfig = guiConfig;

if (b28n.getLang() === 'cn') {
  moment.locale('zh-cn');
} else {
  moment.locale('en');
}

bodyElem.className = stringUtils.addClassName(bodyElem.className, b28n.getLang());

/** ***********************************************************
 * 产品界面配置
 */

// 公用
const app = require('shared/containers/app');
const appScreen = require('shared/containers/appScreen');
const properties = require('shared/containers/properties');
const SharedComponents = require('shared/components');

//
const sLogin = require('../../screens/Login');
const sWizard = require('../../screens/Wizard');
//
const sMainAxc = require('../../screens/MainAxc');

/**
 * 网络设置
 */
const cNetwork = require('../../screens/MainAxc/containers/Network');
const sInterfaces = require('../../screens/MainAxc/screens/Network/screens/Interfaces');
const sDhcpList = require('../../screens/MainAxc/screens/Network/screens/DHCP/screens/DHCP/DhcpList');
const sDhcpRelay = require('../../screens/MainAxc/screens/Network/screens/DHCP/screens/Relay/DhcpRelay');
const sNetworkRoutes = require('../../screens/MainAxc/screens/Network/screens/Routes');
const sNetworkNat = require('../../screens/MainAxc/screens/Network/screens/Nat');
// const sNetworkAcl = require('../../screens/MainAxc/screens/Network/screens/ACL');
const sNetworkPort = require('../../screens/MainAxc/screens/Network/screens/Port');
const sPortalMac = require('../../screens/MainAxc/screens/Network/screens/Portal/screens/PortalMac');


/**
 * AP组管理
 */
const cGroup = require('../../screens/MainAxc/containers/Group');
const sOverview = require('../../screens/MainAxc/screens/Monitor/screens/Overview');
const sClientList = require('../../screens/MainAxc/screens/Monitor/screens/ClientList');
const sSsidStatus = require('../../screens/MainAxc/screens/Monitor/screens/SsidStatus');
const sApList = require('../../screens/MainAxc/screens/Monitor/screens/ApList');
const sSafeStatus = require('../../screens/MainAxc/screens/Monitor/screens/SafeStatus');
const sWirelessAcl = require('../../screens/MainAxc/screens/WLAN/screens/Acl');
const sSsidSettings = require('../../screens/MainAxc/screens/WLAN/screens/SsidSettings');
const sSmartRf = require('../../screens/MainAxc/screens/WLAN/screens/SmartRf');
const sTimerPolicy = require('../../screens/MainAxc/screens/WLAN/screens/TimerPolicy');
const sWips = require('../../screens/MainAxc/screens/WLAN/screens/SafePolicy/screens/Wips');
const sEndpointProtection = require('../../screens/MainAxc/screens/WLAN/screens/SafePolicy/screens/EndpointProtection');

const sLiveMap = require('../../screens/MainAxc/screens/Map/screens/LiveMap');
const sApPlanMap = require('../../screens/MainAxc/screens/Map/screens/ApPlanMap');
const sHeatMap = require('../../screens/MainAxc/screens/Map/screens/HeatMap');
const sOrbitTrace = require('../../screens/MainAxc/screens/Map/screens/OrbitTrace');
const sClientsTraceList = require('../../screens/MainAxc/screens/Map/screens/ClientsTrace');
const sClientsTraceSettings = require('../../screens/MainAxc/screens/Map/screens/ClientsTrace/Settings');


// ndpi
const sDPIOverview = require('../../screens/MainAxc/screens/Network/screens/DPI/screens/DPIOverview');
const sMacStatistic = require('../../screens/MainAxc/screens/Network/screens/DPI/screens/MacStatistic');
const sEthStatistic = require('../../screens/MainAxc/screens/Network/screens/DPI/screens/EthStatistic');
const sProtoInfo = require('../../screens/MainAxc/screens/Network/screens/DPI/screens/ProtoInfo');
const sDPISettings = require('../../screens/MainAxc/screens/Network/screens/DPI/screens/DPISettings');

// 防火墙
const sAttackDefense = require('../../screens/MainAxc/screens/Network/screens/Firewall/screens/attackDefenseSetting');
const sFirewallBlackList = require('../../screens/MainAxc/screens/Network/screens/Firewall/screens/blackList');

/**
 * 系统管理
 */
const cSystem = require('../../screens/MainAxc/containers/System');
const sSystemStatus = require('../../screens/MainAxc/screens/System/screens/SystemStatus');
const sSystemAdmin = require('../../screens/MainAxc/screens/System/screens/SystemAdmin');
const sAlarmEvents = require('../../screens/MainAxc/screens/System/screens/AlarmEvents');
const sLicense = require('../../screens/MainAxc/screens/System/screens/License');
const sSystemLogList = require('../../screens/MainAxc/screens/System/screens/SystemLog/screens/LogList');
const sSystemLogMaintenance = require('../../screens/MainAxc/screens/System/screens/SystemLog/screens/logMaintenance');
// const sSNMP =
//     require('../../screens/MainAxc/screens/System/screens/SNMP');
// const sActiveStandby =
//     require('../../screens/MainAxc/screens/System/screens/ActiveStandby');
// const sSignatures =
//     require('../../screens/MainAxc/screens/System/screens/Signatures');
const sApVersion = require('../../screens/MainAxc/screens/System/screens/ApVersion');
const sApMaintenance = require('../../screens/MainAxc/screens/System/screens/ApMaintenance');
const sApModel = require('../../screens/MainAxc/screens/System/screens/ApModel');
const sAcMaintenance = require('../../screens/MainAxc/screens/System/screens/AcMaintenance');
const sNetworkTimeProtocol = require('../../screens/MainAxc/screens/System/screens/NetworkTimeProtocol');


/**
 * AAA 接入，认证，计费
 */
const cAAA = require('../../screens/MainAxc/containers/AAA');
const sNetworkAaa = require('../../screens/MainAxc/screens/Network/screens/AAA/index_new');
const sPortalOverview = require('../../screens/MainAxc/screens/Portal/screens/Overview');
const sPortalWeb = require('../../screens/MainAxc/screens/Portal/screens/Access/Web');
const sPortalWeixin = require('../../screens/MainAxc/screens/Portal/screens/Access/Weixin');
const sPortalFacebook = require('../../screens/MainAxc/screens/Portal/screens/Access/Facebook');
const sPortalSMSGateWay = require('../../screens/MainAxc/screens/Portal/screens/Access/SMSGateway');
const sPortalSMSLog = require('../../screens/MainAxc/screens/Portal/screens/Access/SMSLog');


const sPortalAccountList = require('../../screens/MainAxc/screens/Portal/screens/Account/AccountList');
const sPortalConnectRecord = require('../../screens/MainAxc/screens/Portal/screens/Account/ConnectRecord');
const sPortalSendMessage = require('../../screens/MainAxc/screens/Portal/screens/Message/SendMessage');
const sPortalSendBox = require('../../screens/MainAxc/screens/Portal/screens/Message/SendBox');
const sPortalReceiveBox = require('../../screens/MainAxc/screens/Portal/screens/Message/ReceiveBox');

const sPortalCardCategory = require('../../screens/MainAxc/screens/Portal/screens/Card/CardCategory');
const sPortalCardList = require('../../screens/MainAxc/screens/Portal/screens/Card/CardList');
const sPortalLogList = require('../../screens/MainAxc/screens/Portal/screens/Log/LogList');
const sPortalOnlineRecordList = require('../../screens/MainAxc/screens/Portal/screens/Log/OnlineRecordList');
const sPortalOnlineList = require('../../screens/MainAxc/screens/Portal/screens/Log/OnlineList');

const formUrlConf = {
  app: 'goform/axcInfo',
  sInterfaces: 'goform/network/interface',
  sDhcpList: 'goform/network/dhcp/service/list',
  sDhcpRelay: 'goform/network/dhcp/relay',
  sNetworkNat: 'goform/network/nat',
  sNetworkRoutes: 'goform/network/route',
  sNetworkPort: '/goform/network/port',
  sDPIOverview: 'goform/network/dpi/overview',
  sMacStatistic: 'goform/network/dpi/macstatistic',
  sEthStatistic: 'goform/network/dpi/ethstatistic',
  sProtoInfo: 'goform/network/dpi/protoinfo',
  sDPISettings: 'goform/network/dpi/dpisettings',
  sOverview: 'goform/group/overview',
  sSsidStatus: 'goform/group/ssid',
  sSafeStatus: 'goform/group/safeStatus',
  sApList: 'goform/group/aps',
  sClientList: 'goform/group/client',
  sSsidSettings: 'goform/group/ssidSetting',
  sSmartRf: 'goform/group/smartRf',
  sLiveMap: 'goform/group/map/building',
  sApPlanMap: 'goform/group/map/apPlan',
  sHeatMap: 'goform/group/map/heatmap',
  sOrbitTrace: '/goform/group/map/orbittrace',
  sClientsTraceList: '/goform/group/map/clients_trace',
  sClientsTraceSettings: 'goform/group/map/clients_trace',
  sWirelessAcl: '/goform/group/wireless/acl',
  sEndpointProtection: 'goform/group/wireless/protection',
  sWips: 'goform/group/wips',
  sTimerPolicy: 'goform/group/timerPolicy',
  sPortalOverview: 'goform/portal/overview',
  sPortalOnlineList: 'goform/portal/log/onlineList',
  sPortalWeb: 'goform/portal/access/web',
  sPortalWeixin: 'goform/portal/access/weixin',
  sPortalFacebook: 'goform/portal/access/facebook',
  sPortalSMSGateWay: 'goform/portal/access/smsgateWay',
  sPortalAccountList: 'goform/portal/account/accountList',
  sPortalConnectRecord: 'goform/portal/account/connectRecord',
  sPortalCardCategory: 'goform/portal/card/cardcategory',
  sPortalCardList: 'goform/portal/card/cardlist',
  sPortalReceiveBox: 'goform/portal/message/receive',
  sPortalSendBox: 'goform/portal/message/send',
  sPortalSendMessage: 'goform/portal/message/sendmessage',
  sPortalLogList: 'goform/portal/log/logList',
  sPortalOnlineRecordList: 'goform/portal/log/onlineRecordList',
  sPortalSMSLog: 'goform/portal/access/portalsmslog',
  sPortalMac: 'goform/network/portal/mac',
  sNetworkAaa: 'goform/portal/Aaa',
  sSystemStatus: '/goform/system/status',
  sAlarmEvents: '/goform/system/alarmEvents',
  sSystemLogList: 'goform/system/log',
  sSystemLogMaintenance: 'goform/system/log',
  sLicense: 'goform/system/license',
  sApMaintenance: 'goform/system/maintenance',
  sApVersion: 'goform/system/ap/version',
  sApModel: 'goform/system/ap/model',
  sAcMaintenance: 'goform/system/maintenance',
  sNetworkTimeProtocol: 'goform/system/networktimeprotocol',
  sSystemAdmin: 'goform/system/admins',
};

const routes = [
  {
    id: 'root',
    path: '/',
    component: app.Screen,
    formUrl: formUrlConf.app,
    indexPath: '/login',
    routes: [
      {
        id: 'main',
        path: '/main/',
        component: sMainAxc.Screen,
        routes: [
          {
            id: 'network',
            path: '/main/network',
            icon: 'sphere',
            text: __('Network '),
            component: cNetwork.Screen,
            indexPath: '/main/network/interface',
            routes: [
              {
                id: 'networkInterface',
                icon: 'th',
                path: '/main/network/interface',
                formUrl: formUrlConf.sInterfaces,
                text: __('Interfaces'),
                component: sInterfaces.Screen,
              }, {
                id: 'networkDhcp',
                icon: 'random',
                noTree: true,
                component: SharedComponents.TabContainer,
                path: '/main/network/dhcp',
                text: __('DHCP'),
                indexPath: '/main/network/dhcp/service/list',
                routes: [
                  {
                    id: 'dhcpList',
                    path: '/main/network/dhcp/service/list',
                    formUrl: formUrlConf.sDhcpList,
                    text: __('DHCP List'),
                    component: sDhcpList.Screen,
                  }, {
                    id: 'dhcpRelay',
                    path: '/main/network/dhcp/relay',
                    formUrl: formUrlConf.sDhcpRelay,
                    text: __('DHCP Relay'),
                    component: sDhcpRelay.Screen,
                  },
                ],
              }, {
                id: 'networkNat',
                icon: 'exchange',
                text: __('NAT'),
                path: '/main/network/nat',
                formUrl: formUrlConf.sNetworkNat,
                component: sNetworkNat.Screen,
              },
              {
                id: 'staticRoutes',
                text: __('Routes'),
                icon: 'map-signs',
                path: '/main/network/static_routes',
                formUrl: formUrlConf.sNetworkRoutes,
                component: sNetworkRoutes.Screen,
              }, {
                id: 'networkPort',
                icon: 'th-large',
                path: '/main/network/port',
                formUrl: formUrlConf.sNetworkPort,
                text: __('Ports'),
                component: sNetworkPort.Screen,
              },
              {
                id: 'dpi',
                icon: 'copy',
                // label: __('beta'),
                path: '/main/network/dpi',
                text: __('Application Analsys'),
                indexPath: '/main/network/dpi/dpioverview',
                routes: [
                  {
                    id: 'dpioverview',
                    path: '/main/network/dpi/dpioverview',
                    formUrl: formUrlConf.sDPIOverview,
                    text: __('Overview'),
                    component: sDPIOverview.Screen,
                  },
                  {
                    id: 'macstatistic',
                    path: '/main/network/dpi/macstatistic',
                    formUrl: formUrlConf.sMacStatistic,
                    text: __('Clients '),
                    component: sMacStatistic.Screen,
                  }, {
                    id: 'ethstatistic',
                    path: '/main/network/dpi/ethstatistic',
                    formUrl: formUrlConf.sEthStatistic,
                    text: __('Ports '),
                    component: sEthStatistic.Screen,
                  }, {
                    id: 'protoinfo',
                    path: '/main/network/dpi/protoinfo',
                    formUrl: formUrlConf.sProtoInfo,
                    text: __('Protocols '),
                    component: sProtoInfo.Screen,
                  },
                  {
                    id: 'dpiSettings',
                    path: '/main/network/dpi/dpisettings',
                    formUrl: formUrlConf.sDPISettings,
                    text: __('Settings'),
                    component: sDPISettings.Screen,
                  },
                ],
              },
              // {
              //   id: 'firewall',
              //   isIndex: true,
              //   path: '/main/network/firewall',
              //   icon: 'dot-circle-o ',
              //   text: __('Firewall'),
              //   noTree: true,
              //   component: SharedComponents.TabContainer,
              //   indexPath: '/main/network/firewall/attackdefense',
              //   routes: [
              //     {
              //       id: 'attackDefense',
              //       isIndex: true,
              //       formUrl: 'goform/network/firewall/attackdefense',
              //       path: '/main/network/firewall/attackdefense',
              //       text: __('Attack Defense'),
              //       component: sAttackDefense.Screen,
              //     }, {
              //       id: 'firewallBlackList',
              //       isIndex: true,
              //       formUrl: 'goform/network/firewall/balcklist',
              //       path: '/main/network/firewall/balcklist',
              //       text: __('Black List'),
              //       component: sFirewallBlackList.Screen,
              //     },
              //   ],
              // },
            ],
          },
          {
            id: 'group',
            path: '/main/group',
            icon: 'group',
            text: __('AP Groups '),
            component: cGroup.Screen,
            indexPath: '/main/group/monitor/overview',
            routes: [
              {
                id: 'monitor',
                isIndex: true,
                path: '/main/group/monitor',
                icon: 'pie-chart',
                text: __('Monitor'),
                routes: [
                  {
                    id: 'overview',
                    path: '/main/group/monitor/overview',
                    formUrl: formUrlConf.sOverview,
                    text: __('Overview'),
                    component: sOverview.Screen,
                  },
                  {
                    id: 'ssidStatus',
                    path: '/main/group/monitor/ssid',
                    formUrl: formUrlConf.sSsidStatus,
                    text: __('SSID Status'),
                    component: sSsidStatus.Screen,
                  }, {
                    id: 'safeStatus',
                    path: '/main/group/monitor/safe',
                    formUrl: formUrlConf.sSafeStatus,
                    text: __('Secure State'),
                    component: sSafeStatus.Screen,
                  },
                ],
              },
              {
                id: 'apList',
                icon: 'bullseye',
                path: '/main/group/aps',
                formUrl: formUrlConf.sApList,
                text: __('AP List'),
                component: sApList.Screen,
              }, {
                id: 'groupClient',
                icon: 'desktop',
                path: '/main/group/user',
                formUrl: formUrlConf.sClientList,
                text: __('Client List'),
                component: sClientList.Screen,
              },
              {
                id: 'wireless',
                isIndex: true,
                path: '/main/group/wireless',
                icon: 'wifi',
                noTree: true,
                component: SharedComponents.TabContainer,

                // 不要删除空格
                text: __('WLANs'),
                routes: [
                  {
                    id: 'ssidSettings',
                    path: '/main/group/wireless/ssid',
                    formUrl: formUrlConf.sSsidSettings,
                    text: __('SSID Settings'),
                    component: sSsidSettings.Screen,
                  }, {
                    id: 'smartRf',
                    path: '/main/group/wireless/smart',
                    formUrl: formUrlConf.sSmartRf,
                    text: __('Radio Settings'),
                    component: sSmartRf.Screen,
                  },
                ],
              },
              {
                id: 'map',
                isIndex: true,
                path: '/main/group/map',
                icon: 'map',
                text: __('Map'),
                routes: [
                  {
                    id: 'liveMap',
                    text: __('Live Map'),
                    path: '/main/group/map/live/list',
                    formUrl: formUrlConf.sLiveMap,
                    isIndex: true,
                    component: sLiveMap.Screen,
                  }, {

                    id: 'buildMap',
                    text: __('AP Plan Map'),
                    path: '/main/group/map/building/:id',
                    formUrl: formUrlConf.sApPlanMap,
                    component: sApPlanMap.Screen,
                    noNav: true,
                  },
                  {
                    id: 'heatMap',
                    path: '/main/group/map/heat_map',
                    formUrl: formUrlConf.sHeatMap,
                    fetchUrl: formUrlConf.sHeatMap,
                    text: __('Heat Map'),
                    component: sHeatMap.Screen,
                  },
                  {
                    id: 'orbitTrace',
                    path: '/main/group/map/orbittrace',
                    formUrl: formUrlConf.sOrbitTrace,
                    fetchUrl: formUrlConf.sOrbitTrace,
                    text: __('Client Path Analysis'),
                    component: sOrbitTrace.Screen,
                  },
                  {
                    id: 'cientsTrace',
                    path: '/main/group/map/clients_trace',
                    text: __('Clients Statistics'),
                    icon: 'bar-chart',
                    noTree: true,
                    component: SharedComponents.TabContainer,
                    routes: [
                      {
                        id: 'clientsTrace',
                        path: '/main/group/map/clients_trace/list',
                        formUrl: formUrlConf.sClientsTraceList,
                        text: __('Clients Statistics'),
                        component: sClientsTraceList.Screen,
                      }, {
                        id: 'clientsTrace',
                        path: '/main/group/map/clients_trace/settings',
                        formUrl: formUrlConf.sClientsTraceSettings,
                        text: __('Settings'),
                        component: sClientsTraceSettings.Screen,
                      },
                    ],
                  },
                ],
              },
              {
                id: 'wirelessAcl',
                icon: 'ban',
                path: '/main/group/acl',
                formUrl: formUrlConf.sWirelessAcl,
                text: __('ACL'),
                component: sWirelessAcl.Screen,
              },
              {
                id: 'wirelessSafePolicy',
                icon: 'certificate',
                path: '/main/group/safe',
                text: __('Safe Policy'),
                noTree: true,
                component: SharedComponents.TabContainer,
                routes: [
                  {
                    id: 'wirelessEndpointProtection',
                    path: '/main/group/safe/endpointProtection',
                    formUrl: formUrlConf.sEndpointProtection,
                    text: __('Terminal Protection'),
                    component: sEndpointProtection.Screen,
                  },
                  {
                    id: 'wirelessWips',
                    path: '/main/group/safe/wips',
                    formUrl: formUrlConf.sWips,
                    text: __('AP Monitor Settings'),
                    component: sWips.Screen,
                  },
                ],
              },
              {
                id: 'timerPolicy',
                icon: 'clock-o',
                path: '/main/group/timer',
                formUrl: formUrlConf.sTimerPolicy,
                text: __('Scheduler'),
                component: sTimerPolicy.Screen,
              },
            ],
          },
          {
            id: 'portal',
            path: '/main/portal',
            icon: 'road',
            text: __('Hotspot'),
            component: cAAA.Screen,
            indexPath: '/main/portal/overview',
            routes: [
              {
                id: 'portalOverview',
                icon: 'home',
                path: '/main/portal/overview',
                formUrl: formUrlConf.sPortalOverview,
                mode: 'cors',
                text: __('Overview'),
                component: sPortalOverview.Screen,
              },
              {
                id: 'portalLogOnlineList',
                icon: 'desktop',
                path: '/main/portal/onlineList',
                formUrl: formUrlConf.sPortalOnlineList,
                text: __('Online Clients'),
                component: sPortalOnlineList.Screen,
              },
              {
                id: 'portalServices',
                isIndex: true,
                path: '/main/portal/local',
                icon: 'user-o',
                text: __('Local Server'),
                routes: [
                  {
                    id: 'portalAccess',
                    isIndex: true,
                    path: '/main/portal/local/portal',
                    text: __('Portal Server'),
                    noTree: true,
                    component: SharedComponents.TabContainer,
                    routes: [
                      {
                        id: 'portalAccessWeb',
                        path: '/main/portal/local/portal/web',
                        formUrl: formUrlConf.sPortalWeb,
                        text: __('Page Settings'),
                        component: sPortalWeb.Screen,
                      },
                      {
                        id: 'portalWechat',
                        path: '/main/portal/local/portal/weixin',
                        formUrl: formUrlConf.sPortalWeixin,
                        text: __('Wechat Login'),
                        component: sPortalWeixin.Screen,
                      },
                      {
                        id: 'portalFacebook',
                        path: '/main/portal/local/portal/facebook',
                        formUrl: formUrlConf.sPortalFacebook,
                        text: __('Facebook Login'),
                        component: sPortalFacebook.Screen,
                      },
                      {
                        id: 'portaSMSGateWay',
                        path: '/main/portal/local/portal/smsgateWay',
                        formUrl: formUrlConf.sPortalSMSGateWay,
                        text: __('SMS Gateway'),
                        component: sPortalSMSGateWay.Screen,
                      },
                      // {
                      //   id: 'portalAccessWeb',
                      //   path: '/main/portal/local/portal/web',
                      //   formUrl: 'goform/portal/access/web',
                      //   text: __('Web Template'),
                      //   component: sPortalWeb.Screen,
                      // },
                    ],
                  },
                  {
                    id: 'portalAccount',
                    isIndex: true,
                    path: '/main/portal/local/account',
                    text: __('User Accounts'),
                    noTree: true,
                    component: SharedComponents.TabContainer,
                    routes: [
                      {
                        id: 'portalAccountAccountList',
                        path: '/main/portal/local/account/list/index',
                        formUrl: formUrlConf.sPortalAccountList,
                        text: __('User Account List'),
                        isIndex: true,
                        component: sPortalAccountList.Screen,
                      },
                      {
                        id: 'portalAccountConnectRecord',
                        path: '/main/portal/local/account/connectRecord',
                        formUrl: formUrlConf.sPortalConnectRecord,
                        text: __('Client Usage Logs'),
                        component: sPortalConnectRecord.Screen,
                      },
                    ],
                  },
                  {
                    id: 'portalCard',
                    isIndex: true,
                    path: '/main/portal/local/card',
                    noTree: true,
                    component: SharedComponents.TabContainer,
                    text: __('Recharge Vouchers'),
                    routes: [
                      {
                        id: 'sPortalCardCategory',
                        path: '/main/portal/local/card/cardcategory',
                        formUrl: formUrlConf.sPortalCardCategory,
                        text: __('Vouchers'),
                        component: sPortalCardCategory.Screen,
                      }, {
                        id: 'portalCardCardList',
                        path: '/main/portal/local/card/cardlist',
                        formUrl: formUrlConf.sPortalCardList,
                        text: __('Recharge Coupons'),
                        component: sPortalCardList.Screen,
                      },
                    ],
                  },
                  {
                    id: 'portalMessage',
                    isIndex: true,
                    path: '/main/portal/local/message',
                    text: __('SMS Options'),
                    noTree: true,
                    component: SharedComponents.TabContainer,
                    routes: [
                      {
                        id: 'portalReceiveBox',
                        path: '/main/portal/local/message/receive',
                        formUrl: formUrlConf.sPortalReceiveBox,
                        text: __('Inbox'),
                        component: sPortalReceiveBox.Screen,
                      }, {
                        id: 'portalSendBox',
                        path: '/main/portal/local/message/send',
                        formUrl: formUrlConf.sPortalSendBox,
                        text: __('Outbox'),
                        component: sPortalSendBox.Screen,
                      }, {
                        id: 'portalSendMessage',
                        path: '/main/portal/local/message/sendmessage',
                        formUrl: formUrlConf.sPortalSendMessage,
                        text: __('Send Message'),
                        component: sPortalSendMessage.Screen,
                      },
                    ],
                  },
                  {
                    id: 'portalLog',
                    isIndex: true,
                    path: '/main/portal/local/log',
                    noTree: true,
                    component: SharedComponents.TabContainer,
                    text: __('Logs'),
                    routes: [
                      {
                        id: 'portalLogLogList',
                        path: '/main/portal/local/log/logList',
                        formUrl: formUrlConf.sPortalLogList,
                        text: __('User Log'),
                        component: sPortalLogList.Screen,
                      }, {
                        id: 'portalLogOnlineRecordList',
                        path: '/main/portal/local/log/onlineRecordList',
                        formUrl: formUrlConf.sPortalOnlineRecordList,
                        text: __('User Record List'),
                        component: sPortalOnlineRecordList.Screen,
                      },
                      {
                        id: 'portalSMSLog',
                        path: '/main/portal/local/log/portalsmslog',
                        formUrl: formUrlConf.sPortalSMSLog,
                        text: __('SMS Log'),
                        component: sPortalSMSLog.Screen,
                      },
                    ],
                  },
                ],
              },
              {
                id: 'portalMac',
                icon: 'file',
                path: '/main/portal/portal/mac',
                formUrl: formUrlConf.sPortalMac,
                text: __('Portal White List'),
                component: sPortalMac.Screen,
              },
              {
                id: 'networkAaa',
                icon: 'link',
                path: '/main/portal/aaa/list',
                formUrl: formUrlConf.sNetworkAaa,
                text: __('AAA Policies'),
                component: sNetworkAaa.Screen,
              },
            ],
          },
          {
            id: 'system',
            path: '/main/system',
            icon: 'cogs',
            text: __('System '),
            component: cSystem.Screen,
            indexPath: '/main/system/status',
            routes: [
              {
                id: 'systemStatus',
                icon: 'area-chart',
                path: '/main/system/status',
                formUrl: formUrlConf.sSystemStatus,
                text: __('System Status'),
                component: sSystemStatus.Screen,
              }, {
                id: 'alarmEvents',
                icon: 'exclamation-circle',
                path: '/main/system/alarm',
                formUrl: formUrlConf.sAlarmEvents,
                text: __('Alarm Events'),
                component: sAlarmEvents.Screen,
              }, {
                id: 'systemLog',
                icon: 'file-text-o',
                path: '/main/system/log',
                text: __('System Log'),
                noTree: true,
                component: SharedComponents.TabContainer,
                indexPath: '/main/system/log/list',
                routes: [
                  {
                    id: 'systemLog',
                    path: '/main/system/log/list',
                    formUrl: formUrlConf.sSystemLogList,
                    text: __('Log List'),
                    component: sSystemLogList.Screen,
                  }, {
                    id: 'systemLogMaintenance',
                    path: '/main/system/log/maintenance',
                    formUrl: formUrlConf.sSystemLogMaintenance,
                    text: __('Log Maintenance'),
                    component: sSystemLogMaintenance.Screen,
                  },
                ],
              },
              {
                id: 'License',
                isIndex: true,
                path: '/main/system/license',
                formUrl: formUrlConf.sLicense,
                icon: 'file-text',
                text: __('License'),
                component: sLicense.Screen,
              }, {
                id: 'apMaintenance',
                isIndex: true,
                path: '/main/system/ap',
                icon: 'dot-circle-o ',
                text: __('AP Maintenance'),
                noTree: true,
                component: SharedComponents.TabContainer,
                indexPath: '/main/system/ap/base',
                routes: [
                  {
                    id: 'apMaintenanceBase',
                    path: '/main/system/ap/base',
                    formUrl: formUrlConf.sApMaintenance,
                    text: __('Configuration'),
                    component: sApMaintenance.Screen,
                  }, {
                    id: 'apsVersion',
                    path: '/main/system/ap/version',
                    formUrl: formUrlConf.sApVersion,
                    text: __('AP Firmware'),
                    component: sApVersion.Screen,
                  }, {
                    id: 'apModel',
                    path: '/main/system/ap/model',
                    formUrl: formUrlConf.sApModel,
                    text: __('AP Model'),
                    component: sApModel.Screen,
                  },
                ],
              }, {
                id: 'acMaintenance',
                isIndex: true,
                path: '/main/system/maintenance',
                formUrl: formUrlConf.sAcMaintenance,
                icon: 'cog',
                text: __('AC Maintenance'),
                component: sAcMaintenance.Screen,
              }, {
                id: 'ntp',
                isIndex: true,
                path: '/main/system/networktimeprotocol',
                formUrl: formUrlConf.sNetworkTimeProtocol,
                icon: 'clock-o',
                text: __('NTP'),
                component: sNetworkTimeProtocol.Screen,
              }, {
                id: 'admin',
                isIndex: true,
                path: '/main/system/admin',
                formUrl: formUrlConf.sSystemAdmin,
                icon: 'user',
                text: __('Admin Account'),
                component: sSystemAdmin.Screen,
              },
            ],
          },
          {
            id: 'notFound',
            component: NotFound,
          },
        ],
      },
      {
        id: 'wizard',
        path: '/wizard',
        component: sWizard.Screen,
      },
      {
        id: 'login',
        path: '/login',
        mainPath: '/main/group/monitor/overview',
        component: sLogin.Screen,
      },
      {
        id: 'notFound',
        component: NotFound,
      },
    ],
  },
];

// 配置模块页面 reducers
const reducers = {
  // shared reducers
  app: app.reducer,
  screens: appScreen.reducer,
  properties: properties.reducer,

  // product comstom reducers
  product: sMainAxc.reducer,

  toastr: toastrReducer,
};

export default {
  reducers,
  routes,
  appConfig: guiConfig,
};

