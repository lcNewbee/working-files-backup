const urls = {
  login: 'goform/login',
  regist: 'goform/regist',

  // 系统状态
  fetchSystemStatus: 'goform/get_system_info',

  // 网络监控
  fetchMonitorStatus: 'goform/getMonitorStatus',

  // 客户端
  fetchClientInfo: 'goform/getClientInfo',
  setClientAction: 'goform/setClientAction',

  // 设备
  fetchDevices: 'goform/getApDevInfo',
  fetchDeviceInfo: 'goform/getDeviceInfo',
  setDevice: 'goform/setDevice',
  setApAction: 'goform/setApAction',

  // 日志
  fetchLog: 'goform/getLogInfo',
  clearAllLog: 'goform/clearAllLogInfo',

  // 热点统计
  fetchStatsInfo: 'goform/getApClientInfo',
  fetchOfflineAp: 'goform/getOfflineDevInfo',
  deleteOfflineAp: 'goform/delApOfflineDev',

  // 统计报表
  fetchReport: 'goform/getReport',
  fetchReportList: 'goform/getReportList',
  createReport: 'goform/createReport',
  emailReport: 'goform/emailReport',
  deleteReport: 'goform/deleteReport',

  // 管理员设置
  saveAdmin: 'goform/setAdmin',

  // 组设置
  fetchGroups: 'goform/getDevGroups',
  fetchGroupDevs: 'goform/getGroupDevs',
  editGroup: 'goform/updateDevGroup',
  deleteGroup: 'goform/deleteDevGroup',
  addGroup: 'goform/addDevGroup',

  // 来宾设置
  fetchGuestInfo: 'goform/getGuestInfo',
  saveGuest: 'goform/setGuestInfo',

  // Proptal 设置
  fetchPortal: 'goform/getPortal',
  savePortal: 'goform/setPortalInfo',
  uploadPortalImage: 'goform/setPortalImage',

  // Voip 设置
  fetchVoip: 'goform/getVoipInfo',
  saveVoip: 'goform/setVoipInfo',

  // Wifi 设置
  fetchWifi: 'goform/getWifi',
  saveWifi: 'goform/setWifi',
};

export default urls;
