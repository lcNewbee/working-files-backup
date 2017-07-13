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
const sVlanSettings = require('../../screens/MainAxc/screens/Network/screens/VLAN/VlanSettings');
const sQinqSettings = require('../../screens/MainAxc/screens/Network/screens/VLAN/QinqSettings');
const sV3Interfaces = require('../../screens/MainAxc/screens/Network/screens/V3Interfaces');
const sHostNetwork = require('../../screens/MainAxc/screens/Network/screens/HostNetwork');
const sPortSettings = require('../../screens/MainAxc/screens/Network/screens/EthernetPort/PortSettings');
const sPortStatics = require('../../screens/MainAxc/screens/Network/screens/EthernetPort/PortStatistics');
const sPortMirring = require('../../screens/MainAxc/screens/Network/screens/EthernetPort/PortMirring');
const sPortAggregation = require('../../screens/MainAxc/screens/Network/screens/EthernetPort/PortAggregation');
const sDhcpList = require('../../screens/MainAxc/screens/Network/screens/DHCP/screens/DHCP/DhcpList');
const sDhcpService = require('../../screens/MainAxc/screens/Network/screens/DHCP/screens/DHCP/DhcpService');
const sDpcpStaticList = require('../../screens/MainAxc/screens/Network/screens/DHCP/screens/DHCP/DpcpStaticList');
const sSnoopingUserList = require('../../screens/MainAxc/screens/Network/screens/DHCP/screens/Snooping/UserList');
const sSnoopingStaticList = require('../../screens/MainAxc/screens/Network/screens/DHCP/screens/Snooping/StaticList');
const sDhcpRelay = require('../../screens/MainAxc/screens/Network/screens/DHCP/screens/Relay/DhcpRelay');
const sDhcpFilter = require('../../screens/MainAxc/screens/Network/screens/DHCP/screens/Filter/DhcpFilter');
const sNetowrkStaticRoutes = require('../../screens/MainAxc/screens/Network/screens/StaticRoutes');
const sBasicVlanInterface = require('../../screens/MainAxc/screens/Network/screens/AccessControl/BasicACL/VlanInterface');
const sBasicWLAN = require('../../screens/MainAxc/screens/Network/screens/AccessControl/BasicACL/WLAN');
const sBasicRuleGroup = require('../../screens/MainAxc/screens/Network/screens/AccessControl/BasicACL/RuleGroup');
const sBasicRuleDetails = require('../../screens/MainAxc/screens/Network/screens/AccessControl/BasicACL/Rules');
const sBasicRuleBinding = require('../../screens/MainAxc/screens/Network/screens/AccessControl/BasicACL/BindRules');

const sExtendVlanInterface = require('../../screens/MainAxc/screens/Network/screens/AccessControl/ExtendACL/VlanInterface');
const sExtendWLAN = require('../../screens/MainAxc/screens/Network/screens/AccessControl/ExtendACL/WLAN');
const sExtendRuleGroup = require('../../screens/MainAxc/screens/Network/screens/AccessControl/ExtendACL/RuleGroup');
const sExtendRuleGroups = require('../../screens/MainAxc/screens/Network/screens/AccessControl/ExtendACL/RuleGroups');
const sExtendRuleDetails = require('../../screens/MainAxc/screens/Network/screens/AccessControl/ExtendACL/Rules');
const sExtendRuleBinding = require('../../screens/MainAxc/screens/Network/screens/AccessControl/ExtendACL/BindRules');
// const sNetworkNat = require('../../screens/MainAxc/screens/Network/screens/Nat');
const sNetworkNatSettings = require('../../screens/MainAxc/screens/Network/screens/NatSettings/screens/NatEnable');
const sNetworkNatInterfaceType = require('../../screens/MainAxc/screens/Network/screens/NatSettings/screens/InterfaceType');
const sNetworkNatAddressPool = require('../../screens/MainAxc/screens/Network/screens/NatSettings/screens/AddressPool');
const sNetworkNatAddressObject = require('../../screens/MainAxc/screens/Network/screens/NatSettings/screens/AddressObject');
const sNetworkNatServeObject = require('../../screens/MainAxc/screens/Network/screens/NatSettings/screens/ServeObject');
const sNetworkNatRuleDetails = require('../../screens/MainAxc/screens/Network/screens/NatSettings/screens/RuleDetails');
const sNetworkNatUlog = require('../../screens/MainAxc/screens/Network/screens/NatSettings/screens/ULog');
// const sNetworkAcl = require('../../screens/MainAxc/screens/Network/screens/ACL');
// const sNetworkPort = require('../../screens/MainAxc/screens/Network/screens/Port');
const sRaduisTemplate =
    require('../../screens/MainAxc/screens/Network/screens/RadiusTemplate');
const sNetworkAaa = require('../../screens/MainAxc/screens/Network/screens/AAA');
const sPortalServer =
    require('../../screens/MainAxc/screens/Network/screens/Portal/screens/PortalServer');
const sPortalRules =
    require('../../screens/MainAxc/screens/Network/screens/Portal/screens/PortalRules');
const sPortalMac =
    require('../../screens/MainAxc/screens/Network/screens/Portal/screens/PortalMac');
// const sPortalTemplate =
const sNetworkUrlWlan =
    require('../../screens/MainAxc/screens/Network/screens/URL/screens/Wlan');
const sNetworkUrlRules =
    require('../../screens/MainAxc/screens/Network/screens/URL/screens/Rules');
const sNetworkUrlRulesGroup =
    require('../../screens/MainAxc/screens/Network/screens/URL/screens/RulesGroup');
const sNetworkUrlFilterRules =
    require('../../screens/MainAxc/screens/Network/screens/URL/screens/FilterRules');
const sNetworkUrlBindRules =
    require('../../screens/MainAxc/screens/Network/screens/URL/screens/BindRules');

// 防火墙
const sAttackDefense =
    require('../../screens/MainAxc/screens/Network/screens/Firewall/screens/attackDefenseSetting');
const sFirewallBlackList =
    require('../../screens/MainAxc/screens/Network/screens/Firewall/screens/blackList');


const sPPPOEBaseConfig = require('../../screens/MainAxc/screens/Network/screens/PPPOE/screens/Base');
const sPPPOEUserList = require('../../screens/MainAxc/screens/Network/screens/PPPOE/screens/User');
const sPPPOEBindVlan = require('../../screens/MainAxc/screens/Network/screens/PPPOE/screens/Vlan');

const sDPIOverview =
    require('../../screens/MainAxc/screens/Network/screens/DPI/screens/DPIOverview');
// const sFlowInfo =
//     require('../../screens/MainAxc/screens/Network/screens/DPI/screens/FlowInfo');
const sMacStatistic =
    require('../../screens/MainAxc/screens/Network/screens/DPI/screens/MacStatistic');
const sEthStatistic =
    require('../../screens/MainAxc/screens/Network/screens/DPI/screens/EthStatistic');
const sProtoInfo =
    require('../../screens/MainAxc/screens/Network/screens/DPI/screens/ProtoInfo');



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

// const sFlowReport =
//     require('../../screens/MainAxc/screens/Report/screens/FlowReport');
// const sUsersAnalysis =
const sLiveMap = require('../../screens/MainAxc/screens/Map/screens/LiveMap');
const sApPlanMap =
    require('../../screens/MainAxc/screens/Map/screens/ApPlanMap');
const sOrbitTrace = require('../../screens/MainAxc/screens/Map/screens/OrbitTrace');
const sClientsTraceList = require('../../screens/MainAxc/screens/Map/screens/ClientsTrace');
const sClientsTraceSettings = require('../../screens/MainAxc/screens/Map/screens/ClientsTrace/Settings');
// const sRfMap = require('../../screens/MainAxc/screens/Map/screens/Rf');
const sHeatMap = require('../../screens/MainAxc/screens/Map/screens/HeatMap');

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
// const sSNMP =
//     require('../../screens/MainAxc/screens/System/screens/SNMP');
// const sActiveStandby =
//     require('../../screens/MainAxc/screens/System/screens/ActiveStandby');
// const sSignatures =
//     require('../../screens/MainAxc/screens/System/screens/Signatures');
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

/**
 * AAA 接入，认证，计费
 */
const cAAA = require('../../screens/MainAxc/containers/AAA');/**
 * Portal
 */
const sPortalOverview =
    require('../../screens/MainAxc/screens/Portal/screens/Overview');
const sPortalBase =
    require('../../screens/MainAxc/screens/Portal/screens/Access/Base');
// const sPortalBas =
    // require('../../screens/MainAxc/screens/Portal/screens/Access/Bas');
const sPortalUrlParams =
    require('../../screens/MainAxc/screens/Portal/screens/Access/UrlParams');
const sPortalWeb =
    require('../../screens/MainAxc/screens/Portal/screens/Access/Web');
const sPortalDefaultWeb =
    require('../../screens/MainAxc/screens/Portal/screens/Access/DefaultWeb');
const sPortalWeixin =
    require('../../screens/MainAxc/screens/Portal/screens/Access/Weixin');
const sPortalFacebook =
    require('../../screens/MainAxc/screens/Portal/screens/Access/Facebook');
const sPortalSMSGateWay =
    require('../../screens/MainAxc/screens/Portal/screens/Access/SMSGateway');
const sPortalSMSLog =
    require('../../screens/MainAxc/screens/Portal/screens/Access/SMSLog');

const sPortalApSetting =
    require('../../screens/MainAxc/screens/Portal/screens/Access/ApSetting');
const sPortalSsid =
    require('../../screens/MainAxc/screens/Portal/screens/Access/SsidManagement');

const sPortalNas =
    require('../../screens/MainAxc/screens/Portal/screens/Radius/Nas');
const sPortalOnline =
    require('../../screens/MainAxc/screens/Portal/screens/Radius/Online');
const sPortalConnectLog =
    require('../../screens/MainAxc/screens/Portal/screens/Radius/ConnectLog');

const sPortalSendMessage =
    require('../../screens/MainAxc/screens/Portal/screens/Message/SendMessage');
const sPortalSendBox =
    require('../../screens/MainAxc/screens/Portal/screens/Message/SendBox');
const sPortalReceiveBox =
    require('../../screens/MainAxc/screens/Portal/screens/Message/ReceiveBox');

const sPortalAccountList =
    require('../../screens/MainAxc/screens/Portal/screens/Account/AccountList');
const sPortalAccountListMac =
    require('../../screens/MainAxc/screens/Portal/screens/Account/AccountListMac');
const sPortalConnectRecord =
    require('../../screens/MainAxc/screens/Portal/screens/Account/ConnectRecord');

// const sPortalPermission =
//     require('../../screens/MainAxc/screens/Portal/screens/System/Permission');
// const sPortalClassification =
//     require('../../screens/MainAxc/screens/Portal/screens/System/Classification');
// const sPortalUser =
//     require('../../screens/MainAxc/screens/Portal/screens/System/User');
// const sPortalRole =
//     require('../../screens/MainAxc/screens/Portal/screens/System/Role');

const sPortalCardCategory =
    require('../../screens/MainAxc/screens/Portal/screens/Card/CardCategory');
const sPortalCardList =
    require('../../screens/MainAxc/screens/Portal/screens/Card/CardList');
const sPortalLogList =
    require('../../screens/MainAxc/screens/Portal/screens/Log/LogList');
const sPortalOnlineRecordList =
    require('../../screens/MainAxc/screens/Portal/screens/Log/OnlineRecordList');
const sPortalOnlineList =
    require('../../screens/MainAxc/screens/Portal/screens/Log/OnlineList');

const routes = [
  {
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
            path: '/main/network',
            component: cNetwork.Screen,
            icon: 'sphere',
            text: __('Network '),
            routes: [
              {
                id: 'ethernetPort',
                path: '/main/network/ethernetport',
                isIndex: true,
                icon: 'th-large',
                text: __('Ethernet Port'),
                routes: [
                  {
                    id: 'ethernetPortSettings',
                    path: '/main/network/ethernetport/portsettings',
                    formUrl: 'goform/network/portsettings',
                    text: __('Settings'),
                    icon: 'th',
                    component: sPortSettings.Screen,
                  },
                  {
                    id: 'ethernetPortMirring',
                    path: '/main/network/ethernetport/portmirring',
                    formUrl: 'goform/network/portmirring',
                    text: __('Mirring'),
                    icon: 'th',
                    component: sPortMirring.Screen,
                  },
                  {
                    id: 'ethernetPortAggregation',
                    path: '/main/network/ethernetport/portaggregation',
                    formUrl: 'goform/network/portaggregation',
                    text: __('Aggregation'),
                    icon: 'th',
                    component: sPortAggregation.Screen,
                  },
                  {
                    id: 'ethernetPortStatistics',
                    path: '/main/network/ethernetport/portstatistics',
                    formUrl: 'goform/network/portstatistics',
                    text: __('Statistics'),
                    icon: 'th',
                    component: sPortStatics.Screen,
                  },
                ],
              },
              {
                id: 'vlan',
                icon: 'road',
                component: SharedComponents.TabContainer,
                path: '/main/network/vlan',
                text: __('VLAN'),
                noTree: true,
                routes: [
                  {
                    id: 'networkVlanSettings',
                    path: '/main/network/vlan/vlansettings',
                    formUrl: 'goform/network/vlan/vlansettings',
                    text: __('VLAN Settings'),
                    component: sVlanSettings.Screen,
                  },
                  {
                    id: 'networkQinqSettings',
                    path: '/main/network/vlan/qinqsettings',
                    formUrl: 'goform/network/vlan/qinqsettings',
                    text: __('QINQ Settings'),
                    component: sQinqSettings.Screen,
                  },
                ],
              },
              // {
              //   id: 'networkHostnetwork',
              //   path: '/main/network/hostnetwork',
              //   formUrl: 'goform/network/hostnetwork',
              //   text: __('Host Network'),
              //   icon: 'th',
              //   component: sHostNetwork.Screen,
              // },

              // { // V2.0版本接口设置
              //   id: 'networkInterface',
              //   icon: 'th',
              //   path: '/main/network/interface',
              //   formUrl: 'goform/network/interface',
              //   text: __('Interfaces'),
              //   component: sInterfaces.Screen,
              // },
              // { // V3.0版本接口设置
              //   id: 'networkInterface',
              //   icon: 'th',
              //   path: '/main/network/v3interface',
              //   formUrl: 'goform/network/v3interface',
              //   text: __('Interfaces'),
              //   component: sV3Interfaces.Screen,
              // },
              // {
              //   id: 'networkPort',
              //   path: '/main/network/port',
              //   icon: 'th-large',
              //   formUrl: '/goform/network/port',
              //   text: __('Ports'),
              //   component: sNetworkPort.Screen,
              // },
              {
                id: 'networkDhcp',
                icon: 'random',
                path: '/main/network/dhcp',
                text: __('DHCP Config'),
                routes: [
                  {
                    id: 'dhcp',
                    path: '/main/network/dhcp/dhcp',
                    text: __('DHCP Service'),
                    component: SharedComponents.TabContainer,
                    routes: [
                      {
                        id: 'dhcpList',
                        path: '/main/network/dhcp/dhcp/list',
                        formUrl: 'goform/network/dhcp/service/list',
                        text: __('DHCP List'),
                        component: sDhcpList.Screen,
                      },
                      {
                        id: 'dhcpService',
                        path: '/main/network/dhcp/dhcp/serviceConfig',
                        formUrl: 'goform/network/dhcp/service/serviceConfig',
                        text: __('DHCP Service'),
                        component: sDhcpService.Screen,
                      },
                      {
                        id: 'dhcpStaticList',
                        path: '/main/network/dhcp/dhcp/staticList',
                        formUrl: 'goform/network/dhcp/service/staticList',
                        text: __('DHCP Static List'),
                        component: sDpcpStaticList.Screen,
                      },
                    ],
                  },
                  {
                    id: 'snooping',
                    path: '/main/network/dhcp/snooping',
                    text: __('Snooping'),
                    component: SharedComponents.TabContainer,
                    routes: [
                      {
                        id: 'userList',
                        path: '/main/network/dhcp/snooping/userList',
                        formUrl: 'goform/network/dhcp/snooping/userList',
                        text: __('Snooping User List'),
                        component: sSnoopingUserList.Screen,
                      },
                      {
                        id: 'staticList',
                        path: '/main/network/dhcp/snooping/staticList',
                        formUrl: 'goform/network/dhcp/snooping/staticList',
                        text: __('Snooping Static List'),
                        component: sSnoopingStaticList.Screen,
                      },
                    ],
                  },
                  {
                    id: 'dhcpRelay',
                    path: '/main/network/dhcp/relay',
                    formUrl: 'goform/network/dhcp/relay',
                    text: __('DHCP Relay'),
                    component: sDhcpRelay.Screen,
                  },
                  {
                    id: 'dhcpFilter',
                    path: '/main/network/dhcp/filter',
                    formUrl: 'goform/network/dhcp/filter',
                    text: __('DHCP Filter'),
                    component: sDhcpFilter.Screen,
                  },
                ],
              },
              // {
              //   id: 'networkNat',
              //   icon: 'exchange',
              //   path: '/main/network/nat',
              //   text: __('NAT'),
              //   formUrl: 'goform/network/nat',
              //   component: sNetworkNat.Screen,
              // },
              {
                id: 'networkNatSettings',
                icon: 'exchange',
                path: '/main/network/natsettings',
                noTree: true,
                text: __('NAT'),
                component: SharedComponents.TabContainer,
                routes: [
                  {
                    id: 'networkNatEnable',
                    path: '/main/network/natsettings/natenable',
                    formUrl: 'goform/network/natsettings/natenable',
                    text: __('NAT Enable'),
                    component: sNetworkNatSettings.Screen,
                  },
                  {
                    id: 'networkNatInterfaceType',
                    path: '/main/network/natsettings/interfacetype',
                    formUrl: 'goform/network/natsettings/interfacetype',
                    text: __('Interface Type'),
                    component: sNetworkNatInterfaceType.Screen,
                  },
                  {
                    id: 'networkNatAddressPool',
                    path: '/main/network/natsettings/addresspool',
                    formUrl: 'goform/network/natsettings/addresspool',
                    text: __('Address Pool'),
                    component: sNetworkNatAddressPool.Screen,
                  },
                  {
                    id: 'networkNatAddressObject',
                    path: '/main/network/natsettings/addressobject',
                    formUrl: 'goform/network/natsettings/addressobject',
                    text: __('Address Object'),
                    component: sNetworkNatAddressObject.Screen,
                  },
                  {
                    id: 'networkNatServeObject',
                    path: '/main/network/natsettings/serveobject',
                    formUrl: 'goform/network/natsettings/serveobject',
                    text: __('Serve Object'),
                    component: sNetworkNatServeObject.Screen,
                  },
                  {
                    id: 'networkNatRuleDetails',
                    path: '/main/network/natsettings/ruledetails',
                    formUrl: 'goform/network/natsettings/ruledetails',
                    text: __('Rule Details'),
                    component: sNetworkNatRuleDetails.Screen,
                  },
                  {
                    id: 'networkNatUlog',
                    path: '/main/network/natsettings/ulog',
                    formUrl: 'goform/network/natsettings/ulog',
                    text: __('ULOG'),
                    component: sNetworkNatUlog.Screen,
                  },
                ],
              },
              { // v3版本的路由设置
                id: 'staticRoutes',
                path: '/main/network/staticroutes',
                formUrl: 'goform/network/staticroutes',
                text: __('Static Route'),
                icon: 'map-signs',
                component: sNetowrkStaticRoutes.Screen,
              },
              {
                id: 'networkAcl',
                path: '/main/network/acl',
                isIndex: true,
                icon: 'th-large',
                text: __('Access Control'),
                routes: [
                  // {
                  //   id: 'networkBasicAcl',
                  //   path: '/main/network/acl/basicacl',
                  //   text: __('Basic ACL'),
                  //   icon: 'th',
                  //   component: SharedComponents.TabContainer,
                  //   routes: [
                  //     {
                  //       id: 'basicAclVlanInterface',
                  //       path: '/main/network/acl/basicacl/vlaninterface',
                  //       formUrl: 'goform/network/basicacl/vlaninterface',
                  //       text: __('Vlan Interface'),
                  //       component: sBasicVlanInterface.Screen,
                  //     },
                  //     {
                  //       id: 'basicAclWlan',
                  //       path: '/main/network/acl/basicacl/wlan',
                  //       formUrl: 'goform/network/basicacl/wlan',
                  //       text: __('WLAN'),
                  //       component: sBasicWLAN.Screen,
                  //     },
                  //     {
                  //       id: 'basicAclRuleGroup',
                  //       path: '/main/network/acl/basicacl/rulegroup',
                  //       formUrl: 'goform/network/basicacl/rulegroup',
                  //       text: __('Rule Group'),
                  //       component: sBasicRuleGroup.Screen,
                  //     },
                  //     {
                  //       id: 'basicAclRuleDetails',
                  //       path: '/main/network/acl/basicacl/ruledetails',
                  //       formUrl: 'goform/network/basicacl/ruledetails',
                  //       text: __('Rules'),
                  //       component: sBasicRuleDetails.Screen,
                  //     },
                  //     {
                  //       id: 'basicAclRuleBinding',
                  //       path: '/main/network/acl/basicacl/rulebinding',
                  //       formUrl: 'goform/network/basicacl/rulebinding',
                  //       text: __('Rules Binding'),
                  //       component: sBasicRuleBinding.Screen,
                  //     },
                  //   ],
                  // },
                  {
                    id: 'networkExtendAcl',
                    path: '/main/network/acl/extendacl',
                    text: __('ACL'),
                    // icon: 'th',
                    component: SharedComponents.TabContainer,
                    routes: [
                      {
                        id: 'extendAclVlanInterface',
                        path: '/main/network/acl/extendacl/vlaninterface',
                        formUrl: 'goform/network/extendacl/vlaninterface',
                        text: __('Vlan Interface'),
                        component: sExtendVlanInterface.Screen,
                      },
                      // {
                      //   id: 'extendAclWlan',
                      //   path: '/main/network/acl/extendacl/wlan',
                      //   formUrl: 'goform/network/extendacl/wlan',
                      //   text: __('WLAN'),
                      //   component: sExtendWLAN.Screen,
                      // },
                      {
                        id: 'extendAclRuleGroups',
                        path: '/main/network/acl/extendacl/rulegroups',
                        formUrl: 'goform/network/extendacl/rulegroups',
                        saveUrl: 'goform/network/extendacl/rulegroups',
                        text: __('Rule Group Settings'),
                        component: sExtendRuleGroups.Screen,
                      },
                      {
                        id: 'extendAclRuleGroup',
                        path: '/main/network/acl/extendacl/rulegroup',
                        formUrl: 'goform/network/extendacl/rulegroup',
                        text: __('Rule Group'),
                        component: sExtendRuleGroup.Screen,
                      },
                      {
                        id: 'extendAclRuleDetails',
                        path: '/main/network/acl/extendacl/ruledetails',
                        formUrl: 'goform/network/extendacl/ruledetails',
                        text: __('Rules'),
                        component: sExtendRuleDetails.Screen,
                      },
                      {
                        id: 'extendAclRuleBinding',
                        path: '/main/network/acl/extendacl/rulebinding',
                        formUrl: 'goform/network/extendacl/rulebinding',
                        text: __('Rules Binding'),
                        component: sExtendRuleBinding.Screen,
                      },
                    ],
                  },
                  {
                    id: 'networkURL',
                    // icon: 'filter',
                    path: '/main/network/acl/urlfilter',
                    text: __('URL Filter'),
                    noTree: true,
                    component: SharedComponents.TabContainer,
                    routes: [
                      {
                        id: 'urlWlan',
                        path: '/main/network/acl/urlfilter/wlan',
                        formUrl: 'goform/network/url/wlan',
                        text: __('WLAN'),
                        component: sNetworkUrlWlan.Screen,
                      },
                      {
                        id: 'urlRules',
                        path: '/main/network/acl/urlfilter/rules',
                        formUrl: 'goform/network/url/rules',
                        text: __('Rules'),
                        component: sNetworkUrlRules.Screen,
                      },
                      {
                        id: 'urlRulesGroup',
                        path: '/main/network/acl/urlfilter/rulesgroup',
                        formUrl: 'goform/network/url/rulesgroup',
                        text: __('Rules Group'),
                        component: sNetworkUrlRulesGroup.Screen,
                      },
                      {
                        id: 'urlFilterRules',
                        path: '/main/network/acl/urlfilter/filterrules',
                        formUrl: 'goform/network/url/filterrules',
                        text: __('Filter Rules'),
                        component: sNetworkUrlFilterRules.Screen,
                      },
                      {
                        id: 'urlBindRules',
                        path: '/main/network/acl/urlfilter/bindrules',
                        formUrl: 'goform/network/url/bindrules',
                        text: __('Bind Rules'),
                        component: sNetworkUrlBindRules.Screen,
                      },
                    ],
                  },
                ],
              },
              // 先隐藏ACL
              // {
              //   id: 'networkAcl',
              //   icon: 'ban',
              //   path: '/main/network/acl',
              //   text: __('Access Control'),
              //   formUrl: 'goform/network/acl',
              //   component: sNetworkAcl.Screen,
              // },
              // { // v2.5版本的路由设置
              //   id: 'staticRoutes',
              //   path: '/main/network/static_routes',
              //   text: __('Routes'),
              //   icon: 'map-signs',
              //   formUrl: 'goform/network/route',
              //   component: sNetworkRoutes.Screen,
              // },

              // { // v2.5版本端口设置
              //   id: 'networkPort',
              //   path: '/main/network/port',
              //   icon: 'th-large',
              //   formUrl: '/goform/network/port',
              //   text: __('Ports'),
              //   component: sNetworkPort.Screen,
              // },
              // {
              //   id: 'networkURL',
              //   icon: 'filter',
              //   path: '/main/network/url',
              //   formUrl: 'goform/network/url',
              //   text: __('URL Filter'),
              //   noTree: true,
              //   component: SharedComponents.TabContainer,
              //   routes: [
              //     {
              //       id: 'urlWlan',
              //       path: '/main/network/url/wlan',
              //       formUrl: 'goform/network/url/wlan',
              //       text: __('WLAN'),
              //       component: sNetworkUrlWlan.Screen,
              //     },
              //     {
              //       id: 'urlRulesGroup',
              //       path: '/main/network/url/rulesgroup',
              //       formUrl: 'goform/network/url/rulesgroup',
              //       text: __('Rules Group'),
              //       component: sNetworkUrlRulesGroup.Screen,
              //     },
              //     {
              //       id: 'urlFilterRules',
              //       path: '/main/network/url/filterrules',
              //       formUrl: 'goform/network/url/filterrules',
              //       text: __('Filter Rules'),
              //       component: sNetworkUrlFilterRules.Screen,
              //     },
              //     {
              //       id: 'urlBindRules',
              //       path: '/main/network/url/bindrules',
              //       formUrl: 'goform/network/url/bindrules',
              //       text: __('Bind Rules'),
              //       component: sNetworkUrlBindRules.Screen,
              //     },
              //   ],
              // },
              // {
              //   id: 'networkPPPOE',
              //   icon: 'filter',
              //   path: '/main/network/pppoe',
              //   formUrl: 'goform/network/pppoe',
              //   text: __('PPPOE'),
              //   noTree: true,
              //   component: SharedComponents.TabContainer,
              //   routes: [
              //     {
              //       id: 'pppoeBase',
              //       path: '/main/network/pppoe/baseConfig',
              //       formUrl: 'goform/network/pppoe/baseConfig',
              //       text: __('Base Config'),
              //       component: sPPPOEBaseConfig.Screen,
              //     },
              //     {
              //       id: 'pppoeUser',
              //       path: '/main/network/pppoe/userList',
              //       formUrl: 'goform/network/pppoe/userList',
              //       text: __('User List'),
              //       component: sPPPOEUserList.Screen,
              //     },
              //     {
              //       id: 'pppoeVlan',
              //       path: '/main/network/pppoe/vlan',
              //       formUrl: 'goform/network/pppoe/vlan',
              //       text: __('Bind Vlan'),
              //       component: sPPPOEBindVlan.Screen,
              //     },
              //   ],
              // },
              {
                id: 'dpi',
                icon: 'copy',
                noTree: true,
                component: SharedComponents.TabContainer,
                path: '/main/network/dpi',
                text: __('DPI'),
                routes: [
                  {
                    id: 'dpioverview',
                    path: '/main/network/dpi/dpioverview',
                    formUrl: 'goform/network/dpi/overview',
                    text: __('Overview'),
                    component: sDPIOverview.Screen,
                  },
                  // {
                  //   id: 'flowinfo',
                  //   path: '/main/network/dpi/flowinfo',
                  //   formUrl: 'goform/network/dpi/flowinfo',
                  //   text: __('Flow Info'),
                  //   component: sFlowInfo.Screen,
                  // },
                  {
                    id: 'macstatistic',
                    path: '/main/network/dpi/macstatistic',
                    formUrl: 'goform/network/dpi/macstatistic',
                    text: __('Mac Statistic'),
                    component: sMacStatistic.Screen,
                  }, {
                    id: 'ethstatistic',
                    path: '/main/network/dpi/ethstatistic',
                    formUrl: 'goform/network/dpi/ethstatistic',
                    text: __('Ethernet Statistic'),
                    component: sEthStatistic.Screen,
                  }, {
                    id: 'protoinfo',
                    path: '/main/network/dpi/protoinfo',
                    formUrl: 'goform/network/dpi/protoinfo',
                    text: __('Applications'),
                    component: sProtoInfo.Screen,
                  },
                ],
              },
              {
                id: 'firewall',
                isIndex: true,
                path: '/main/network/firewall',
                icon: 'dot-circle-o ',
                text: __('Firewall'),
                noTree: true,
                component: SharedComponents.TabContainer,
                indexPath: '/main/network/firewall/attackdefense',
                routes: [
                  {
                    id: 'attackDefense',
                    isIndex: true,
                    formUrl: 'goform/network/firewall/attackdefense',
                    path: '/main/network/firewall/attackdefense',
                    text: __('Attack Defense'),
                    component: sAttackDefense.Screen,
                  }, {
                    id: 'firewallBlackList',
                    isIndex: true,
                    formUrl: 'goform/network/firewall/balcklist',
                    path: '/main/network/firewall/balcklist',
                    text: __('Black List'),
                    component: sFirewallBlackList.Screen,
                  },
                ],
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
                text: __('Safe Policy'),
                noTree: true,
                component: SharedComponents.TabContainer,
                routes: [
                  {
                    id: 'wirelessEndpointProtection',
                    path: '/main/group/safe/endpointProtection',
                    formUrl: 'goform/group/wireless/protection',
                    text: __('Terminal Protection'),
                    component: sEndpointProtection.Screen,
                  },
                  {
                    id: 'wirelessWips',
                    path: '/main/group/safe/wips',
                    formUrl: 'goform/group/wips',
                    text: __('AP Monitor Settings'),
                    component: sWips.Screen,
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
                formUrl: 'goform/portal/overview',
                mode: 'cors',
                text: __('Overview'),
                component: sPortalOverview.Screen,
              },
              {
                id: 'portalLogOnlineList',
                icon: 'desktop',
                path: '/main/portal/onlineList',
                formUrl: 'goform/portal/log/onlineList',
                text: __('Online Clients'),
                component: sPortalOnlineList.Screen,
              },
              // {
              //   id: 'networkPortal',
              //   icon: 'copy',
              //   text: __('old page'),
              //   noTree: true,
              //   component: SharedComponents.TabContainer,
              //   path: '/main/portal/old',
              //   routes: [
              //     {
              //       id: 'portalServer',
              //       path: '/main/portal/old/portal/server',
              //       formUrl: 'goform/network/portal/server',
              //       text: __('Portal Services'),
              //       component: sPortalServer.Screen,
              //     },
              //     {
              //       id: 'portalRules',
              //       path: '/main/portal/old/portal/rules',
              //       formUrl: 'goform/network/portal/rule',
              //       text: __('Port Portal Rules'),
              //       component: sPortalRules.Screen,
              //     },
              //     {
              //       id: 'ridiusList',
              //       path: '/main/portal/old/radius/list',
              //       formUrl: 'goform/network/radius/template',
              //       text: __('Radius Services'),
              //       component: sRadiusTemplate.Screen,
              //     },
              //   ],
              // },
              {
                id: 'portalServices',
                isIndex: true,
                path: '/main/portal/local',
                icon: 'user-o',
                text: __('Local Server'),
                routes: [
                  // {
                  //   id: 'portalRadiusNas',
                  //   path: '/main/portal/local/radius',
                  //   formUrl: 'goform/portal/radius/nas',
                  //   text: __('Radius Server'),
                  //   component: sPortalNas.Screen,
                  // },
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
                        formUrl: 'goform/portal/access/web',
                        text: __('Page Settings'),
                        component: sPortalWeb.Screen,
                      },
                      // {
                      //   id: 'portalAccessBase',
                      //   path: '/main/portal/local/portal/config',
                      //   formUrl: 'goform/portal/access/config',
                      //   text: __('Base'),
                      //   component: sPortalBase.Screen,
                      // },
                      {
                        id: 'portalWechat',
                        path: '/main/portal/local/portal/weixin',
                        formUrl: 'goform/portal/access/weixin',
                        text: __('Wechat Authentication'),
                        component: sPortalWeixin.Screen,
                      },
                      {
                        id: 'portalFacebook',
                        path: '/main/portal/local/portal/facebook',
                        formUrl: 'goform/portal/access/facebook',
                        text: __('Facebook Authentication'),
                        component: sPortalFacebook.Screen,
                      },
                      {
                        id: 'portaSMSGateWay',
                        path: '/main/portal/local/portal/smsgateWay',
                        formUrl: 'goform/portal/access/smsgateWay',
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
                        formUrl: 'goform/portal/account/accountList',
                        text: __('User Account List'),
                        isIndex: true,
                        component: sPortalAccountList.Screen,
                      },
                      {
                        id: 'portalAccountConnectRecord',
                        path: '/main/portal/local/account/connectRecord',
                        formUrl: 'goform/portal/account/connectRecord',
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
                        formUrl: 'goform/portal/card/cardcategory',
                        text: __('Vouchers'),
                        component: sPortalCardCategory.Screen,
                      }, {
                        id: 'portalCardCardList',
                        path: '/main/portal/local/card/cardlist',
                        formUrl: 'goform/portal/card/cardlist',
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
                        formUrl: 'goform/portal/message/receive',
                        text: __('Inbox'),
                        component: sPortalReceiveBox.Screen,
                      }, {
                        id: 'portalSendBox',
                        path: '/main/portal/local/message/send',
                        formUrl: 'goform/portal/message/send',
                        text: __('Outbox'),
                        component: sPortalSendBox.Screen,
                      }, {
                        id: 'portalSendMessage',
                        path: '/main/portal/local/message/sendmessage',
                        formUrl: 'goform/portal/message/sendmessage',
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
                        formUrl: 'goform/portal/log/logList',
                        text: __('User Log'),
                        component: sPortalLogList.Screen,
                      }, {
                        id: 'portalLogOnlineRecordList',
                        path: '/main/portal/local/log/onlineRecordList',
                        formUrl: 'goform/portal/log/onlineRecordList',
                        text: __('User Record List'),
                        component: sPortalOnlineRecordList.Screen,
                      },
                      {
                        id: 'portalSMSLog',
                        path: '/main/portal/local/log/portalsmslog',
                        formUrl: 'goform/portal/access/portalsmslog',
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
                formUrl: 'goform/network/portal/mac',
                text: __('Portal White List'),
                component: sPortalMac.Screen,
              },
              {
                id: 'networkAaa',
                icon: 'link',
                path: '/main/portal/aaa/list',
                formUrl: 'goform/portal/Aaa',
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
            component: NotFound,
          },
        ],
      },
      {
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

