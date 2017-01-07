import b28n from 'shared/b28n';
import { combineReducers } from 'redux';
import NotFound from 'shared/components/NotFound';
import remoteActionMiddleware from 'shared/utils/lib/remote_action_middleware';
import stringUtils from 'shared/utils/lib/string';
import * as appActions from 'shared/actions/app';
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
const validateCn = require('../lang/cn/validate.json');
const cnOpenPortal = require('../lang/cn/openPortal.json');
const langEn = require('../lang/en/core.json');

const bodyElem = document.getElementsByTagName('body')[0];

b28n.addDict(cnCore, 'cn');
b28n.addDict(cnAxc, 'cn');
b28n.addDict(validateCn, 'cn');
b28n.addDict(cnOpenPortal, 'cn');
b28n.addDict(langEn, 'en');
window.CB = b28n.init({
  supportLang: ['en', 'cn'],
});
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
// const sNetworkVlan = require('../../screens/App/screens/MainAxc/screens/Network/screens/VLAN');
const sInterfaces = require('../../screens/App/screens/MainAxc/screens/Network/screens/Interfaces');
const sDhcpList = require('../../screens/App/screens/MainAxc/screens/Network/screens/DHCP/screens/DhcpList');
const sDhcpRelay = require('../../screens/App/screens/MainAxc/screens/Network/screens/DHCP/screens/DhcpRelay');
const sNetworkRoutes = require('../../screens/App/screens/MainAxc/screens/Network/screens/Routes');
const sNetworkNat = require('../../screens/App/screens/MainAxc/screens/Network/screens/Nat');
// const sNetworkAcl = require('../../screens/App/screens/MainAxc/screens/Network/screens/ACL');
const sNetworkPort = require('../../screens/App/screens/MainAxc/screens/Network/screens/Port');
const sRaduisTemplate =
    require('../../screens/App/screens/MainAxc/screens/Network/screens/RadiusTemplate');
const sNetworkAaa = require('../../screens/App/screens/MainAxc/screens/Network/screens/AAA');
const sPortalServer =
    require('../../screens/App/screens/MainAxc/screens/Network/screens/Portal/screens/PortalServer');
const sPortalRules =
    require('../../screens/App/screens/MainAxc/screens/Network/screens/Portal/screens/PortalRules');
const sPortalMac =
    require('../../screens/App/screens/MainAxc/screens/Network/screens/Portal/screens/PortalMac');
// const sPortalTemplate =
//    require('../../screens/App/screens/MainAxc/screens/Network/screens/Portal/screens/PortalTemplate');

/**
 * AP组管理
 */
const sOverview = require('../../screens/App/screens/MainAxc/screens/Monitor/screens/Overview');
const sUsers = require('../../screens/App/screens/MainAxc/screens/Monitor/screens/Users');
const sFlowUser = require('../../screens/App/screens/MainAxc/screens/Monitor/screens/Flow/User');
// const sFlowApp = require('../../screens/App/screens/MainAxc/screens/Monitor/screens/Flow/App');
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

// const sFlowReport =
//     require('../../screens/App/screens/MainAxc/screens/Report/screens/FlowReport');
// const sUsersAnalysis =
//     require('../../screens/App/screens/MainAxc/screens/Report/screens/BusinessReport/screens/UsersAnalysis');
const sLiveMap = require('../../screens/App/screens/MainAxc/screens/Map/screens/LiveMap');
const sApPlanMap =
    require('../../screens/App/screens/MainAxc/screens/Map/screens/ApPlanMap');
// const sRfMap = require('../../screens/App/screens/MainAxc/screens/Map/screens/Rf');
// const sHeatMap = require('../../screens/App/screens/MainAxc/screens/Map/screens/HeatMap');
// const sClientsTrace = require('../../screens/App/screens/MainAxc/screens/Map/screens/ClientsTrace');

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
 * Open Portal
 */
const sOpenPortalOverview =
    require('../../screens/App/screens/MainAxc/screens/OpenPortal/screens/Overview');
const sOpenPortalBase =
    require('../../screens/App/screens/MainAxc/screens/OpenPortal/screens/Portal/Base');
const sOpenPortalBas =
    require('../../screens/App/screens/MainAxc/screens/OpenPortal/screens/Portal/Bas');

const sOpenPortalUrlParams =
    require('../../screens/App/screens/MainAxc/screens/OpenPortal/screens/Portal/UrlParams');

const sOpenPortalNas =
    require('../../screens/App/screens/MainAxc/screens/OpenPortal/screens/Radius/Nas');
const sOpenPortalOnline =
    require('../../screens/App/screens/MainAxc/screens/OpenPortal/screens/Radius/Online');
const sOpenPortalConnectLog =
    require('../../screens/App/screens/MainAxc/screens/OpenPortal/screens/Radius/ConnectLog');

function getOpenPortalFormUrl(url) {
  //const hostname = window.location.hostname;
  const hostname = '192.168.1.56';
  const protocolStr = window.location.protocol;
  const portStr = '8080';
  //const portStr = window.location.port;

  const prefix = 'goform';
  let ret = '';

  ret = `${protocolStr}//${hostname}:${portStr}/${prefix}/${url}.action`;

  return ret;
}

const routes = [
  {
    path: '/',
    component: App.Screen,
    formUrl: 'goform/axcInfo',
    mainPath: '/main/group/monitor/overview',
    indexRoute: { component: sLogin.Screen },
    childRoutes: [
      {
        path: '/main/network',
        component: sMainAxc.Screen,
        icon: 'sphere',
        text: _('NETWORK'),
        indexRoute: { onEnter: (nextState, replace) => replace('/main/network/interface') },
        childRoutes: [
          // {
          //   id: 'networkVlan',
          //   isIndex: true,
          //   path: '/main/network/vlan',
          //   formUrl: 'goform/networkVlan',
          //   icon: 'road',
          //   text: _('VLAN'),
          //   component: sNetworkVlan.Screen,
          // },
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
            indexRoute: { onEnter: (nextState, replace) => replace('/main/network/dhcp/List') },
            childRoutes: [
              {
                id: 'dhcpList',
                path: '/main/network/dhcp/List',
                formUrl: 'goform/network/dhcp/list',
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
          // 先隐藏ACL
          // {
          //   id: 'networkAcl',
          //   icon: 'ban',
          //   path: '/main/network/acl',
          //   text: _('Access Control'),
          //   formUrl: 'goform/network/acl',
          //   component: sNetworkAcl.Screen,
          // },
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
            id: 'radiusTemplate',
            icon: 'clone',
            path: '/main/network/radius_template',
            formUrl: 'goform/network/radius/template',
            text: _('Radius Server'),
            component: sRaduisTemplate.Screen,
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
            noTree: true,
            component: SharedComponents.TabContainer,
            path: '/main/network/portal',
            text: _('Portal Policy'),
            indexRoute: { onEnter: (nextState, replace) => replace('/main/network/portal/server') },
            childRoutes: [
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
        ],
      }, {
        path: '/main/group',
        component: sMainAxc.Screen,
        icon: 'group',
        text: _('AP GROUP'),
        indexRoute: { onEnter: (nextState, replace) => replace('/main/group/monitor') },
        childRoutes: [
          {
            id: 'monitor',
            isIndex: true,
            path: '/main/group/monitor',
            icon: 'pie-chart',
            text: _('Monitor'),
            indexRoute: { onEnter: (nextState, replace) => replace('/main/group/monitor/overview') },
            childRoutes: [
              {
                id: 'overview',
                path: '/main/group/monitor/overview',
                formUrl: 'goform/group/overview',
                text: _('Overview'),
                component: sOverview.Screen,
              }, {
                id: 'apList',
                path: '/main/group/monitor/aps',
                formUrl: 'goform/group/aps',
                text: _('AP List'),
                component: sApList.Screen,
              }, {
                id: 'groupClient',
                path: '/main/group/monitor/user',
                formUrl: 'goform/group/client',
                text: _('Client List'),
                component: sUsers.Screen,
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
              //   childRoutes: [
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
          }, {
            id: 'map',
            isIndex: true,
            path: '/main/group/map',
            icon: 'map',
            text: _('Map'),
            indexRoute: { onEnter: (nextState, replace) => replace('/main/group/map/live') },
            childRoutes: [
              {
                id: 'liveMap',
                path: '/main/group/map/live',
                text: _('Live Map'),
                indexRoute: { onEnter: (nextState, replace) => replace('/main/group/map/live/list') },
                childRoutes: [
                  {
                    id: 'liveMap',
                    path: '/main/group/map/live/list',
                    text: _('Live Map'),
                    formUrl: 'goform/group/map/building',
                    isIndex: true,
                    component: sLiveMap.Screen,
                  }, {

                    id: 'buildMap',
                    path: '/main/group/map/live/(:id)',
                    text: _('AP Plan Map'),
                    formUrl: 'goform/group/map/apPlan',
                    component: sApPlanMap.Screen,
                    noNav: true,
                  },
                ],
              },
              // {
              //   id: 'heatMap',
              //   path: '/main/group/map/heat_map',
              //   formUrl: '/goform/heatMap',
              //   fetchUrl: '/goform/group/mapList',
              //   text: _('Heat Map'),
              //   component: sHeatMap.Screen,
              // }, {
              //   id: 'cientsTrace',
              //   path: '/main/group/map/cients_trace',
              //   formUrl: '/goform/cientsTrace',
              //   fetchUrl: '/goform/group/mapList',
              //   text: _('Cients Trace'),
              //   component: sClientsTrace.Screen,
              // },
            ],
          }, {
            id: 'wireless',
            isIndex: true,
            path: '/main/group/wireless',
            icon: 'wifi',
            text: _('Wireless'),
            indexRoute: { onEnter: (nextState, replace) => replace('/main/group/wireless/ssid') },
            childRoutes: [
              {
                id: 'ssidSettings',
                path: '/main/group/wireless/ssid',
                formUrl: 'goform/group/ssidSetting',
                text: _('SSID Settings'),
                component: sSsidSettings.Screen,
              }, {
                id: 'wirelessAcl',
                path: '/main/group/wireless/acl',
                formUrl: '/goform/group/wireless/acl',
                text: _('ACL'),
                component: sWirelessAcl.Screen,
              }, {
                id: 'smartRf',
                path: '/main/group/wireless/smart',
                formUrl: 'goform/group/smartRf',
                text: _('Smart RF'),
                component: sSmartRf.Screen,
              }, {
                id: 'timerPolicy',
                path: '/main/group/wireless/timer',
                formUrl: 'goform/group/timerPolicy',
                text: _('Scheduler'),
                component: sTimerPolicy.Screen,
              }, {
                id: 'wirelessSafePolicy',
                path: '/main/group/wireless/safe',
                formUrl: 'goform/group/timerPolicy',
                text: _('Safe Policy'),
                component: SharedComponents.TabContainer,
                indexRoute: {
                  onEnter: (nextState, replace) => replace('/main/group/wireless/safe/wips'),
                },
                childRoutes: [
                  {
                    id: 'wirelessWips',
                    path: '/main/group/wireless/safe/wips',
                    formUrl: 'goform/group/wips',
                    text: _('WIPS'),
                    component: sWips.Screen,
                  }, {
                    id: 'wirelessEndpointProtection',
                    path: '/main/group/wireless/safe/endpointProtection',
                    formUrl: 'goform/group/wireless/protection',
                    text: _('Terminal Protection'),
                    component: sEndpointProtection.Screen,
                  },
                ],
              },
            ],
          },
          // {
          //   id: 'report',
          //   isIndex: true,
          //   path: '/main/group/report',
          //   icon: 'file-text-o',
          //   text: _('Report'),
          //   indexRoute: { onEnter: (nextState, replace) => replace('/main/group/report/flow') },
          //   childRoutes: [
          //     {
          //       id: 'flowReport',
          //       path: '/main/group/report/flow',
          //       formUrl: 'goform/timerPolicy',
          //       text: _('Traffic Report'),
          //       component: sFlowReport.Screen,
          //     }, {
          //       id: 'businessReport',
          //       path: '/main/group/report/business',
          //       text: _('Business Report'),
          //       component: SharedComponents.TabContainer,
          //       indexRoute: {
          //         onEnter: (nextState, replace) => replace('/main/group/report/business/usersFlow'),
          //       },
          //       childRoutes: [
          //         {
          //           id: 'usersFlowAnalysis',
          //           path: '/main/group/report/business/usersFlow',
          //           formUrl: 'goform/usersFlowAnalysis',
          //           text: _('Users Flow Analysis'),
          //           component: sUsersAnalysis.Screen,
          //         // }, {
          //         //   id: 'informationPush',
          //         //   path: '/main/group/report/business/informationPush',
          //         //   formUrl: 'goform/informationPush',
          //         //   text: _('Information Push'),
          //         //   component: sInformationPush.Screen,
          //         // }, {
          //         //   id: 'preferencesAnalysis',
          //         //   path: '/main/group/report/business/preferencesAnalysis',
          //         //   formUrl: 'goform/PreferencesAnalysis',
          //         //   text: _('Analysis of Preferences'),
          //         //   component: sPreferencesAnalysis.Screen,
          //         },
          //       ],
          //     },
          //   ],
          // },
        ],
      }, {
        path: '/main/system',
        component: sMainAxc.Screen,
        icon: 'cogs',
        text: _('SYSTEM'),
        indexRoute: { onEnter: (nextState, replace) => replace('/main/system/status') },
        childRoutes: [
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
            indexRoute: {
              onEnter: (nextState, replace) => replace('/main/system/log/list'),
            },
            childRoutes: [
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
          // {
          //   id: 'SNPM',
          //   icon: 'exclamation-circle',
          //   formUrl: 'goform/system/snpm',
          //   path: '/main/system/SNPM',
          //   text: _('SNMP'),
          //   component: sSNMP.Screen,
          // },
          // {
          //   id: 'activeStandby',
          //   isIndex: true,
          //   formUrl: 'goform/system/activeStandby',
          //   path: '/main/system/activeStandby',
          //   icon: 'refresh',
          //   text: _('Backup Settings'),
          //   component: sActiveStandby.Screen,
          // // }, {
          // //   id: 'cluster',
          // //   isIndex: true,
          // //   path: '/main/system/cluster',
          // //   icon: 'server',
          // //   text: _('Custer Settings'),
          // //   component: sCluster.Screen,
          // },
          // {
          //   id: 'signatures',
          //   isIndex: true,
          //   path: '/main/system/signatures',
          //   formUrl: 'goform/system/signatures',
          //   icon: 'tasks',
          //   text: _('Signatures'),
          //   component: sSignatures.Screen,
          // },
          {
            id: 'License',
            isIndex: true,
            path: '/main/system/license',
            formUrl: 'goform/system/license',
            icon: 'file-text',
            text: _('License Management'),
            component: sLicense.Screen,
          }, {
            id: 'apMaintenance',
            isIndex: true,
            path: '/main/system/upgrade',
            icon: 'dot-circle-o ',
            text: _('AP Maintenance'),
            noTree: true,
            component: SharedComponents.TabContainer,
            indexRoute: {
              onEnter: (nextState, replace) => replace('/main/system/ap/base'),
            },
            childRoutes: [
              {
                id: 'apMaintenanceBase',
                path: '/main/system/ap/base',
                formUrl: 'goform/system/maintenance',
                text: _('Configuration'),
                component: sApMaintenance.Screen,
              }, {
                id: 'apsVersion',
                path: '/main/system/upgrade/aps',
                formUrl: 'goform/system/ap/version',
                text: _('AP Firmware'),
                component: sApVersion.Screen,
              }, {
                id: 'apModel',
                path: '/main/system/upgrade/apModel',
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
      }, {
        path: '/main/portal',
        component: sMainAxc.Screen,
        icon: 'road',
        text: _('AXILSPOT PORTAL'),
        indexRoute: { onEnter: (nextState, replace) => replace('/main/portal/overview') },
        childRoutes: [
          {
            id: 'openPortalOverview',
            icon: 'home',
            path: '/main/portal/overview',
            formUrl: getOpenPortalFormUrl('openPortal/overview'),
            mode: 'cors',
            text: _('Overview'),
            component: sOpenPortalOverview.Screen,
          }, {
            id: 'openPortalPortal',
            isIndex: true,
            path: '/main/portal/portal',
            icon: 'level-up',
            text: _('Portal'),
            indexRoute: {
              onEnter: (nextState, replace) => replace('/main/portal/portal/base'),
            },
            childRoutes: [
              {
                id: 'openPortalPortalBase',
                path: '/main/portal/portal/base',
                formUrl: getOpenPortalFormUrl('openPortal/base'),
                text: _('Base'),
                component: sOpenPortalBase.Screen,
              }, {
                id: 'openPortalPortalUrlParams',
                path: '/main/portal/portal/bas',
                formUrl: getOpenPortalFormUrl('openPortal/bas'),
                text: _('Bas'),
                component: sOpenPortalBas.Screen,
              }, {
                id: 'openPortalPortalUrlParams',
                path: '/main/portal/portal/url',
                formUrl: getOpenPortalFormUrl('openPortal/UrlParams'),
                text: _('Url Params'),
                component: sOpenPortalUrlParams.Screen,
              },
            ],
          }, {
            id: 'openPortalRadius',
            isIndex: true,
            path: '/main/portal/radius',
            icon: 'level-up',
            text: _('Radius'),
            indexRoute: {
              onEnter: (nextState, replace) => replace('/main/portal/radius/nas'),
            },
            childRoutes: [
              {
                id: 'openPortalRadiusNas',
                path: '/main/portal/radius/nas',
                formUrl: getOpenPortalFormUrl('openPortal/radius/nas'),
                text: _('NAS List'),
                mode: 'cors',
                component: sOpenPortalNas.Screen,
              }, {
                id: 'openPortalRadiusOnline',
                path: '/main/portal/radius/online',
                formUrl: getOpenPortalFormUrl('openPortal/radius/online'),
                text: _('Online List'),
                mode: 'cors',
                component: sOpenPortalOnline.Screen,
              }, {
                id: 'openPortalRadiusConnectLog',
                path: '/main/portal/radius/connectlog',
                formUrl: getOpenPortalFormUrl('openPortal/radius/linkRecordAll'),
                text: _('Connect Logs'),
                mode: 'cors',
                component: sOpenPortalConnectLog.Screen,
              },
            ],
          },
        ],
      }, {
        path: '/wizard',
        component: sWizard.Screen,
      },
    ],
  }, {
    path: '*',
    component: NotFound,
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

// Store
const stores = remoteActionMiddleware(
  combineReducers(reducers),

  // 支持 chrome 插件 Redux DevTools
  window.devToolsExtension ? window.devToolsExtension() : f => f,
);

const app = {
  reducers,
  routes,
  stores,
};

// 初始化app Config
stores.dispatch(appActions.initAppConfig(guiConfig));


export default app;


