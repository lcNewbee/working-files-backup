import { Map, List, fromJS } from 'immutable';

const defaultState = fromJS({
  fetching: false,
  remoteApInfo: [
    {
      devicename: 'outside AP',
      devicemodel: 'AP model',
      softwareversion: 'V1.0.0.1',
    },
  ],
  remoteStaInfo: [
    {
      mac: '11:22:33:44:55:66',
      devicename: 'iPhone',
      txstrength: '24',
      rxstrength: '38',
      noise: '-90',
    },
  ],
  interfaceInfo: [
    {
      interface: 'Bridge0',
      mac: '11:22:33:44:55:66',
      mtu: '64',
      ip: '192.168.0.1',
      txflow: '100',
      txerror: '50',
      rxflow: '80',
      rxerror: '20',
    },
  ],
  logInfo: [

  ],
});

export default function (state = defaultState, action) { // 根据action修改本身的state数据，reducer
  switch (action.type) {
    case 'RECEIVE_MONITOR_INFO':
      // console.log(action.data.remoteApInfo);
      const apInfo = fromJS(action.data.remoteApInfo);
      // console.log(apInfo);
      const temp = state.delete('remoteApInfo').concat(apInfo);
      console.log('temp:', temp);
      return temp;
    default:
  }

  return state;
}
