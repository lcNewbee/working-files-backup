import b28n from 'shared/b28n';
import { combineReducers } from 'redux';
import NotFound from 'shared/components/NotFound';
import remoteActionMiddleware from 'shared/utils/lib/remote_action_middleware';
import listInfoReducer from 'shared/reducers/list';
import settingsReducer from 'shared/reducers/settings';
import propertiesReducer from 'shared/reducers/properties';
import moment from 'moment';

// 公用 样式
import 'shared/scss/styles.scss';

// 公用组件

// 产品配置
import guiConfig from './config.json';

// 多语言处理
const cnCore = require('../lang/cn/core.json');
const cnAxc = require('../lang/cn/axc.json');
const validateCn = require('../lang/cn/validate.json');
const langEn = require('../lang/en/core.json');

const bodyElem = document.getElementsByTagName('body')[0];

b28n.addDict(cnCore, 'cn');
b28n.addDict(cnAxc, 'cn');
b28n.addDict(validateCn, 'cn');
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

bodyElem.className = `${bodyElem.className} ${b28n.getLang()}`;

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
const sNetworkVlan = require('../../screens/App/screens/MainAxc/screens/Network/screens/VLAN');
const sInterfaces = require('../../screens/App/screens/MainAxc/screens/Network/screens/Interfaces');
const sNetworkAaa = require('../../screens/App/screens/MainAxc/screens/Network/screens/AAA');
const sNetworkDhcp = require('../../screens/App/screens/MainAxc/screens/Network/screens/DHCP');
const sNetworkRoutes = require('../../screens/App/screens/MainAxc/screens/Network/screens/Routes');
const sNetworkNat = require('../../screens/App/screens/MainAxc/screens/Network/screens/Nat');
const sNetworkAcl = require('../../screens/App/screens/MainAxc/screens/Network/screens/ACL');
const sNetworkPort = require('../../screens/App/screens/MainAxc/screens/Network/screens/Port');
const sNetworkPortal = require('../../screens/App/screens/MainAxc/screens/Network/screens/PortalPolicy');
const sRaduisTemplate = require('../../screens/App/screens/MainAxc/screens/Network/screens/RadiusTemplate');
/**
 * AP组管理
 */
const sUsers = require('../../screens/App/screens/MainAxc/screens/Monitor/screens/Users');
const sFlowStatus = require('../../screens/App/screens/MainAxc/screens/Monitor/screens/FlowStatus');
const sSsidStatus = require('../../screens/App/screens/MainAxc/screens/Monitor/screens/SsidStatus');
const sApList = require('../../screens/App/screens/MainAxc/screens/Monitor/screens/ApList');
const sSafeStatus = require('../../screens/App/screens/MainAxc/screens/Monitor/screens/SafeStatus');
const sBlacklist = require('../../screens/App/screens/MainAxc/screens/WLAN/screens/Blacklist');
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
const sIsolationPolicy =
  require('../../screens/App/screens/MainAxc/screens/WLAN/screens/SafePolicy/screens/IsolationPolicy');
const sFlowReport =
    require('../../screens/App/screens/MainAxc/screens/Report/screens/FlowReport');
const sUsersAnalysis =
    require('../../screens/App/screens/MainAxc/screens/Report/screens/BusinessReport/screens/UsersAnalysis');
const sPreferencesAnalysis =
    require('../../screens/App/screens/MainAxc/screens/Report/screens/BusinessReport/screens/PreferencesAnalysis');
const sInformationPush =
    require('../../screens/App/screens/MainAxc/screens/Report/screens/BusinessReport/screens/InformationPush');
const sLiveMap = require('../../screens/App/screens/MainAxc/screens/Map/screens/LiveMap');
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
const sSystemLogSettings =
    require('../../screens/App/screens/MainAxc/screens/System/screens/SystemLog/screens/LogSettings');
const sSNMP =
    require('../../screens/App/screens/MainAxc/screens/System/screens/SNMP');
const sActiveStandby =
    require('../../screens/App/screens/MainAxc/screens/System/screens/ActiveStandby');
const sSignatures =
    require('../../screens/App/screens/MainAxc/screens/System/screens/Signatures');
const sVersionMaintenance =
    require('../../screens/App/screens/MainAxc/screens/System/screens/VersionMaintenance');
const sSystemMaintenance =
    require('../../screens/App/screens/MainAxc/screens/System/screens/SystemMaintenance');

const routes = [
  {
    path: '/',
    component: App.Screen,
    indexRoute: { component: sLogin.Screen },
    childRoutes: [
      {
        path: '/main/network',
        component: sMainAxc.Screen,
        text: _('NETWORK'),
        indexRoute: { onEnter: (nextState, replace) => replace('/main/network/interface') },
        childRoutes: [
          // {
          //   id: 'networkVlan',
          //   isIndex: true,
          //   path: '/main/network/vlan',
          //   formUrl: '/goform/networkVlan',
          //   icon: 'road',
          //   text: _('VLAN'),
          //   component: sNetworkVlan.Screen,
          // },
          {
            id: 'networkInterface',
            icon: 'th-large',
            path: '/main/network/interface',
            formUrl: '/goform/networkInterface',
            text: _('Interface Settings'),
            component: sInterfaces.Screen,
          }, {
            id: 'networkDhcp',
            icon: 'random',
            path: '/main/network/dhcp',
            formUrl: '/goform/networkDhcp',
            text: _('DHCP Settings'),
            component: sNetworkDhcp.Screen,
          }, {
            id: 'networkNat',
            icon: 'exchange',
            path: '/main/network/nat',
            text: _('NAT Settings'),
            formUrl: '/goform/networkNat',
            component: sNetworkNat.Screen,
          }, {
            id: 'networkAcl',
            icon: 'ban',
            path: '/main/network/acl',
            text: _('Access Control'),
            formUrl: '/goform/networkAcl',
            component: sNetworkAcl.Screen,
          }, {
            id: 'staticRoutes',
            path: '/main/network/static_routes',
            text: _('Routes Settings'),
            icon: 'map-signs',
            formUrl: '/goform/staticRoutes',
            component: sNetworkRoutes.Screen,
          }, {
            id: 'networkPort',
            path: '/main/network/port',
            icon: 'th',
            formUrl: '/goform/networkPort',
            text: _('Port Settings'),
            component: sNetworkPort.Screen,
          }, {
            id: 'radiusTemplate',
            icon: 'clone',
            path: '/main/network/radius_template',
            formUrl: '/goform/radiusTemplate',
            text: _('Radius Template'),
            component: sRaduisTemplate.Screen,
          }, {
            id: 'networkAaa',
            icon: 'lock',
            path: '/main/network/aaa',
            fetchUrl: '/goform/vlanAaa',
            saveUrl: '/goform/vlanAaa',
            text: _('AAA Settings'),
            component: sNetworkAaa.Screen,
          }, {
            id: 'networkPortal',
            icon: 'copy',
            path: '/main/network/portal',
            formUrl: '/goform/networkPortal',
            text: _('Portal Policy'),
            component: sNetworkPortal.Screen,
          },
        ],
      }, {
        path: '/main/group',
        component: sMainAxc.Screen,
        text: _('AP GROUP'),
        indexRoute: { onEnter: (nextState, replace) => replace('/main/group/monitor') },
        childRoutes: [
          {
            id: 'monitor',
            isIndex: true,
            path: '/main/group/monitor',
            icon: 'pie-chart',
            text: _('Monitor'),
            indexRoute: { onEnter: (nextState, replace) => replace('/main/group/monitor/user') },
            childRoutes: [
              {
                id: 'user',
                path: '/main/group/monitor/user',
                text: _('User'),
                component: sUsers.Screen,
              }, {
                id: 'flow',
                path: '/main/group/monitor/flow',
                formUrl: '/goform/flowList',
                text: _('Flow'),
                component: sFlowStatus.Screen,
              }, {
                id: 'ssidStatus',
                path: '/main/group/monitor/ssid',
                formUrl: '/goform/ssidList',
                text: _('SSID Status'),
                component: sSsidStatus.Screen,
              }, {
                id: 'apList',
                path: '/main/group/monitor/aps',
                formUrl: '/goform/apList',
                text: _('Access Point List'),
                component: sApList.Screen,
              }, {
                id: 'safeStatus',
                path: '/main/group/monitor/safe',
                text: _('Safe Status'),
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
                id: 'live',
                path: '/main/group/map/live',
                text: _('Live Map'),
                formUrl: '/goform/liveMap',
                component: sLiveMap.Screen,
              }, {
                id: 'rfPlan',
                path: '/main/group/map/rf_plan',
                formUrl: '/goform/rfPlan',
                text: _('RF Plan'),
              }, {
                id: 'heatMap',
                path: '/main/group/map/heat_map',
                formUrl: '/goform/heatMap',
                text: _('Heat Map'),
              }, {
                id: 'cientsTrace',
                path: '/main/group/map/cients_trace',
                formUrl: '/goform/cientsTrace',
                text: _('Cients Trace'),
              },
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
                formUrl: '/goform/ssidSettingList',
                text: _('SSID Settings'),
                component: sSsidSettings.Screen,
              }, {
                id: 'blacklist',
                path: '/main/group/wireless/acl',
                formUrl: '/goform/getClientInfo',
                text: _('Blacklist'),
                component: sBlacklist.Screen,
              }, {
                id: 'smartRf',
                path: '/main/group/wireless/smart',
                formUrl: '/goform/smartRf',
                text: _('Smart RF'),
                component: sSmartRf.Screen,
              }, {
                id: 'timerPolicy',
                path: '/main/group/wireless/timer',
                formUrl: '/goform/timerPolicy',
                text: _('Timer Policy'),
                component: sTimerPolicy.Screen,
              }, {
                id: 'wirelessSafePolicy',
                path: '/main/group/wireless/safe',
                formUrl: '/goform/timerPolicy',
                text: _('Wireless Safe Policy'),
                component: SharedComponents.TabContainer,
                indexRoute: {
                  onEnter: (nextState, replace) => replace('/main/group/wireless/safe/wips'),
                },
                childRoutes: [
                  {
                    id: 'wirelessWips',
                    path: '/main/group/wireless/safe/wips',
                    formUrl: '/goform/wips',
                    text: _('WIPS'),
                    component: sWips.Screen,
                  }, {
                    id: 'wirelessEndpointProtection',
                    path: '/main/group/wireless/safe/endpointProtection',
                    formUrl: '/goform/wirelessEndpointProtection',
                    text: _('Endpoint Protection'),
                    component: sEndpointProtection.Screen,
                  }, {
                    id: 'wirelessIsolationPolicy',
                    path: '/main/group/wireless/safe/isolation',
                    formUrl: '/goform/wirelessIsolationPolicy',
                    text: _('Isolation Policy'),
                    component: sIsolationPolicy.Screen,
                  },
                ],
              },
            ],
          }, {
            id: 'report',
            isIndex: true,
            path: '/main/group/report',
            icon: 'file-text-o',
            text: _('Report'),
            indexRoute: { onEnter: (nextState, replace) => replace('/main/group/report/flow') },
            childRoutes: [
              {
                id: 'flowReport',
                path: '/main/group/report/flow',
                formUrl: '/goform/timerPolicy',
                text: _('Flow Report'),
                component: sFlowReport.Screen,
              }, {
                id: 'businessReport',
                path: '/main/group/report/business',
                text: _('Business Report'),
                component: SharedComponents.TabContainer,
                indexRoute: {
                  onEnter: (nextState, replace) => replace('/main/group/report/business/usersFlow'),
                },
                childRoutes: [
                  {
                    id: 'usersFlowAnalysis',
                    path: '/main/group/report/business/usersFlow',
                    formUrl: '/goform/usersFlowAnalysis',
                    text: _('Users Flow Analysis'),
                    component: sUsersAnalysis.Screen,
                  }, {
                    id: 'informationPush',
                    path: '/main/group/report/business/informationPush',
                    formUrl: '/goform/informationPush',
                    text: _('Information Push'),
                    component: sInformationPush.Screen,
                  }, {
                    id: 'preferencesAnalysis',
                    path: '/main/group/report/business/preferencesAnalysis',
                    formUrl: '/goform/PreferencesAnalysis',
                    text: _('Analysis of Preferences'),
                    component: sPreferencesAnalysis.Screen,
                  },
                ],
              },
            ],
          },
        ],
      }, {
        path: '/main/system',
        component: sMainAxc.Screen,
        text: _('SYSTEM'),
        indexRoute: { onEnter: (nextState, replace) => replace('/main/system/status') },
        childRoutes: [
          {
            id: 'systemStatus',
            icon: 'area-chart',
            path: '/main/system/status',
            text: _('System Status'),
            component: sSystemStatus.Screen,
          }, {
            id: 'alarmStatus',
            icon: 'exclamation-circle',
            path: '/main/system/alarm',
            text: _('Alarm Events'),
            component: sAlarmEvents.Screen,
          }, {
            id: 'systemLog',
            icon: 'file-text-o',
            path: '/main/system/log',
            text: _('Log Management'),
            noTree: true,
            component: SharedComponents.TabContainer,
            indexRoute: {
              onEnter: (nextState, replace) => replace('/main/system/log/list'),
            },
            childRoutes: [
              {
                id: 'systemLog',
                path: '/main/system/log/list',
                fetchUrl: '/goform/getSystemLog',
                formUrl: '/goform/saveSystemLog',
                text: _('Log List'),
                component: sSystemLogList.Screen,
              }, {
                id: 'systemLog',
                path: '/main/system/log/settings',
                fetchUrl: '/goform/getSystemLog',
                formUrl: '/goform/saveSystemLog',
                text: _('Log Settings'),
                component: sSystemLogSettings.Screen,
              },
            ],
          }, {
            id: 'SNPM',
            icon: 'exclamation-circle',
            path: '/main/system/SNPM',
            text: _('SNMP'),
            component: sSNMP.Screen,
          }, {
            id: 'activeStandby',
            isIndex: true,
            path: '/main/system/activeStandby',
            icon: 'refresh',
            text: _('Active-Standby'),
            component: sActiveStandby.Screen,
          // }, {
          //   id: 'cluster',
          //   isIndex: true,
          //   path: '/main/system/cluster',
          //   icon: 'server',
          //   text: _('Custer Settings'),
          //   component: sCluster.Screen,
          }, {
            id: 'signatures',
            isIndex: true,
            path: '/main/system/signatures',
            fetchUrl: '/goform/signatures',
            saveUrl: '/goform/signatures',
            icon: 'tasks',
            text: _('Signatures'),
            component: sSignatures.Screen,
          }, {
            id: 'License',
            isIndex: true,
            path: '/main/system/license',
            icon: 'file-text',
            text: _('Manage License'),
            component: sLicense.Screen,
          }, {
            id: 'acUpgrade',
            isIndex: true,
            path: '/main/system/upgrade',
            icon: 'level-up',
            text: _('Version Maintenance'),
            noTree: true,
            component: SharedComponents.TabContainer,
            indexRoute: {
              onEnter: (nextState, replace) => replace('/main/system/upgrade/axc'),
            },
            childRoutes: [
              {
                id: 'axcVersion',
                path: '/main/system/upgrade/axc',
                fetchUrl: '/goform/axcVersion',
                formUrl: '/goform/axcVersion',
                text: _('AC Version'),
                component: sVersionMaintenance.Screen,
              }, {
                id: 'apsVersion',
                path: '/main/system/upgrade/aps',
                fetchUrl: '/goform/apsVersion',
                formUrl: '/goform/apsVersion',
                text: _('Access Point Version'),
                component: sSystemLogSettings.Screen,
              },
            ],
          }, {
            id: 'maintenance',
            isIndex: true,
            path: '/main/system/maintenance',
            icon: 'cog',
            text: _('System Maintenance'),
            component: sSystemMaintenance.Screen,
          }, {
            id: 'admin',
            isIndex: true,
            path: '/main/system/admin',
            fetchUrl: '/goform/admins',
            saveUrl: '/goform/admins',
            icon: 'user',
            text: _('Admin Settings'),
            component: sSystemAdmin.Screen,
          },
        ],
      }, {
        path: '/wizard',
        component: sWizard.Screen,
      },
    ],
  },

  // 兼容登录跳转
  {
    path: '/main/status',
    indexRoute: { onEnter: (nextState, replace) => replace('/main/network') },
  }, {
    path: '*',
    component: NotFound,
  },
];


// 配置模块页面 store
const reducers = {
  // shared reducers
  app: App.app,
  list: listInfoReducer,
  settings: settingsReducer,
  properties: propertiesReducer,

  // product comstom reducers
  login: sLogin.login,
  mainAxc: sMainAxc.reducer,
  interfaces: sInterfaces.reducer,
  dhcpAdressPool: sNetworkDhcp.reducer,

  // ap组管理
  users: sUsers.reducer,
  safeStatus: sSafeStatus.reducer,
  system: sSystemStatus.reducer,
  admin: sSystemAdmin.reducer,
  events: sAlarmEvents.reducer,
};

// Store
const stores = remoteActionMiddleware(
  combineReducers(reducers),

  // 支持 chrome 插件 Redux DevTools
  window.devToolsExtension ? window.devToolsExtension() : f => f
);

const app = {
  reducers,
  routes,
  stores,
};


export default app;

