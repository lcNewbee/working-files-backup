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
// const sNetworkVlan = require('../../screens/App/screens/MainAxc/screens/Network/screens/VLAN');
const sVlanSettings = require('../../screens/App/screens/MainAxc/screens/Network/screens/VLAN/VlanSettings');
const sQinqSettings = require('../../screens/App/screens/MainAxc/screens/Network/screens/VLAN/QinqSettings');
const sInterfaces = require('../../screens/App/screens/MainAxc/screens/Network/screens/Interfaces');
const sDhcpList = require('../../screens/App/screens/MainAxc/screens/Network/screens/DHCP/screens/DHCP/DhcpList');
const sDhcpService = require('../../screens/App/screens/MainAxc/screens/Network/screens/DHCP/screens/DHCP/DhcpService');
const sDpcpStaticList = require('../../screens/App/screens/MainAxc/screens/Network/screens/DHCP/screens/DHCP/DpcpStaticList');
const sSnoopingUserList = require('../../screens/App/screens/MainAxc/screens/Network/screens/DHCP/screens/Snooping/UserList');
const sSnoopingStaticList = require('../../screens/App/screens/MainAxc/screens/Network/screens/DHCP/screens/Snooping/StaticList');
const sDhcpRelay = require('../../screens/App/screens/MainAxc/screens/Network/screens/DHCP/screens/Relay/DhcpRelay');
const sDhcpFilter = require('../../screens/App/screens/MainAxc/screens/Network/screens/DHCP/screens/Filter/DhcpFilter');
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

const sNetworkUrlWlan =
    require('../../screens/App/screens/MainAxc/screens/Network/screens/URL/screens/Wlan');
const sNetworkUrlRulesGroup =
    require('../../screens/App/screens/MainAxc/screens/Network/screens/URL/screens/RulesGroup');
const sNetworkUrlFilterRules =
    require('../../screens/App/screens/MainAxc/screens/Network/screens/URL/screens/FilterRules');
const sNetworkUrlBindRules =
    require('../../screens/App/screens/MainAxc/screens/Network/screens/URL/screens/BindRules');

// const sPortalTemplate =
//    require('../../screens/App/screens/MainAxc/screens/Network/screens/Portal/screens/PortalTemplate');


/**
 * AP组管理
 */
const sOverview = require('../../screens/App/screens/MainAxc/screens/Monitor/screens/Overview');
const sClientList = require('../../screens/App/screens/MainAxc/screens/Monitor/screens/ClientList');
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
const sClientsTraceList = require('../../screens/App/screens/MainAxc/screens/Map/screens/ClientsTrace');
const sClientsTraceSettings = require('../../screens/App/screens/MainAxc/screens/Map/screens/ClientsTrace/Settings');
// ndpi
const sDPIOverview =
    require('../../screens/App/screens/MainAxc/screens/Network/screens/DPI/screens/DPIOverview');
// const sFlowInfo =
//     require('../../screens/App/screens/MainAxc/screens/Network/screens/DPI/screens/FlowInfo');
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

const sPortalStores =
    require('../../screens/App/screens/MainAxc/screens/Portal/screens/Advertisement/Stores');
const sPortalAdv =
    require('../../screens/App/screens/MainAxc/screens/Portal/screens/Advertisement/Adv');
const sPortalAdvPic =
    require('../../screens/App/screens/MainAxc/screens/Portal/screens/Advertisement/AdvPic');
// const sPortalPermission =
//     require('../../screens/App/screens/MainAxc/screens/Portal/screens/System/Permission');
// const sPortalClassification =
//     require('../../screens/App/screens/MainAxc/screens/Portal/screens/System/Classification');
// const sPortalUser =
//     require('../../screens/App/screens/MainAxc/screens/Portal/screens/System/User');
// const sPortalRole =
//     require('../../screens/App/screens/MainAxc/screens/Portal/screens/System/Role');

const sPortalLogList =
    require('../../screens/App/screens/MainAxc/screens/Portal/screens/Log/LogList');
const sPortalOnlineRecordList =
    require('../../screens/App/screens/MainAxc/screens/Portal/screens/Log/OnlineRecordList');
const sPortalOnlineList =
    require('../../screens/App/screens/MainAxc/screens/Portal/screens/Log/OnlineList');

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
        text: _('Network '),
        indexRoute: { onEnter: (nextState, replace) => replace('/main/network/interface') },
        childRoutes: [
          {
            id: 'vlan',
            icon: 'road',
            component: SharedComponents.TabContainer,
            path: '/main/network/vlan',
            text: _('VLAN'),
            noTree: true,
            indexRoute: { onEnter: (nextState, replace) => replace('/main/network/vlan/vlansettings') },
            childRoutes: [
              {
                id: 'networkVlanSettings',
                path: '/main/network/vlan/vlansettings',
                formUrl: 'goform/network/vlan/vlansettings',
                text: _('VLAN Settings'),
                component: sVlanSettings.Screen,
              },
              {
                id: 'networkQinqSettings',
                path: '/main/network/vlan/qinqsettings',
                formUrl: 'goform/network/vlan/qinqsettings',
                text: _('QINQ Settings'),
                component: sQinqSettings.Screen,
              },
            ],
          },
          {
            id: 'networkInterface',
            icon: 'th',
            path: '/main/network/interface',
            formUrl: 'goform/network/interface',
            text: _('Interfaces'),
            component: sInterfaces.Screen,
          }, {
            id: 'networkPort',
            path: '/main/network/port',
            icon: 'th-large',
            formUrl: '/goform/network/port',
            text: _('Ports'),
            component: sNetworkPort.Screen,
          }, {
            id: 'networkDhcp',
            icon: 'random',
            path: '/main/network/dhcp',
            text: _('DHCP Config'),
            indexRoute: { onEnter: (nextState, replace) => replace('/main/network/dhcp/dhcp') },
            childRoutes: [
              {
                id: 'dhcp',
                path: '/main/network/dhcp/dhcp',
                text: _('DHCP Service'),
                component: SharedComponents.TabContainer,
                indexRoute: {
                  onEnter: (nextState, replace) => replace('/main/network/dhcp/service/serviceConfig'),
                },
                childRoutes: [
                  {
                    id: 'dhcpService',
                    path: '/main/network/dhcp/service/serviceConfig',
                    formUrl: 'goform/network/dhcp/service/serviceConfig',
                    text: _('DHCP Service'),
                    component: sDhcpService.Screen,
                  },
                  {
                    id: 'dhcpList',
                    path: '/main/network/dhcp/service/list',
                    formUrl: 'goform/network/dhcp/service/list',
                    text: _('DHCP List'),
                    component: sDhcpList.Screen,
                  },
                  {
                    id: 'dhcpStaticList',
                    path: '/main/network/dhcp/service/staticList',
                    formUrl: 'goform/network/dhcp/service/staticList',
                    text: _('DHCP Static List'),
                    component: sDpcpStaticList.Screen,
                  },
                ],
              },
              {
                id: 'snooping',
                path: '/main/network/dhcp/snooping',
                text: _('Snooping'),
                component: SharedComponents.TabContainer,
                indexRoute: {
                  onEnter: (nextState, replace) => replace('/main/network/dhcp/snooping/userList'),
                },
                childRoutes: [
                  {
                    id: 'userList',
                    path: '/main/network/dhcp/snooping/userList',
                    formUrl: 'goform/network/dhcp/snooping/userList',
                    text: _('Snooping User List'),
                    component: sSnoopingUserList.Screen,
                  },
                  {
                    id: 'staticList',
                    path: '/main/network/dhcp/snooping/staticList',
                    formUrl: 'goform/network/dhcp/snooping/staticList',
                    text: _('Snooping Static List'),
                    component: sSnoopingStaticList.Screen,
                  },
                ],
              },
              {
                id: 'dhcpRelay',
                path: '/main/network/dhcp/relay',
                formUrl: 'goform/network/dhcp/relay',
                text: _('DHCP Relay'),
                component: sDhcpRelay.Screen,
              },
              {
                id: 'dhcpFilter',
                path: '/main/network/dhcp/filter',
                formUrl: 'goform/network/dhcp/filter',
                text: _('DHCP Filter'),
                component: sDhcpFilter.Screen,
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
            id: 'networkRadius',
            icon: 'clone',
            path: '/main/network/radius',
            text: _('Radius'),
            noTree: true,
            component: SharedComponents.TabContainer,
            indexRoute: { onEnter: (nextState, replace) => replace('/main/network/radius/template') },
            childRoutes: [
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
            id: 'networkURL',
            icon: 'filter',
            path: '/main/network/url',
            formUrl: 'goform/network/url',
            text: _('URL Filter'),
            noTree: true,
            component: SharedComponents.TabContainer,
            indexRoute: { onEnter: (nextState, replace) => replace('/main/network/url/wlan') },
            childRoutes: [
              {
                id: 'urlWlan',
                path: '/main/network/url/wlan',
                formUrl: 'goform/network/url/wlan',
                text: _('WLAN'),
                component: sNetworkUrlWlan.Screen,
              },
              {
                id: 'urlRulesGroup',
                path: '/main/network/url/rulesgroup',
                formUrl: 'goform/network/url/rulesgroup',
                text: _('Rules Group'),
                component: sNetworkUrlRulesGroup.Screen,
              },
              {
                id: 'urlFilterRules',
                path: '/main/network/url/filterrules',
                formUrl: 'goform/network/url/filterrules',
                text: _('Filter Rules'),
                component: sNetworkUrlFilterRules.Screen,
              },
              {
                id: 'urlBindRules',
                path: '/main/network/url/bindrules',
                formUrl: 'goform/network/url/bindrules',
                text: _('Bind Rules'),
                component: sNetworkUrlBindRules.Screen,
              },
            ],
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
          {
            id: 'dpi',
            icon: 'copy',
            noTree: true,
            component: SharedComponents.TabContainer,
            path: '/main/network/dpi',
            text: _('DPI'),
            indexRoute: { onEnter: (nextState, replace) => replace('/main/network/dpi/dpioverview') },
            childRoutes: [
              {
                id: 'dpioverview',
                path: '/main/network/dpi/dpioverview',
                formUrl: 'goform/network/dpi/overview',
                text: _('Overview'),
                component: sDPIOverview.Screen,
              },
              // {
              //   id: 'flowinfo',
              //   path: '/main/network/dpi/flowinfo',
              //   formUrl: 'goform/network/dpi/flowinfo',
              //   text: _('Flow Info'),
              //   component: sFlowInfo.Screen,
              // },
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
                text: _('Applications'),
                component: sProtoInfo.Screen,
              },
            ],
          },
        ],
      },
      {
        path: '/main/group',
        component: sMainAxc.Screen,
        icon: 'group',
        text: _('AP Groups '),
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
            childRoutes: [
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
              //   formUrl: '/goform/group/map/building',
              //   fetchUrl: '/goform/group/map/building',
              //   text: _('Heat Map'),
              //   component: sHeatMap.Screen,
              // },
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
            childRoutes: [
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
          {
            id: 'cientsTrace',
            path: '/main/group/clients_trace',
            text: _('Clients Statistics'),
            icon: 'bar-chart',
            noTree: true,
            component: SharedComponents.TabContainer,
            indexRoute: {
              onEnter: (nextState, replace) => replace('/main/group/clients_trace/list'),
            },
            childRoutes: [
              {
                id: 'clientsTrace',
                path: '/main/group/clients_trace/list',
                formUrl: '/goform/group/map/clients_trace',
                text: _('Clients Statistics'),
                component: sClientsTraceList.Screen,
              }, {
                id: 'clientsTrace',
                path: '/main/group/clients_trace/settings',
                formUrl: 'goform/group/map/clients_trace',
                text: _('Settings'),
                component: sClientsTraceSettings.Screen,
              },
            ],
          },
        ],
      },
      {
        path: '/main/portal',
        component: sMainAxc.Screen,
        icon: 'road',
        text: _('Hotspot'),
        indexRoute: { onEnter: (nextState, replace) => replace('/main/portal/overview') },
        childRoutes: [
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
            indexRoute: {
              onEnter: (nextState, replace) => replace('/main/portal/access/config'),
            },
            childRoutes: [
              {
                id: 'portalAccessBase',
                path: '/main/portal/access/config',
                formUrl: 'goform/portal/access/config',
                text: _('Base'),
                component: sPortalBase.Screen,
              },
              // {
              //   id: 'portalAccessUrlParams',
              //   path: '/main/portal/access/list',
              //   formUrl: 'goform/portal/access/list',
              //   text: _('Bas'),
              //   component: sPortalBas.Screen,
              // },
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
              // {
              //   id: 'portalApSetting',
              //   path: '/main/portal/access/ap',
              //   formUrl: 'goform/portal/access/ap',
              //   text: _('AP Setting'),
              //   component: sPortalApSetting.Screen,
              // }, {
              //   id: 'portalSsid',
              //   path: '/main/portal/access/ssid',
              //   formUrl: 'goform/portal/access/ssid',
              //   text: _('SSID'),
              //   component: sPortalSsid.Screen,
              // },
            ],
          }, {
            id: 'portalRadius',
            isIndex: true,
            path: '/main/portal/radius',
            icon: 'podcast',
            text: _('Radius'),
            indexRoute: {
              onEnter: (nextState, replace) => replace('/main/portal/radius/nas'),
            },
            childRoutes: [
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
            indexRoute: {
              onEnter: (nextState, replace) => replace('/main/portal/account/list'),
            },
            childRoutes: [
              {
                id: 'portalAccountAccountList',
                path: '/main/portal/account/list',
                text: _('Account List'),
                indexRoute: {
                  onEnter: (nextState, replace) => replace('/main/portal/account/list/index'),
                },
                childRoutes: [
                  {
                    id: 'portalAccountAccountList',
                    path: '/main/portal/account/list/index',
                    formUrl: 'goform/portal/account/accountList',
                    text: _('Account List'),
                    isIndex: true,
                    component: sPortalAccountList.Screen,
                  }, {
                    id: 'portalAccountAccountListMac',
                    path: '/main/portal/account/list/mac/(:loginName)',
                    formUrl: 'goform/portal/account/accountListMac',
                    text: _('Account List Mac'),
                    component: sPortalAccountListMac.Screen,
                    noNav: true,
                  },
                ],
                //component: sPortalAccountList.Screen,
              }, {
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
            indexRoute: {
              onEnter: (nextState, replace) => replace('/main/portal/message/send'),
            },
            childRoutes: [
              {
                id: 'portalSendMessage',
                path: '/main/portal/message/sendmessage/(:toname)',
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
          // {
          //   id: 'portalAdv',
          //   isIndex: true,
          //   path: '/main/portal/advertisement',
          //   icon: 'envelope-o',
          //   text: _('Advertisement'),
          //   indexRoute: {
          //     onEnter: (nextState, replace) => replace('/main/portal/advertisement/stores'),
          //   },
          //   childRoutes: [
          //     {
          //       id: 'portalStores',
          //       path: '/main/portal/advertisement/stores',
          //       formUrl: 'goform/portal/advertisement/stores',
          //       text: _('Stores Management'),
          //       component: sPortalStores.Screen,
          //     }, {
          //       id: 'portalAdv',
          //       path: '/main/portal/advertisement/adv',
          //       formUrl: 'goform/portal/advertisement/adv',
          //       text: _('Ads Management'),
          //       component: sPortalAdv.Screen,
          //     }, {
          //       id: 'portalAdvPic',
          //       path: '/main/portal/advertisement/advpic',
          //       formUrl: 'goform/portal/advertisement/advpic',
          //       text: _('AdsPic Management'),
          //       component: sPortalAdvPic.Screen,
          //     },
          //   ],
          // },
          {
            id: 'portalLog',
            isIndex: true,
            path: '/main/portal/log',
            icon: 'file-text-o',
            text: _('Online Record Log'),
            indexRoute: {
              onEnter: (nextState, replace) => replace('/main/portal/log/logList'),
            },
            childRoutes: [
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
            childRoutes: [
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
          // {
          //   id: 'portalSystem',
          //   isIndex: true,
          //   path: '/main/portal/system',
          //   icon: 'copy',
          //   text: _('System'),
          //   indexRoute: {
          //     onEnter: (nextState, replace) => replace('/main/portal/system/classification'),
          //   },
          //   childRoutes: [
          //     {
          //       id: 'portalSystemClassification',
          //       path: '/main/portal/system/classification',
          //       formUrl: 'goform/portal/system/classification',
          //       text: _('Classification'),
          //       component: sPortalClassification.Screen,
          //     }, {
          //       id: 'portalSystemRole',
          //       path: '/main/portal/system/role',
          //       formUrl: 'goform/portal/system/role',
          //       text: _('Role'),
          //       component: sPortalRole.Screen,
          //     },
          //     {
          //       id: 'portalSystemUser',
          //       path: '/main/portal/system/user',
          //       formUrl: 'goform/portal/system/user',
          //       text: _('User'),
          //       component: sPortalUser.Screen,
          //     }, {
          //       id: 'portalSystemPermission',
          //       path: '/main/portal/system/permission',
          //       formUrl: 'goform/portal/system/permission',
          //       text: _('Permission'),
          //       component: sPortalPermission.Screen,
          //     },
          //   ],
          // },
        ],
      },
      {
        path: '/main/system',
        component: sMainAxc.Screen,
        icon: 'cogs',
        text: _('System '),
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
      },
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

