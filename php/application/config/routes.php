<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
| -------------------------------------------------------------------------
| URI ROUTING
| -------------------------------------------------------------------------
| This file lets you re-map URI requests to specific controller functions.
|
| Typically there is a one-to-one relationship between a URL string
| and its corresponding controller class/method. The segments in a
| URL normally follow this pattern:
|
|	example.com/class/method/id/
|
| In some instances, however, you may want to remap this relationship
| so that a different class/function is called than the one
| corresponding to the URL.
|
| Please see the user guide for complete details:
|
|	https://codeigniter.com/user_guide/general/routing.html
|
| -------------------------------------------------------------------------
| RESERVED ROUTES
| -------------------------------------------------------------------------
|
| There are three reserved routes:
|
|	$route['default_controller'] = 'welcome';
|
| This route indicates which controller class should be loaded if the
| URI contains no data. In the above example, the "welcome" class
| would be loaded.
|
|	$route['404_override'] = 'errors/page_missing';
|
| This route will tell the Router which controller/method to use if those
| provided in the URL cannot be matched to a valid route.
|
|	$route['translate_uri_dashes'] = FALSE;
|
| This is not exactly a route, but allows you to automatically route
| controller and method names that contain dashes. '-' isn't a valid
| class or method name character, so it requires translation.
| When you set this option to TRUE, it will replace ALL dashes in the
| controller and method URI segments.
|
| Examples:	my-controller/index	-> my_controller/index
|		my-controller/my-method	-> my_controller/my_method
*/
$route['default_controller'] = 'login';
$route['404_override'] = '';
$route['goform/login'] = 'login';
$route['goform/axcInfo'] = 'axcInfo';

// 网络设置
$route['goform/network/port'] = 'network/networkPort';
$route['goform/network/interface'] = 'network/networkInterface';
$route['goform/network/dhcp/service/list'] = 'network/networkDhcp';
$route['goform/network/dhcp/relay'] = 'network/networkDhcpRelay';
$route['goform/network/nat'] = 'network/networkNat';
$route['goform/network/route'] = 'network/networkRoute';
$route['goform/network/aci'] = 'network/networkAci';
$route['goform/network/portal/server'] = 'network/networkPortalServer';
$route['goform/network/portal/rule'] = 'network/networkPortalRules';
$route['goform/network/portal/mac'] = 'network/networkPortalMac';
$route['goform/network/radius/template'] = 'network/networkRadius';
$route['goform/network/radius/proxy'] = 'network/radiusProxy';
$route['goform/network/dpi/overview'] = 'network/dpiOverview';
$route['goform/network/dpi/flowinfo'] = 'network/dpiFlowInfo';
$route['goform/network/dpi/macstatistic'] = 'network/dpiMac';
$route['goform/network/dpi/ethstatistic'] = 'network/dpiEth';
$route['goform/network/dpi/protoinfo'] = 'network/dpiProto';
$route['goform/network/dpi/dpisettings'] = 'network/dpiSettings';

// AP组管理
$route['goform/group'] = 'group/group';
$route['goform/group/overview'] = 'group/groupOverview';
$route['goform/group/ap/counter'] = 'group/apCounter';
$route['goform/group/ap'] = 'group/apRadio/fetch';
$route['goform/group/ap/radio'] = 'group/apRadio/radio';
$route['goform/group/ap/base'] = 'group/apRadio/base';
$route['goform/country/channel'] = 'group/ApChannel';
$route['goform/group/client'] = 'group/monitorUser';
$route['goform/group/flow/app'] = 'group/monitorFlow/app';
$route['goform/group/flow/user'] = 'group/monitorFlow/user';
$route['goform/group/ssid'] = 'group/monitorSsid';
$route['goform/group/aps'] = 'group/monitorAps';
$route['goform/group/ssidSetting'] = 'group/wirelessSsid';
$route['goform/group/wireless/acl'] = 'group/wirelessAcl';
$route['goform/group/smartRf'] = 'group/wirelessSmart';
$route['goform/group/timerPolicy'] = 'group/wirelessTimer';
$route['goform/group/wips'] = 'group/wirelessSafe';
$route['goform/group/wireless/protection'] = 'group/WirelessProtection';
$route['goform/group/safeStatus'] = 'group/monitorSafeStatus';
$route['goform/group/map/building'] = 'group/mapBuilding';
$route['goform/group/map/list'] = 'group/mapSonList';
$route['goform/group/map/apPlan'] = 'group/mapApPlan';
$route['goform/group/map/clients_trace'] = 'group/mapClients';
$route['goform/group/map/heatmap'] = 'group/mapHeat';
$route['goform/group/map/orbittrace'] = 'group/mapOrbit';
$route['goform/group/map/dubious'] = 'group/mapDubious';
$route['goform/group/map/point'] = 'group/mapPoint';
$route['goform/alarm_map_chunk_pos'] = 'group/mapAreaInfo';
$route['goform/change_priority_settings'] = 'group/mapAreaInfo/settings';
$route['goform/group/map/alarmmap'] = 'group/mapArea';



// 系统设置
$route['goform/system/version/upload'] = 'system/systemVersion/upload';
$route['goform/system/version/upgrade'] = 'system/systemVersion/upgrade';
$route['goform/system/version/backup'] = 'system/systemVersion/backup';
$route['goform/system/ap/model'] = 'system/systemModel';
$route['goform/system/ap/version'] = 'system/systemApVersion';
$route['goform/system/status'] = 'system/systemStatus';
$route['goform/system/alarmEvents'] = 'system/systemAlarm';
$route['goform/system/log'] = 'system/systemLog';
$route['goform/system/logdownload'] = 'system/systemLog/logdownload';
$route['goform/system/admins'] = 'system/systemAdmin';
$route['goform/system/maintenance'] = 'system/systemMaintenance';
$route['goform/system/restore'] = 'system/systemMaintenance/restore';
$route['goform/system/backup'] = 'system/systemMaintenance/backup';
$route['goform/system/saveConfig'] = 'system/systemMaintenance/saveConfig';
$route['goform/system/reboot'] = 'system/systemMaintenance/reboot';
$route['goform/system/license'] = 'system/systemLicense';
$route['goform/system/networktimeprotocol'] = 'system/systemNtp';
$route['goform/system/firewall/attackdefense'] = 'system/systemFirewallAttackDefense';

//Portal
$route['goform/portal/overview'] = 'portal/overview';
$route['goform/portal/radius/nas'] = 'portal/RadiusNas';
$route['goform/portal/radius/online'] = 'portal/RadiusOnlineList';
$route['goform/portal/radius/logs'] = 'portal/RadiusConnect';
$route['goform/portal/account/accountList'] = 'portal/AccountList';
$route['goform/portal/account/accountListMac'] = 'portal/AccountListMac';
$route['goform/portal/account/connectRecord'] = 'portal/AonnectRecord';
$route['goform/portal/access/config'] = 'portal/AccessConfig';
$route['goform/portal/access/list'] = 'portal/AccessList';
$route['goform/portal/access/urlParameter'] = 'portal/AccessUrl';
$route['goform/portal/access/web'] = 'portal/AccessWeb';
$route['goform/portal/access/web/webPage'] = 'portal/AccessWeb/webPage';
$route['goform/portal/access/download'] = 'portal/AccessWeb/download';
//$route['goform/portal/access/upload'] = 'portal/AccessDefault/upload';
$route['goform/portal/access/weixin'] = 'portal/AccessWeixin';
$route['goform/portal/access/defaultweb'] = 'portal/AccessDefault';
$route['goform/portal/access/smsgateWay'] = 'portal/AccessSms';
$route['goform/portal/access/portalsmslog'] = 'portal/AccessSmslog';
$route['goform/portal/access/ssidmanagement'] = 'portal/AccessSsid';
$route['goform/portal/access/ap'] = 'portal/AccessSsid/apmac';
$route['goform/portal/access/facebook'] = 'portal/AccessFacebook';
$route['goform/portal/Aaa'] = 'portal/AaaServer';



$route['goform/portal/system/user'] = 'portal/systemUser';
$route['goform/portal/system/role'] = 'portal/systemRole';
$route['goform/portal/system/classification'] = 'portal/systemClassify';
$route['goform/portal/log/logList'] = 'portal/logList';
$route['goform/portal/log/onlineList'] = 'portal/onlineList';
$route['goform/portal/log/onlineRecordList'] = 'portal/onlineRecordList';
$route['goform/portal/card/cardlist'] = 'portal/cardList';
$route['goform/portal/card/cardcategory'] = 'portal/cateGory';
$route['goform/portal/message/receive'] = 'portal/messageReceive';
$route['goform/portal/message/send'] = 'portal/messageSend';
$route['goform/portal/message/sendmessage'] = 'portal/messageAdd';

$route['goform/portal/advertisement/stores'] = 'portal/advStores';
$route['goform/portal/advertisement/adv'] = 'portal/advManagement';


