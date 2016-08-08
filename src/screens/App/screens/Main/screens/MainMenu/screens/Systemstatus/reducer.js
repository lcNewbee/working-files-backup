import {Map, List, fromJS} from 'immutable';

const defaultState = fromJS({
  fetching:false,
  data:{
    "WirelessMode":"station",
    "status": {
      "DeviceModel":"NS300",
      "DeviceName":"NS300",
      "NetworkMode":"Bridge",
      "SSID":"axilspot",
      "Security":"none",
      "Version":"p2p1.0.1",
      "Uptime":"1000",
      "SystemTime":"14000000",
      "Channel":"11",
      "Frequency":"2.412",
      "ChannelWidth":"40+",
      "Distance":"1000",
      "TxPower":"14",
      "Atenna":"16",
      "Wlan0Mac":"14:FF:00:00:11:10",
      "Lan0Mac":"14:FF:00:00:11:10",
      "Lan1Mac":"14:FF:00:00:11:11",
      "Noise":"80",
      "SNR":"0.8",
      "CCQ":"0.9",
      "Signal":"90",
      "ap": { /* ap 或者 repeater 模式下才有该字段*/
        "ApMac":"14:FF:00:00:11:88",
        "ClientNum":"10",
        "StaList":[  /* 连接到该ap的客户端列表*/
          {
            "Mac":"14:FF:00:00:11:19",
            "DeviceName":"derry",
            "TxSignal":"60",
            "RxSignal":"70",
            "Noise":"-60",
            "TxRate":"60",
            "RxRate":"50",
            "CCQ":"0.9",
            "ConnectTime":"109",
            "IpAddr":"192.168.1.100"
          },
          {
            "Mac":"14:FF:00:00:11:20",
            "DeviceName":"axilspot",
            "TxSignal":"60",
            "RxSignal":"70",
            "Noise":"-60",
            "TxRate":"60",
            "RxRate":"50",
            "CCQ":"0.9",
            "ConnectTime":"131",
            "IpAddr":"192.168.1.99"
          },
        ]
      },
      "station":{ /* station模式下才有该字段*/
        "Signal":"-50",
        "ApInfo":
          {
            "DeviceName":"NS300",
            "DeviceMode":"NS300",
            "SoftVersion":"Ap1.0.0.1",
            "ConnectTime":"1000",
            "RxSignal":"80",
            "TxSignal":"90",
            "TxRate":"100",
            "RxRate":"100",
            "TxPackets":"1899",
            "RxPackets":"1000",
            /* todo*/
          }
      },
      "interfaces":[
        {
          "Name":"LAN0",
          "Ip":"0.0.0.0",
          "MTU":"1500",
          "TxBytes":"1300",
          "RxBytes":"1800",
          "TxErrorPackets":"5",
          "RxErrorPackets":"1"
        },
        {
          "Name":"LAN1",
          "Ip":"0.0.0.0",
          "MTU":"1500",
          "TxBytes":"1300",
          "RxBytes":"1800",
          "TxErrorPackets":"5",
          "RxErrorPackets":"1"
        },
        {
          "Name":"Bridge0",
          "Ip":"192.168.1.10",
          "MTU":"1500",
          "TxBytes":"1300",
          "RxBytes":"1800",
          "TxErrorPackets":"5",
          "RxErrorPackets":"1"
        },
        {
          "Name":"WLAN0",
          "Ip":"0.0.0.0",
          "MTU":"1500",
          "TxBytes":"1300",
          "RxBytes":"1800",
          "TxErrorPackets":"5",
          "RxErrorPackets":"1"
        },
      ]
    }
  },
  query:'http://192.168.1.1/goform/get_system_info'
});


export default function(state = defaultState, action){
  switch(action.type){
    case 'REQUEST_FETCH_STATUS':
      return state.setIn([data,WirelessMode],'MyStation')
  }
  return state;
}
