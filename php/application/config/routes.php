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
$route['goform/network/port'] = 'networkPort';
$route['goform/network/interface'] = 'networkInterface';
$route['goform/network/dhcp'] = 'networkDhcp';
$route['goform/network/nat'] = 'networkNat';
$route['goform/network/route'] = 'networkRoute';
$route['goform/network/aci'] = 'networkAci';
$route['goform/network/Aaa'] = 'networkAaa';
$route['goform/network/portal/server'] = 'networkPortalServer';
$route['goform/network/portal/rule'] = 'networkPortalRules';
$route['goform/network/radius/template'] = 'networkRadius';

// AP组管理
$route['goform/group'] = 'group';
$route['goform/group/overview'] = 'groupOverview';
$route['goform/group/ap'] = 'apRadio/fetch';
$route['goform/group/ap/radio'] = 'apRadio/radio';
$route['goform/group/ap/base'] = 'apradio/base';
$route['goform/group/client'] = 'monitorUser';
$route['goform/group/flow/app'] = 'monitorFlow/app';
$route['goform/group/flow/user'] = 'monitorFlow/user';
$route['goform/group/ssid'] = 'monitorSsid';
$route['goform/group/aps'] = 'monitorAps';
$route['goform/group/ssidSetting'] = 'wirelessSsid';
$route['goform/group/wireless/acl'] = 'wirelessAcl';
$route['goform/group/smartRf'] = 'wirelessSmart';
$route['goform/group/timerPolicy'] = 'wirelessTimer';
$route['goform/group/wips'] = 'wirelessSafe';
$route['goform/group/wireless/protection'] = 'WirelessProtection';
$route['goform/group/safeStatus'] = 'monitorSafeStatus';
$route['goform/group/map/building'] = 'mapBuilding';
$route['goform/group/map/list'] = 'mapSonList';
$route['goform/group/map/apPlan'] = 'mapApPlan';

// 系统设置
$route['goform/system/version/upload'] = 'systemVersion/upload';
$route['goform/system/version/upgrade'] = 'systemVersion/upgrade';
$route['goform/system/version/backup'] = 'systemVersion/backup';
$route['goform/system/ap/model'] = 'systemModel';
$route['goform/system/ap/version'] = 'systemApVersion';
$route['goform/system/status'] = 'systemStatus';
$route['goform/system/alarmEvents'] = 'systemAlarm';
$route['goform/system/log'] = 'systemLog';
$route['goform/system/admins'] = 'systemAdmin';
$route['goform/system/maintenance'] = 'systemMaintenance';
$route['goform/system/backup'] = 'systemMaintenance/backup';
$route['goform/system/reboot'] = 'systemMaintenance/reboot';
$route['goform/system/license'] = 'systemLicense';
$route['goform/system/networktimeprotocol'] = 'systemNtp';