import b28n from 'shared/b28n';
import stringUtils from 'shared/utils/lib/string';
import moment from 'moment';
import { reducer as toastrReducer } from 'react-redux-toastr';

// 公用 样式
import 'shared/scss/styles.scss';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';

// 产品配置
import guiConfig from './config.json';

// 多语言处理
const cnCore = require('../../lang/cn/core.json');
const cnAxc = require('../../lang/cn/axc.json');
const cnPortal = require('../../lang/cn/portal.json');
const langEn = require('../../lang/en/core.json');

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

// m
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
const sSsidSettings =
    require('../../screens/MainAxc/screens/WLAN/screens/SsidSettings');
const sSmartRf =
    require('../../screens/MainAxc/screens/WLAN/screens/SmartRf');
const sTimerPolicy =
    require('../../screens/MainAxc/screens/WLAN/screens/TimerPolicy');
const sWips =
    require('../../screens/MainAxc/screens/WLAN/screens/SafePolicy/screens/Wips');
const sEndpointProtection =
  require('../../screens/MainAxc/screens/WLAN/screens/SafePolicy/screens/EndpointProtection');

const sDubiousClient = require('../../screens/MainAxc/screens/DubiousClient');
const sLiveMap = require('../../screens/MainAxc/screens/Map/screens/LiveMap');
const sApPlanMap =
    require('../../screens/MainAxc/screens/Map/screens/ApPlanMap');
const sOrbitTrace = require('../../screens/MainAxc/screens/Map/screens/OrbitTrace');
const sAlarmMap = require('../../screens/MainAxc/screens/Map/screens/AlarmMap');
const sClientsTraceList = require('../../screens/MainAxc/screens/Map/screens/ClientsTrace');
const sClientsTraceSettings = require('../../screens/MainAxc/screens/Map/screens/ClientsTrace/Settings');
const sHeatMap = require('../../screens/MainAxc/screens/Map/screens/HeatMap');
const sMapPiont = require('../../screens/MainAxc/screens/Map/screens/Piont');

/**
 * 系统管理
 */
const cSystem = require('../../screens/MainAxc/containers/System');
const sSystemStatus =
    require('../../screens/MainAxc/screens/System/screens/SystemStatus');
const sSystemAdmin =
    require('../../screens/MainAxc/screens/System/screens/SystemAdmin');
const sAlarmEvents =
    require('../../screens/MainAxc/screens/System/screens/AlarmEvents');
const sLicense =
    require('../../screens/MainAxc/screens/System/screens/License');
const sSystemLogList =
    require('../../screens/MainAxc/screens/System/screens/SystemLog/screens/LogList');
const sSystemLogMaintenance =
    require('../../screens/MainAxc/screens/System/screens/SystemLog/screens/logMaintenance');
const sApVersion =
    require('../../screens/MainAxc/screens/System/screens/ApVersion');
const sApMaintenance =
    require('../../screens/MainAxc/screens/System/screens/ApMaintenance');
const sApModel =
    require('../../screens/MainAxc/screens/System/screens/ApModel');
const sAcMaintenance =
    require('../../screens/MainAxc/screens/System/screens/AcMaintenance');
const sNetworkTimeProtocol =
    require('../../screens/MainAxc/screens/System/screens/NetworkTimeProtocol');


const routes = [
  {
    id: 'root',
    path: '/',
    component: app.Screen,
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
            text: __('Network '),
            component: cNetwork.Screen,
            indexPath: '/main/network/interface',
            routes: [
              {
                id: 'networkInterface',
                icon: 'th',
                path: '/main/network/interface',
                formUrl: 'goform/network/interface',
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
                    formUrl: 'goform/network/dhcp/service/list',
                    text: __('DHCP List'),
                    component: sDhcpList.Screen,
                  }, {
                    id: 'dhcpRelay',
                    path: '/main/network/dhcp/relay',
                    formUrl: 'goform/network/dhcp/relay',
                    text: __('DHCP Relay'),
                    component: sDhcpRelay.Screen,
                  },
                ],
              }, {
                id: 'networkNat',
                icon: 'exchange',
                path: '/main/network/nat',
                text: __('NAT'),
                formUrl: 'goform/network/nat',
                component: sNetworkNat.Screen,
              },
              {
                id: 'staticRoutes',
                path: '/main/network/static_routes',
                text: __('Routes'),
                icon: 'map-signs',
                formUrl: 'goform/network/route',
                component: sNetworkRoutes.Screen,
              }, {
                id: 'networkPort',
                path: '/main/network/port',
                icon: 'th-large',
                formUrl: '/goform/network/port',
                text: __('Ports'),
                component: sNetworkPort.Screen,
              },
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
                    formUrl: 'goform/group/overview',
                    text: __('Overview'),
                    component: sOverview.Screen,
                  },
                  {
                    id: 'ssidStatus',
                    path: '/main/group/monitor/ssid',
                    formUrl: 'goform/group/ssid',
                    text: __('SSID Status'),
                    component: sSsidStatus.Screen,
                  }, {
                    id: 'safeStatus',
                    path: '/main/group/monitor/safe',
                    formUrl: 'goform/group/safeStatus',
                    text: __('Secure State'),
                    component: sSafeStatus.Screen,
                  },
                ],
              },
              {
                id: 'apList',
                icon: 'bullseye',
                path: '/main/group/aps',
                formUrl: 'goform/group/aps',
                text: __('AP List'),
                component: sApList.Screen,
              }, {
                id: 'groupClient',
                icon: 'desktop',
                path: '/main/group/user',
                formUrl: 'goform/group/client',
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
                    formUrl: 'goform/group/ssidSetting',
                    text: __('SSID Settings'),
                    component: sSsidSettings.Screen,
                  }, {
                    id: 'smartRf',
                    path: '/main/group/wireless/smart',
                    formUrl: 'goform/group/smartRf',
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
                    path: '/main/group/map/live/list',
                    text: __('Live Map'),
                    formUrl: 'goform/group/map/building',
                    isIndex: true,
                    component: sLiveMap.Screen,
                  }, {

                    id: 'buildMap',
                    path: '/main/group/map/building/:id',
                    text: __('AP Plan Map'),
                    formUrl: 'goform/group/map/apPlan',
                    component: sApPlanMap.Screen,
                    noNav: true,
                  },
                  {
                    id: 'heatMap',
                    path: '/main/group/map/heat_map',
                    formUrl: 'goform/group/map/heatmap',
                    fetchUrl: 'goform/group/map/heatmap',
                    text: __('Heat Map'),
                    component: sHeatMap.Screen,
                  },
                  {
                    id: 'orbitTrace',
                    path: '/main/group/map/orbittrace',
                    formUrl: '/goform/group/map/orbittrace',
                    fetchUrl: '/goform/group/map/orbittrace',
                    text: __('Client Path Analysis'),
                    component: sOrbitTrace.Screen,
                  },
                  {
                    id: 'point',
                    path: '/main/group/map/point',
                    noNav: true,
                    formUrl: '/goform/group/map/alarmmap',
                    component: sMapPiont.Screen,
                  },
                  {
                    id: 'dubiousClient',
                    path: '/main/group/map/dubious',
                    formUrl: '/goform/group/map/dubious',
                    text: __('Dubious Client'),
                    component: sDubiousClient.Screen,
                  },
                  {
                    id: 'alarmmap',
                    path: '/main/group/map/alarmmap',
                    formUrl: '/goform/group/map/alarmmap',
                    fetchUrl: '/goform/group/map/alarmmap',
                    text: __('Alarm Map'),
                    component: sAlarmMap.Screen,
                  },
                  {
                    id: 'cientsTrace',
                    path: '/main/group/map/clients_trace',
                    text: __('Clients Statistics'),
                    // icon: 'bar-chart',
                    noTree: true,
                    component: SharedComponents.TabContainer,
                    routes: [
                      {
                        id: 'clientsTrace',
                        path: '/main/group/map/clients_trace/list',
                        formUrl: '/goform/group/map/clients_trace',
                        text: __('Clients Statistics'),
                        component: sClientsTraceList.Screen,
                      }, {
                        id: 'clientsTrace',
                        path: '/main/group/map/clients_trace/settings',
                        formUrl: 'goform/group/map/clients_trace',
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
                formUrl: '/goform/group/wireless/acl',
                text: __('ACL'),
                component: sWirelessAcl.Screen,
              },
              {
                id: 'wirelessSafePolicy',
                icon: 'certificate',
                path: '/main/group/safe',
                formUrl: 'goform/group/timerPolicy',
                text: __('Safe Policy'),
                noTree: true,
                component: SharedComponents.TabContainer,
                routes: [
                  {
                    id: 'wirelessWips',
                    path: '/main/group/safe/wips',
                    formUrl: 'goform/group/wips',
                    text: __('AP Scan Settings'),
                    component: sWips.Screen,
                  }, {
                    id: 'wirelessEndpointProtection',
                    path: '/main/group/safe/endpointProtection',
                    formUrl: 'goform/group/wireless/protection',
                    text: __('Terminal Protection'),
                    component: sEndpointProtection.Screen,
                  },
                ],
              },
              {
                id: 'timerPolicy',
                icon: 'clock-o',
                path: '/main/group/timer',
                formUrl: 'goform/group/timerPolicy',
                text: __('Scheduler'),
                component: sTimerPolicy.Screen,
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
                formUrl: '/goform/system/status',
                text: __('System Status'),
                component: sSystemStatus.Screen,
              }, {
                id: 'alarmEvents',
                icon: 'exclamation-circle',
                path: '/main/system/alarm',
                formUrl: '/goform/system/alarmEvents',
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
                    formUrl: 'goform/system/log',
                    text: __('Log List'),
                    component: sSystemLogList.Screen,
                  }, {
                    id: 'systemLogMaintenance',
                    path: '/main/system/log/maintenance',
                    formUrl: 'goform/system/log',
                    text: __('Log Maintenance'),
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
                    formUrl: 'goform/system/maintenance',
                    text: __('Configuration'),
                    component: sApMaintenance.Screen,
                  }, {
                    id: 'apsVersion',
                    path: '/main/system/ap/version',
                    formUrl: 'goform/system/ap/version',
                    text: __('AP Firmware'),
                    component: sApVersion.Screen,
                  }, {
                    id: 'apModel',
                    path: '/main/system/ap/model',
                    formUrl: 'goform/system/ap/model',
                    text: __('AP Model'),
                    component: sApModel.Screen,
                  },
                ],
              }, {
                id: 'acMaintenance',
                isIndex: true,
                formUrl: 'goform/system/maintenance',
                path: '/main/system/maintenance',
                icon: 'cog',
                text: __('AC Maintenance'),
                component: sAcMaintenance.Screen,
              }, {
                id: 'ntp',
                isIndex: true,
                formUrl: 'goform/system/networktimeprotocol',
                path: '/main/system/networktimeprotocol',
                icon: 'clock-o',
                text: __('NTP'),
                component: sNetworkTimeProtocol.Screen,
              }, {
                id: 'admin',
                isIndex: true,
                path: '/main/system/admin',
                formUrl: 'goform/system/admins',
                icon: 'user',
                text: __('Admin Account'),
                component: sSystemAdmin.Screen,
              },
            ],
          },
          {
            id: 'notFound',
            component: SharedComponents.NotFound,
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
        component: SharedComponents.NotFound,
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

