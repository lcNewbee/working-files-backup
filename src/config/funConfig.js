// 一份完整的AP页面功能配置单

const funConfig = {
  // 覆盖型产品快速设置
  coverageQuickSetup: {
    router: false, // 是否有router模式
  },
  // 网络设置
  network: {
    router: false, // 是否有router模式
    hasVlan: false, // 是否有VLAN功能
    hasMngVlanId: true, // 是否有管理VLAN ID的填写框
    hasUntagVlanId: true, // 是否有untag VLAN ID填写框
    hasPortListTable: true, // 是否有接口VLAN配置的列表显示
    hasVoipVlanId: true, // 是否有voip VLAN配置输入框
    hasIptvVLanId: true, // 是否有IPTV VLAN配置输入框
  },
  // 无线设置页面
  basic: {
    devicemodeOptions: [
      { value: 'ap', label: __('AP') },              // AP模式
      { value: 'sta', label: __('Station') },        // Station模式
      { value: 'repeater', label: __('Repeater') },  // Repeater模式
    ],
    radioMaxClientsLimit: true,    // 射频最大客户端限制
    // 功能项参见WirelessConfig -> Basic页面下的ssidTableFullMemberOptions变量
    // 决定哪些功能在ssid配置表格上出现
    ssidTableKeys: [    // 多SSID配置表格项
      'enable',         // 该SSID是否启用
      'ssid',           // SSID名称
      'maxClients',     // SSID最大客户端限制
      'airTimeEnable',  // 时间公平性
      'speedLimit',     // SSID限速
      'vlanId',         // VLAN ID
      'hideSsid',       // 该SSID是否隐藏
      'isolation',      // 是否启用客户端隔离
      'security',       // 加密配置
      'delete',         // 删除按钮
      'portalEnable',         // portal功能开关
    ],
    portalFun: true,    //是否有portal功能
  },
  // 无线高级设置页面
  advance: {
    ledThreshFun: false,        // 信号强度控制LED灯功能
    beaconIntervalFun: true,    // Beacon帧间间隔
    distanceFun: true,          // 距离调整拖动条
    dtimIntervalFun: true,      // DTIM间隔
    segmentThreshFun: true,     // 分片阈值
    ampduFun: true,             // ampdu值
    rateSetFun: true,           // 速率集
    rssiLimitFun: true,         // rssi限制
    airTimeFairnessFun: true,   // 时间公平性
  },
  // 系统维护页面
  systemmaintenance: {
    poeOutFun: false,           // POE输出功能
    voipFun: false,             // VOIP功能
  },
};

// 各个页面的配置参数可通过route传入，然后利用配置参数控制页面功能的显示与否

