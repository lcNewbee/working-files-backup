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
const langEn = require('../lang/en/core.json');

const bodyElem = document.getElementsByTagName('body')[0];

b28n.addDict(cnCore, 'cn');
b28n.addDict(cnAxc, 'cn');
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
// const sNetworkVlan = require('../../screens/App/screens/MainAxc/screens/Network/screens/VLAN');
const sInterfaces = require('../../screens/App/screens/MainAxc/screens/Network/screens/Interfaces');
const sNetworkPort = require('../../screens/App/screens/MainAxc/screens/Network/screens/Port');
// const sPortalTemplate =

/**
 * AP组管理
 */
const sOverview = require('../../screens/App/screens/MainAxc/screens/Monitor/screens/Overview');
const sClientList = require('../../screens/App/screens/MainAxc/screens/Monitor/screens/ClientList');
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

const sLiveMap = require('../../screens/App/screens/MainAxc/screens/Map/screens/LiveMap');
const sApPlanMap =
    require('../../screens/App/screens/MainAxc/screens/Map/screens/ApPlanMap');

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


const funcConfig = {
  networkNat: {
    listNotIds: [
      'ifname',
    ],
  },
  ssidSettings: {
    listNotIds: [
      'mandatorydomain',
      'vlanId',
    ],
  },
};

const routes = [
  {
    path: '/',
    component: App.Screen,
    formUrl: 'goform/axcInfo',
    mainPath: '/main/group/monitor/overview',
    indexRoute: { component: sLogin.Screen },
    routes: [
      {
        path: '/main/network',
        component: sMainAxc.Screen,
        icon: 'sphere',
        text: _('Network '),
        indexRoute: { onEnter: (nextState, replace) => replace('/main/network/interface') },
        routes: [
          {
            id: 'networkInterface',
            icon: 'th',
            path: '/main/network/interface',
            formUrl: 'goform/network/interface',
            text: _('Interfaces'),
            component: sInterfaces.Screen,
          },
          {
            id: 'networkPort',
            path: '/main/network/port',
            icon: 'th-large',
            formUrl: '/goform/network/port',
            text: _('Ports'),
            component: sNetworkPort.Screen,
          },
        ],
      }, {
        path: '/main/group',
        component: sMainAxc.Screen,
        icon: 'group',
        text: _('AP Groups '),
        indexRoute: { onEnter: (nextState, replace) => replace('/main/group/monitor') },
        routes: [
          {
            id: 'monitor',
            isIndex: true,
            path: '/main/group/monitor',
            icon: 'pie-chart',
            text: _('Monitor'),
            indexRoute: { onEnter: (nextState, replace) => replace('/main/group/monitor/overview') },
            routes: [
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
                component: sClientList.Screen,
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
          }, {
            id: 'map',
            isIndex: true,
            path: '/main/group/map',
            icon: 'map',
            text: _('Map'),
            indexRoute: { onEnter: (nextState, replace) => replace('/main/group/map/live') },
            routes: [
              {
                id: 'liveMap',
                path: '/main/group/map/live',
                text: _('Live Map'),
                indexRoute: { onEnter: (nextState, replace) => replace('/main/group/map/live/list') },
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
                    path: '/main/group/map/live/(:id)',
                    text: _('AP Plan Map'),
                    formUrl: 'goform/group/map/apPlan',
                    component: sApPlanMap.Screen,
                    noNav: true,
                  },
                ],
              },
            ],
          }, {
            id: 'wireless',
            isIndex: true,
            path: '/main/group/wireless',
            icon: 'wifi',
            text: _('Wireless'),
            indexRoute: { onEnter: (nextState, replace) => replace('/main/group/wireless/ssid') },
            routes: [
              {
                id: 'ssidSettings',
                path: '/main/group/wireless/ssid',
                formUrl: 'goform/group/ssidSetting',
                text: _('SSID Settings'),
                component: sSsidSettings.Screen,
                funcConfig: funcConfig.ssidSettings,
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
                routes: [
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
        ],
      }, {
        path: '/main/system',
        component: sMainAxc.Screen,
        icon: 'cogs',
        text: _('System '),
        indexRoute: { onEnter: (nextState, replace) => replace('/main/system/status') },
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
            text: _('Log Management'),
            noTree: true,
            component: SharedComponents.TabContainer,
            indexRoute: {
              onEnter: (nextState, replace) => replace('/main/system/log/list'),
            },
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
            text: _('License'),
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
            routes: [
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
      },
      // {
      //   path: '/main/portal',
      //   component: sMainAxc.Screen,
      //   icon: 'road',
      //   text: _('OPEN PORTAL'),
      //   indexRoute: { onEnter: (nextState, replace) => replace('/main/portal/overview') },
      //   routes: [
      //     {
      //       id: 'overview',
      //       icon: 'home',
      //       path: '/main/portal/overview',
      //       formUrl: 'goform/group/overview',
      //       text: _('Overview'),
      //       component: sOverview.Screen,
      //     },
      //   ],
      // },
      {
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

const app = {
  reducers,
  routes,
  appConfig: guiConfig,
};


export default app;

