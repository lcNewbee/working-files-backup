import { combineReducers } from 'redux';
import NotFound from 'shared/components/NotFound';
import remoteActionMiddleware from 'shared/utils/lib/remote_action_middleware';
import listInfoReducer from 'shared/reducers/list';
import settingsReducer from 'shared/reducers/settings';
import moment from 'moment';

// 公用 样式
import 'shared/scss/styles.scss';

// 产品配置
import guiConfig from './config.json';

// 多语言工具
const b28n = require('shared/b28n');
const cnCore = require('../lang/cn/core.json');
const cnAc = require('../lang/cn/ac.json');
const validateCn = require('../lang/cn/validate.json');
const langEn = require('../lang/en/core.json');

const bodyElem = document.getElementsByTagName('body')[0];

b28n.addDict(cnCore, 'cn');
b28n.addDict(cnAc, 'cn');
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

//
const sLogin = require('../../screens/App/screens/Login');
const sWizard = require('../../screens/App/screens/Wizard');

//
const sMainAxc = require('../../screens/App/screens/MainAxc');

/**
 * 网络设置
 */
// VLAN 设置
const sInterfaces = require('../../screens/App/screens/MainAxc/screens/VLAN/screens/Interfaces');
const sVlanAaa = require('../../screens/App/screens/MainAxc/screens/VLAN/screens/Aaa');
const sVlanAcl = require('../../screens/App/screens/MainAxc/screens/VLAN/screens/Acl');
const sVlanNat = require('../../screens/App/screens/MainAxc/screens/VLAN/screens/Nat');
const sVlanDhcp = require('../../screens/App/screens/MainAxc/screens/VLAN/screens/Dhcp');
const sRoutes = require('../../screens/App/screens/MainAxc/screens/Routes');

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
const sSafePolicy =
    require('../../screens/App/screens/MainAxc/screens/WLAN/screens/SafePolicy');
const sFlowReport =
    require('../../screens/App/screens/MainAxc/screens/Report/screens/FlowReport');
const sBusinessReport =
    require('../../screens/App/screens/MainAxc/screens/Report/screens/BusinessReport');

/**
 * 系统管理
 */
const sSystemStatus =
    require('../../screens/App/screens/MainAxc/screens/System/screens/SystemStatus');
const sSystemAdmin =
    require('../../screens/App/screens/MainAxc/screens/System/screens/SystemAdmin');
const sAlarmEvents =
    require('../../screens/App/screens/MainAxc/screens/System/screens/AlarmEvents');

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
        indexRoute: { onEnter: (nextState, replace) => replace('/main/network/vlan') },
        childRoutes: [
          {
            id: 'status',
            isIndex: true,
            path: '/main/network/vlan',
            icon: 'list',
            text: _('VLAN'),
            indexRoute: {
              onEnter: (nextState, replace) => replace('/main/network/vlan/interface'),
            },
            childRoutes: [
              {
                id: 'interface',
                path: '/main/network/vlan/interface',
                text: _('Interface Settings'),
                component: sInterfaces.Screen,
              }, {
                id: 'vlanDhcp',
                path: '/main/network/vlan/dhcp',
                text: _('DHCP Settings'),
                component: sVlanDhcp.Screen,
              }, {
                id: 'vlanNat',
                path: '/main/network/vlan/nat',
                text: _('NAT Settings'),
                component: sVlanNat.Screen,
              }, {
                id: 'vlanAcl',
                path: '/main/network/vlan/acl',
                text: _('Access Control'),
                component: sVlanAcl.Screen,
              }, {
                id: 'vlanAaa',
                path: '/main/network/vlan/aaa',
                text: _('AAA Settings'),
                component: sVlanAaa.Screen,
              },
            ],
          }, {
            id: 'routes',
            path: '/main/network/routes',
            text: _('Routes Settings'),
            icon: 'map-signs',
            component: sRoutes.Screen,
          }, {
            id: 'port',
            path: '/main/network/port',
            icon: 'th',
            text: _('Port Settings'),
          }, {
            id: 'portal',
            icon: 'copy',
            path: '/main/network/portal',
            text: _('Portal Policy'),
          }, {
            id: 'radius',
            icon: 'files-o',
            path: '/main/network/radius',
            text: _('Radius Template'),
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
                formUrl: '/goform/getApDevInfo',
                text: _('Access Point Status'),
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
              }, {
                id: 'rf',
                path: '/main/group/map/rf',
                text: _('RF'),
              }, {
                id: 'heat',
                path: '/main/group/map/heat',
                text: _('Heat Map'),
              }, {
                id: 'cientsTrace',
                path: '/main/group/map/trace',
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
                component: sSafePolicy,
                indexRoute: {
                  onEnter: (nextState, replace) => replace('/main/group/wireless/safe/wips'),
                },
                childRoutes: [
                  {
                    id: 'wirelessWips',
                    path: '/main/group/wireless/safe/wips',
                    formUrl: '/goform/timerPolicy',
                    text: _('WIPS'),
                    component: sFlowReport.Screen,
                  }, {
                    id: 'wirelessEndpointProtection',
                    path: '/main/group/wireless/safe/endpointProtection',
                    text: _('Endpoint Protection'),
                    component: sFlowReport.Screen,
                  }, {
                    id: 'wirelessIsolationPolicy',
                    path: '/main/group/wireless/safe/isolation',
                    text: _('Isolation Policy'),
                    component: sFlowReport.Screen,
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
              },
            ],
          }, {
            id: 'system',
            isIndex: true,
            path: '/main/group/system',
            icon: 'cogs',
            text: _('System'),
            indexRoute: { onEnter: (nextState, replace) => replace('/main/group/system/upgrade') },
            childRoutes: [
              {
                id: 'upgrade',
                path: '/main/group/system/upgrade',
                text: _('System Upgrade'),
              }, {
                id: 'apCorrelation',
                path: '/main/group/system/correlation',
                text: _('AP Correlation'),
              }, {
                id: 'apLogs',
                path: '/main/group/system/logs',
                text: _('AP Logs'),
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
            id: 'acUpgrade',
            isIndex: true,
            path: '/main/system/upgrade',
            icon: 'level-up',
            text: _('AC Upgrade'),
          }, {
            id: 'admin',
            isIndex: true,
            path: '/main/system/admin',
            icon: 'user',
            text: _('Admin Settings'),
            component: sSystemAdmin.Screen,
          }, {
            id: 'License',
            isIndex: true,
            path: '/main/system/license',
            icon: 'file-text',
            text: _('License'),
          }, {
            id: 'systemMonitor',
            isIndex: true,
            path: '/main/system/monitor',
            icon: 'video-camera',
            text: _('System Monitor'),
          }, {
            id: 'activeStandby',
            isIndex: true,
            path: '/main/system/activeStandby',
            icon: 'refresh',
            text: _('Active-Standby'),
          }, {
            id: 'cluster',
            isIndex: true,
            path: '/main/system/cluster',
            icon: 'server',
            text: _('Custer Settings'),
          }, {
            id: 'signatures',
            isIndex: true,
            path: '/main/system/signatures',
            icon: 'tasks',
            text: _('Signatures'),
          }, {
            id: 'alarmStatus',
            icon: 'exclamation-circle',
            path: '/main/system/alarm',
            text: _('Alarm Events'),
            component: sAlarmEvents.Screen,
          },
        ],
      }, {
        path: '/wizard',
        component: sWizard.Screen,
      },
    ],
  }, {
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

  // product comstom reducers
  login: sLogin.login,
  mainAxc: sMainAxc.reducer,
  interfaces: sInterfaces.reducer,
  dhcpAdressPool: sVlanDhcp.reducer,

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

