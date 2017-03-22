import b28n from 'shared/b28n';
import NotFound from 'shared/components/NotFound';
import stringUtils from 'shared/utils/lib/string';
import appReducer from 'shared/reducers/app';
import screensReducer from 'shared/reducers/screens';
import propertiesReducer from 'shared/reducers/properties';
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

// 公用组件

// 主APP
const App = require('../../screens/App');
const SharedComponents = require('shared/components');

//
const sLogin = require('../../screens/App/screens/Login');
const sWizard = require('../../screens/App/screens/Wizard');

//
const sMainAxc = require('../../screens/App/screens/MainAxc');

/**
 * 网络设置
 */
const sInterfaces = require('../../screens/App/screens/MainAxc/screens/Network/screens/Interfaces');
const sDhcpList = require('../../screens/App/screens/MainAxc/screens/Network/screens/DHCP/screens/DHCP/DhcpList');
const sDhcpRelay = require('../../screens/App/screens/MainAxc/screens/Network/screens/DHCP/screens/Relay/DhcpRelay');
const sNetworkRoutes = require('../../screens/App/screens/MainAxc/screens/Network/screens/Routes');
const sNetworkNat = require('../../screens/App/screens/MainAxc/screens/Network/screens/Nat');
// const sNetworkAcl = require('../../screens/App/screens/MainAxc/screens/Network/screens/ACL');
const sNetworkPort = require('../../screens/App/screens/MainAxc/screens/Network/screens/Port');
const sRaduisTemplate =
    require('../../screens/App/screens/MainAxc/screens/Network/screens/RadiusTemplate');
const sRadiusProxy =
    require('../../screens/App/screens/MainAxc/screens/Network/screens/RadiusProxy');
const sNetworkAaa = require('../../screens/App/screens/MainAxc/screens/Network/screens/AAA');
const sPortalServer =
    require('../../screens/App/screens/MainAxc/screens/Network/screens/Portal/screens/PortalServer');
const sPortalRules =
    require('../../screens/App/screens/MainAxc/screens/Network/screens/Portal/screens/PortalRules');
const sPortalMac =
    require('../../screens/App/screens/MainAxc/screens/Network/screens/Portal/screens/PortalMac');


/**
 * AP组管理
 */
const cGroup = require('../../screens/App/screens/MainAxc/containers/Group');
const sOverview = require('../../screens/App/screens/MainAxc/screens/Monitor/screens/Overview');
const sClientList = require('../../screens/App/screens/MainAxc/screens/Monitor/screens/ClientList');
const sSsidStatus = require('../../screens/App/screens/MainAxc/screens/Monitor/screens/SsidStatus');
const sApList = require('../../screens/App/screens/MainAxc/screens/Monitor/screens/ApList');
const sSafeStatus = require('../../screens/App/screens/MainAxc/screens/Monitor/screens/SafeStatus');
const sWirelessAcl = require('../../screens/App/screens/MainAxc/screens/WLAN/screens/Acl');
const sSsidSettings =
    require('../../screens/App/screens/MainAxc/screens/WLAN/screens/SsidSettings');
const sSmartRf =
    require('../../screens/App/screens/MainAxc/screens/WLAN/screens/SmartRf');
const sTimerPolicy =
    require('../../screens/App/screens/MainAxc/screens/WLAN/screens/TimerPolicy');
const sWips =
    require('../../screens/App/screens/MainAxc/screens/WLAN/screens/SafePolicy/screens/Wips');
const sEndpointProtection =
  require('../../screens/App/screens/MainAxc/screens/WLAN/screens/SafePolicy/screens/EndpointProtection');

const sLiveMap = require('../../screens/App/screens/MainAxc/screens/Map/screens/LiveMap');
const sApPlanMap =
    require('../../screens/App/screens/MainAxc/screens/Map/screens/ApPlanMap');
const sOrbitTrace = require('../../screens/App/screens/MainAxc/screens/Map/screens/OrbitTrace');
const sClientsTraceList = require('../../screens/App/screens/MainAxc/screens/Map/screens/ClientsTrace');
const sClientsTraceSettings = require('../../screens/App/screens/MainAxc/screens/Map/screens/ClientsTrace/Settings');
const sHeatMap = require('../../screens/App/screens/MainAxc/screens/Map/screens/HeatMap');

// ndpi
const sDPIOverview =
    require('../../screens/App/screens/MainAxc/screens/Network/screens/DPI/screens/DPIOverview');
// const sFlowInfo =
const sMacStatistic =
    require('../../screens/App/screens/MainAxc/screens/Network/screens/DPI/screens/MacStatistic');
const sEthStatistic =
    require('../../screens/App/screens/MainAxc/screens/Network/screens/DPI/screens/EthStatistic');
const sProtoInfo =
    require('../../screens/App/screens/MainAxc/screens/Network/screens/DPI/screens/ProtoInfo');


/**
 * 系统管理
 */
const sSystemStatus =
    require('../../screens/App/screens/MainAxc/screens/System/screens/SystemStatus');
const sSystemAdmin =
    require('../../screens/App/screens/MainAxc/screens/System/screens/SystemAdmin');
const sAlarmEvents =
    require('../../screens/App/screens/MainAxc/screens/System/screens/AlarmEvents');
const sLicense =
    require('../../screens/App/screens/MainAxc/screens/System/screens/License');
const sSystemLogList =
    require('../../screens/App/screens/MainAxc/screens/System/screens/SystemLog/screens/LogList');
const sSystemLogMaintenance =
    require('../../screens/App/screens/MainAxc/screens/System/screens/SystemLog/screens/logMaintenance');
// const sSNMP =
//     require('../../screens/App/screens/MainAxc/screens/System/screens/SNMP');
// const sActiveStandby =
//     require('../../screens/App/screens/MainAxc/screens/System/screens/ActiveStandby');
// const sSignatures =
//     require('../../screens/App/screens/MainAxc/screens/System/screens/Signatures');
const sApVersion =
    require('../../screens/App/screens/MainAxc/screens/System/screens/ApVersion');
const sApMaintenance =
    require('../../screens/App/screens/MainAxc/screens/System/screens/ApMaintenance');
const sApModel =
    require('../../screens/App/screens/MainAxc/screens/System/screens/ApModel');
const sAcMaintenance =
    require('../../screens/App/screens/MainAxc/screens/System/screens/AcMaintenance');
const sNetworkTimeProtocol =
    require('../../screens/App/screens/MainAxc/screens/System/screens/NetworkTimeProtocol');


/**
 * Portal
 */
const sPortalOverview =
    require('../../screens/App/screens/MainAxc/screens/Portal/screens/Overview');
const sPortalBase =
    require('../../screens/App/screens/MainAxc/screens/Portal/screens/Access/Base');
// const sPortalBas =
    // require('../../screens/App/screens/MainAxc/screens/Portal/screens/Access/Bas');
const sPortalUrlParams =
    require('../../screens/App/screens/MainAxc/screens/Portal/screens/Access/UrlParams');
const sPortalWeb =
    require('../../screens/App/screens/MainAxc/screens/Portal/screens/Access/Web');
const sPortalDefaultWeb =
    require('../../screens/App/screens/MainAxc/screens/Portal/screens/Access/DefaultWeb');
const sPortalWeixin =
    require('../../screens/App/screens/MainAxc/screens/Portal/screens/Access/Weixin');
const sPortalSMSGateWay =
    require('../../screens/App/screens/MainAxc/screens/Portal/screens/Access/SMSGateway');
const sPortalSMSLog =
    require('../../screens/App/screens/MainAxc/screens/Portal/screens/Access/SMSLog');

// const sPortalApSetting =
//     require('../../screens/App/screens/MainAxc/screens/Portal/screens/Access/ApSetting');
// const sPortalSsid =
//     require('../../screens/App/screens/MainAxc/screens/Portal/screens/Access/Ssid');

const sPortalNas =
    require('../../screens/App/screens/MainAxc/screens/Portal/screens/Radius/Nas');
const sPortalOnline =
    require('../../screens/App/screens/MainAxc/screens/Portal/screens/Radius/Online');
const sPortalConnectLog =
    require('../../screens/App/screens/MainAxc/screens/Portal/screens/Radius/ConnectLog');

const sPortalAccountList =
    require('../../screens/App/screens/MainAxc/screens/Portal/screens/Account/AccountList');
const sPortalAccountListMac =
    require('../../screens/App/screens/MainAxc/screens/Portal/screens/Account/AccountListMac');
const sPortalConnectRecord =
    require('../../screens/App/screens/MainAxc/screens/Portal/screens/Account/ConnectRecord');


const sPortalSendMessage =
    require('../../screens/App/screens/MainAxc/screens/Portal/screens/Message/SendMessage');
const sPortalSendBox =
    require('../../screens/App/screens/MainAxc/screens/Portal/screens/Message/SendBox');
const sPortalReceiveBox =
    require('../../screens/App/screens/MainAxc/screens/Portal/screens/Message/ReceiveBox');


const sPortalCardCategory =
    require('../../screens/App/screens/MainAxc/screens/Portal/screens/Card/CardCategory');
const sPortalCardList =
    require('../../screens/App/screens/MainAxc/screens/Portal/screens/Card/CardList');
const sPortalLogList =
    require('../../screens/App/screens/MainAxc/screens/Portal/screens/Log/LogList');
const sPortalOnlineRecordList =
    require('../../screens/App/screens/MainAxc/screens/Portal/screens/Log/OnlineRecordList');
const sPortalOnlineList =
    require('../../screens/App/screens/MainAxc/screens/Portal/screens/Log/OnlineList');

const routes = [
  {
    id: 'root',
    path: '/',
    component: App.Screen,
    formUrl: 'goform/axcInfo',
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
            text: _('Network '),
            component: SharedComponents.NavContainer,
            indexPath: '/main/network/interface',
            routes: [
              {
                id: 'networkInterface',
                icon: 'th',
                path: '/main/network/interface',
                formUrl: 'goform/network/interface',
                text: _('Interfaces'),
                component: sInterfaces.Screen,
              }, {
                id: 'networkDhcp',
                icon: 'random',
                noTree: true,
                component: SharedComponents.TabContainer,
                path: '/main/network/dhcp',
                text: _('DHCP'),
                indexPath: '/main/network/dhcp/service/list',
                routes: [
                  {
                    id: 'dhcpList',
                    path: '/main/network/dhcp/service/list',
                    formUrl: 'goform/network/dhcp/service/list',
                    text: _('DHCP List'),
                    component: sDhcpList.Screen,
                  }, {
                    id: 'dhcpRelay',
                    path: '/main/network/dhcp/relay',
                    formUrl: 'goform/network/dhcp/relay',
                    text: _('DHCP Relay'),
                    component: sDhcpRelay.Screen,
                  },
                ],
              }, {
                id: 'networkNat',
                icon: 'exchange',
                path: '/main/network/nat',
                text: _('NAT'),
                formUrl: 'goform/network/nat',
                component: sNetworkNat.Screen,
              },
              {
                id: 'staticRoutes',
                path: '/main/network/static_routes',
                text: _('Routes'),
                icon: 'map-signs',
                formUrl: 'goform/network/route',
                component: sNetworkRoutes.Screen,
              }, {
                id: 'networkPort',
                path: '/main/network/port',
                icon: 'th-large',
                formUrl: '/goform/network/port',
                text: _('Ports'),
                component: sNetworkPort.Screen,
              }, {
                id: 'networkRadius',
                icon: 'clone',
                path: '/main/network/radius',
                text: _('Radius'),
                noTree: true,
                component: SharedComponents.TabContainer,
                routes: [
                  {
                    id: 'radiusTemplate',
                    path: '/main/network/radius/template',
                    formUrl: 'goform/network/radius/template',
                    text: _('Radius Server'),
                    component: sRaduisTemplate.Screen,
                  },
                  {
                    id: 'radiusProxy',
                    path: '/main/network/radius/proxy',
                    formUrl: 'goform/network/radius/proxy',
                    text: _('Radius Proxy'),
                    component: sRadiusProxy.Screen,
                  },
                ],
              }, {
                id: 'networkAaa',
                icon: 'lock',
                path: '/main/network/aaa',
                formUrl: 'goform/network/Aaa',
                text: _('AAA'),
                component: sNetworkAaa.Screen,
              }, {
                id: 'networkPortal',
                icon: 'copy',
                text: _('Portal Policy'),
                noTree: true,
                component: SharedComponents.TabContainer,
                path: '/main/network/portal',
                indexPath: '/main/network/portal/server',
                routes: [
                  {
                    id: 'portalServer',
                    path: '/main/network/portal/server',
                    formUrl: 'goform/network/portal/server',
                    text: _('Server'),
                    component: sPortalServer.Screen,
                  }, {
                    id: 'portalRules',
                    path: '/main/network/portal/rules',
                    formUrl: 'goform/network/portal/rule',
                    text: _('Rules'),
                    component: sPortalRules.Screen,
                  },
                  {
                    id: 'portalMac',
                    path: '/main/network/portal/mac',
                    formUrl: 'goform/network/portal/mac',
                    text: _('White List'),
                    component: sPortalMac.Screen,
                  },
                ],
              },
              {
                id: 'dpi',
                icon: 'copy',
                noTree: true,
                component: SharedComponents.TabContainer,
                path: '/main/network/dpi',
                text: _('DPI'),
                indexRoute: { onEnter: (nextState, replace) => replace('/main/network/dpi/dpioverview') },
                routes: [
                  {
                    id: 'dpioverview',
                    path: '/main/network/dpi/dpioverview',
                    formUrl: 'goform/network/dpi/overview',
                    text: _('Overview'),
                    component: sDPIOverview.Screen,
                  },
                  {
                    id: 'macstatistic',
                    path: '/main/network/dpi/macstatistic',
                    formUrl: 'goform/network/dpi/macstatistic',
                    text: _('Mac Statistic'),
                    component: sMacStatistic.Screen,
                  }, {
                    id: 'ethstatistic',
                    path: '/main/network/dpi/ethstatistic',
                    formUrl: 'goform/network/dpi/ethstatistic',
                    text: _('Ethernet Statistic'),
                    component: sEthStatistic.Screen,
                  }, {
                    id: 'protoinfo',
                    path: '/main/network/dpi/protoinfo',
                    formUrl: 'goform/network/dpi/protoinfo',
                    text: _('Proto Info'),
                    component: sProtoInfo.Screen,
                  },
                ],
              },
            ],
          },
          {
            id: 'group',
            path: '/main/group',
            icon: 'group',
            text: _('AP Groups '),
            component: cGroup.Screen,
            indexPath: '/main/group/monitor/overview',
            routes: [
              {
                id: 'monitor',
                isIndex: true,
                path: '/main/group/monitor',
                icon: 'pie-chart',
                text: _('Monitor'),
                routes: [
                  {
                    id: 'overview',
                    path: '/main/group/monitor/overview',
                    formUrl: 'goform/group/overview',
                    text: _('Overview'),
                    component: sOverview.Screen,
                  },
                  // {
                  //   id: 'groupTraffic',
                  //   path: '/main/group/monitor/flow',
                  //   formUrl: 'goform/group/flow/user',
                  //   text: _('Traffic'),
                  //   component: sFlowUser.Screen,
                  //   indexRoute: {
                  //     onEnter: (nextState, replace) => replace('/main/group/monitor/flow/user'),
                  //   },
                  //   routes: [
                  //     {
                  //       id: 'userFlow',
                  //       path: '/main/group/monitor/flow/user',
                  //       formUrl: 'goform/group/flow/user',
                  //       text: _('User'),
                  //       component: sFlowUser.Screen,
                  //     }, {
                  //       id: 'appFlow',
                  //       path: '/main/group/monitor/flow/app',
                  //       formUrl: 'goform/group/flow/app',
                  //       text: _('App'),
                  //       component: sFlowApp.Screen,
                  //     },
                  //   ],
                  // },
                  {
                    id: 'ssidStatus',
                    path: '/main/group/monitor/ssid',
                    formUrl: 'goform/group/ssid',
                    text: _('SSID Status'),
                    component: sSsidStatus.Screen,
                  }, {
                    id: 'safeStatus',
                    path: '/main/group/monitor/safe',
                    formUrl: 'goform/group/safeStatus',
                    text: _('Secure State'),
                    component: sSafeStatus.Screen,
                  },
                ],
              },
              {
                id: 'apList',
                icon: 'bullseye',
                path: '/main/group/aps',
                formUrl: 'goform/group/aps',
                text: _('AP List'),
                component: sApList.Screen,
              }, {
                id: 'groupClient',
                icon: 'desktop',
                path: '/main/group/user',
                formUrl: 'goform/group/client',
                text: _('Client List'),
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
                text: _('Radio '),
                indexRoute: { onEnter: (nextState, replace) => replace('/main/group/wireless/ssid') },
                routes: [
                  {
                    id: 'ssidSettings',
                    path: '/main/group/wireless/ssid',
                    formUrl: 'goform/group/ssidSetting',
                    text: _('SSID Settings'),
                    component: sSsidSettings.Screen,
                  }, {
                    id: 'smartRf',
                    path: '/main/group/wireless/smart',
                    formUrl: 'goform/group/smartRf',
                    text: _('Smart RF'),
                    component: sSmartRf.Screen,
                  },
                ],
              },
              {
                id: 'map',
                isIndex: true,
                path: '/main/group/map',
                icon: 'map',
                text: _('Map'),
                routes: [
                  {
                    id: 'liveMap',
                    path: '/main/group/map/live/list',
                    text: _('Live Map'),
                    formUrl: 'goform/group/map/building',
                    isIndex: true,
                    component: sLiveMap.Screen,
                  }, {

                    id: 'buildMap',
                    path: '/main/group/map/building/:id',
                    text: _('AP Plan Map'),
                    formUrl: 'goform/group/map/apPlan',
                    component: sApPlanMap.Screen,
                    noNav: true,
                  },
                  // {
                  //   id: 'liveMap',
                  //   path: '/main/group/map/live',
                  //   text: _('Live Map'),
                  //   indexPath: '/main/group/map/live/list',
                  //   routes: [
                  //     {
                  //       id: 'liveMap',
                  //       path: '/main/group/map/live/list',
                  //       text: _('Live Map'),
                  //       formUrl: 'goform/group/map/building',
                  //       isIndex: true,
                  //       component: sLiveMap.Screen,
                  //     }, {

                  //       id: 'buildMap',
                  //       path: '/main/group/map/live/(:id)',
                  //       text: _('AP Plan Map'),
                  //       formUrl: 'goform/group/map/apPlan',
                  //       component: sApPlanMap.Screen,
                  //       noNav: true,
                  //     },
                  //   ],
                  // },
                  // {
                  //   id: 'heatMap',
                  //   path: '/main/group/map/heat_map',
                  //   formUrl: 'goform/group/map/heatmap',
                  //   fetchUrl: 'goform/group/map/heatmap',
                  //   text: _('Heat Map'),
                  //   component: sHeatMap.Screen,
                  // },
                  // {
                  //   id: 'orbitTrace',
                  //   path: '/main/group/map/orbittrace',
                  //   formUrl: '/goform/group/map/orbittrace',
                  //   fetchUrl: '/goform/group/map/orbittrace',
                  //   text: _('Orbit Trace'),
                  //   component: sOrbitTrace.Screen,
                  // },
                  {
                    id: 'cientsTrace',
                    path: '/main/group/map/clients_trace',
                    text: _('Clients Statistics'),
                    icon: 'bar-chart',
                    noTree: true,
                    component: SharedComponents.TabContainer,
                    routes: [
                      {
                        id: 'clientsTrace',
                        path: '/main/group/map/clients_trace/list',
                        formUrl: '/goform/group/map/clients_trace',
                        text: _('Clients Statistics'),
                        component: sClientsTraceList.Screen,
                      }, {
                        id: 'clientsTrace',
                        path: '/main/group/map/clients_trace/settings',
                        formUrl: 'goform/group/map/clients_trace',
                        text: _('Settings'),
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
                formUrl: '/goform/group/wireless/acl',
                text: _('ACL'),
                component: sWirelessAcl.Screen,
              },
              {
                id: 'wirelessSafePolicy',
                icon: 'certificate',
                path: '/main/group/safe',
                formUrl: 'goform/group/timerPolicy',
                text: _('Safe Policy'),
                noTree: true,
                component: SharedComponents.TabContainer,
                indexRoute: {
                  onEnter: (nextState, replace) => replace('/main/group/safe/wips'),
                },
                routes: [
                  {
                    id: 'wirelessWips',
                    path: '/main/group/safe/wips',
                    formUrl: 'goform/group/wips',
                    text: _('AP Scan Settings'),
                    component: sWips.Screen,
                  }, {
                    id: 'wirelessEndpointProtection',
                    path: '/main/group/safe/endpointProtection',
                    formUrl: 'goform/group/wireless/protection',
                    text: _('Terminal Protection'),
                    component: sEndpointProtection.Screen,
                  },
                ],
              },
              {
                id: 'timerPolicy',
                icon: 'clock-o',
                path: '/main/group/timer',
                formUrl: 'goform/group/timerPolicy',
                text: _('Scheduler'),
                component: sTimerPolicy.Screen,
              },
            ],
          },
          {
            id: 'portal',
            path: '/main/portal',
            icon: 'road',
            text: _('Hotspot'),
            component: SharedComponents.NavContainer,
            indexPath: '/main/portal/overview',
            routes: [
              {
                id: 'portalOverview',
                icon: 'home',
                path: '/main/portal/overview',
                formUrl: 'goform/portal/overview',
                mode: 'cors',
                text: _('Overview'),
                component: sPortalOverview.Screen,
              }, {
                id: 'portalAccess',
                isIndex: true,
                path: '/main/portal/access',
                icon: 'link',
                text: _('Access Auth'),
                indexPath: '/main/portal/access/config',
                routes: [
                  {
                    id: 'portalAccessBase',
                    path: '/main/portal/access/config',
                    formUrl: 'goform/portal/access/config',
                    text: _('Base'),
                    component: sPortalBase.Screen,
                  },
                  {
                    id: 'portalAccessUrlParameter',
                    path: '/main/portal/access/urlParameter',
                    formUrl: 'goform/portal/access/urlParameter',
                    text: _('URL Parameter'),
                    component: sPortalUrlParams.Screen,
                  }, {
                    id: 'portalAccessWeb',
                    path: '/main/portal/access/web',
                    formUrl: 'goform/portal/access/web',
                    text: _('Web Template'),
                    component: sPortalWeb.Screen,
                  }, {
                    id: 'portalAccessDefaultWeb',
                    path: '/main/portal/access/defaultweb',
                    formUrl: 'goform/portal/access/defaultweb',
                    text: _('Default Web'),
                    component: sPortalDefaultWeb.Screen,
                  }, {
                    id: 'portalWechat',
                    path: '/main/portal/access/weixin',
                    formUrl: 'goform/portal/access/weixin',
                    text: _('Wechat Auth'),
                    component: sPortalWeixin.Screen,
                  },
                ],
              }, {
                id: 'portalRadius',
                path: '/main/portal/radius',
                icon: 'podcast',
                text: _('Radius'),
                isIndex: true,
                indexPath: '/main/portal/radius/nas',
                routes: [
                  {
                    id: 'portalRadiusNas',
                    path: '/main/portal/radius/nas',
                    formUrl: 'goform/portal/radius/nas',
                    text: _('NAS List'),
                    component: sPortalNas.Screen,
                  }, {
                    id: 'portalRadiusOnlineList',
                    path: '/main/portal/radius/online',
                    formUrl: 'goform/portal/radius/online',
                    text: _('Online List'),
                    component: sPortalOnline.Screen,
                  }, {
                    id: 'portalRadiusConnectLogs',
                    path: '/main/portal/radius/logs',
                    formUrl: 'goform/portal/radius/logs',
                    text: _('Connect Logs'),
                    component: sPortalConnectLog.Screen,
                  },
                ],
              }, {
                id: 'portalAccount',
                isIndex: true,
                path: '/main/portal/account',
                icon: 'user-o',
                text: _('Access Account'),
                indexPath: '/main/portal/account/list',
                routes: [
                  {
                    id: 'portalAccountAccountList',
                    path: '/main/portal/account/list/index',
                    formUrl: 'goform/portal/account/accountList',
                    text: _('Account List'),
                    isIndex: true,
                    component: sPortalAccountList.Screen,
                  }, {
                    id: 'portalAccountAccountListMac',
                    path: '/main/portal/account/list/mac/:loginName',
                    formUrl: 'goform/portal/account/accountListMac',
                    text: _('Account List Mac'),
                    component: sPortalAccountListMac.Screen,
                    noNav: true,
                  },
                  {
                    id: 'portalAccountConnectRecord',
                    path: '/main/portal/account/connectRecord',
                    formUrl: 'goform/portal/account/connectRecord',
                    text: _('Connect Record'),
                    component: sPortalConnectRecord.Screen,
                  },
                ],
              },
              {
                id: 'portalMessage',
                isIndex: true,
                path: '/main/portal/message',
                icon: 'envelope-o',
                text: _('Message'),
                indexPath: '/main/portal/message/send',
                routes: [
                  {
                    id: 'portalSendMessage',
                    path: '/main/portal/message/sendmessage',
                    formUrl: 'goform/portal/message/sendmessage',
                    text: _('Send Message'),
                    component: sPortalSendMessage.Screen,
                  }, {
                    id: 'portalReceiveBox',
                    path: '/main/portal/message/receive',
                    formUrl: 'goform/portal/message/receive',
                    text: _('Receive Box'),
                    component: sPortalReceiveBox.Screen,
                  }, {
                    id: 'portalSendBox',
                    path: '/main/portal/message/send',
                    formUrl: 'goform/portal/message/send',
                    text: _('Send Box'),
                    component: sPortalSendBox.Screen,
                  },
                ],
              },
              {
                id: 'portalLog',
                isIndex: true,
                path: '/main/portal/log',
                icon: 'file-text-o',
                text: _('Online Record Log'),
                routes: [
                  {
                    id: 'portalLogLogList',
                    path: '/main/portal/log/logList',
                    formUrl: 'goform/portal/log/logList',
                    text: _('Log List'),
                    component: sPortalLogList.Screen,
                  }, {
                    id: 'portalLogOnlineList',
                    path: '/main/portal/log/onlineList',
                    formUrl: 'goform/portal/log/onlineList',
                    text: _('Online List'),
                    component: sPortalOnlineList.Screen,
                  }, {
                    id: 'portalLogOnlineRecordList',
                    path: '/main/portal/log/onlineRecordList',
                    formUrl: 'goform/portal/log/onlineRecordList',
                    text: _('Online Record List'),
                    component: sPortalOnlineRecordList.Screen,
                  },
                ],
              },
              {
                id: 'portalCard',
                isIndex: true,
                path: '/main/portal/card',
                icon: 'vcard-o',
                text: _('Rechargeable Card'),
                indexRoute: {
                  onEnter: (nextState, replace) => replace('/main/portal/card/cardcategory'),
                },
                routes: [
                  {
                    id: 'sPortalCardCategory',
                    path: '/main/portal/card/cardcategory',
                    formUrl: 'goform/portal/card/cardcategory',
                    text: _('Card Category'),
                    component: sPortalCardCategory.Screen,
                  }, {
                    id: 'portalCardCardList',
                    path: '/main/portal/card/cardlist',
                    formUrl: 'goform/portal/card/cardlist',
                    text: _('Card List'),
                    component: sPortalCardList.Screen,
                  },
                ],
              },
            ],
          },
          {
            id: 'system',
            path: '/main/system',
            icon: 'cogs',
            text: _('System '),
            component: SharedComponents.NavContainer,
            indexPath: '/main/system/status',
            routes: [
              {
                id: 'systemStatus',
                icon: 'area-chart',
                path: '/main/system/status',
                formUrl: '/goform/system/status',
                text: _('System Status'),
                component: sSystemStatus.Screen,
              }, {
                id: 'alarmEvents',
                icon: 'exclamation-circle',
                path: '/main/system/alarm',
                formUrl: '/goform/system/alarmEvents',
                text: _('Alarm Events'),
                component: sAlarmEvents.Screen,
              }, {
                id: 'systemLog',
                icon: 'file-text-o',
                path: '/main/system/log',
                text: _('System Log'),
                noTree: true,
                component: SharedComponents.TabContainer,
                indexPath: '/main/system/log/list',
                routes: [
                  {
                    id: 'systemLog',
                    path: '/main/system/log/list',
                    formUrl: 'goform/system/log',
                    text: _('Log List'),
                    component: sSystemLogList.Screen,
                  }, {
                    id: 'systemLogMaintenance',
                    path: '/main/system/log/maintenance',
                    formUrl: 'goform/system/log',
                    text: _('Log Maintenance'),
                    component: sSystemLogMaintenance.Screen,
                  },
                ],
              },
              {
                id: 'License',
                isIndex: true,
                path: '/main/system/license',
                formUrl: 'goform/system/license',
                icon: 'file-text',
                text: _('License'),
                component: sLicense.Screen,
              }, {
                id: 'apMaintenance',
                isIndex: true,
                path: '/main/system/ap',
                icon: 'dot-circle-o ',
                text: _('AP Maintenance'),
                noTree: true,
                component: SharedComponents.TabContainer,
                indexPath: '/main/system/ap/base',
                routes: [
                  {
                    id: 'apMaintenanceBase',
                    path: '/main/system/ap/base',
                    formUrl: 'goform/system/maintenance',
                    text: _('Configuration'),
                    component: sApMaintenance.Screen,
                  }, {
                    id: 'apsVersion',
                    path: '/main/system/ap/version',
                    formUrl: 'goform/system/ap/version',
                    text: _('AP Firmware'),
                    component: sApVersion.Screen,
                  }, {
                    id: 'apModel',
                    path: '/main/system/ap/model',
                    formUrl: 'goform/system/ap/model',
                    text: _('AP Model'),
                    component: sApModel.Screen,
                  },
                ],
              }, {
                id: 'acMaintenance',
                isIndex: true,
                formUrl: 'goform/system/maintenance',
                path: '/main/system/maintenance',
                icon: 'cog',
                text: _('AC Maintenance'),
                component: sAcMaintenance.Screen,
              }, {
                id: 'ntp',
                isIndex: true,
                formUrl: 'goform/system/networktimeprotocol',
                path: '/main/system/networktimeprotocol',
                icon: 'clock-o',
                text: _('NTP'),
                component: sNetworkTimeProtocol.Screen,
              }, {
                id: 'admin',
                isIndex: true,
                path: '/main/system/admin',
                formUrl: 'goform/system/admins',
                icon: 'user',
                text: _('Admin Account'),
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


// 配置模块页面 store
const reducers = {
  // shared reducers
  app: appReducer,
  screens: screensReducer,
  properties: propertiesReducer,

  // product comstom reducers
  product: sMainAxc.reducer,

  toastr: toastrReducer,
};

const app = {
  reducers,
  routes,
  appConfig: guiConfig,
};

export default app;

