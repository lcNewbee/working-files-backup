const urls = {
  login: '/goform/login',
  regist: '/goform/regist',

  // 客户端
  fetchClientInfo: '/goform/getClientInfo',
  setClientAction: '/goform/setClientAction',

  // 设备
  fetchDevices: '/goform/getApDevInfo',
  fetchDeviceInfo: '/goform/getDeviceInfo',
  setDevice: '/goform/setDevice',
  setApAction: '/goform/setApAction',

  // 日志
  fetchLog: '/goform/getLogInfo',
  clearAllLog: '/goform/clearAllLogInfo',

  // 热点统计
  fetchStatsInfo: '/goform/getApClientInfo',
  fetchOfflineAp: '/goform/getOfflineDevInfo',
  deleteOfflineAp: '/goform/delApOfflineDev',
};

export default urls;
