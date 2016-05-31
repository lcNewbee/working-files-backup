import utils from 'utils';
import * as appActions from 'actions/ajax'

const urls = {
  fetchDevices: '/goform/getApDevInfo',
  fetchDeviceInfo: '/goform/getDeviceInfo',
  setDevice: '/goform/setDevice',
  action: '/goform/setApAction'
}

export function reqeustFetchDevices() {
  return {
    type: 'REQEUST_FETCH_DEVICE',
  };
}

export function reciveFetchDevices(data) {
  return {
    type: 'RECIVE_FETCH_DEVICES',
    updateAt: Date.now(),
    data,
  };
}

export function changeDevicesQuery(query) {
  return {
    type: 'CHANGE_DEVICES_QUERY',
    query,
  };
}

export function rebootDevice(mac) {
  return {
    type: 'REBOOT_DEVICE',
    mac,
  };
}

export function resetDevice(mac) {
  return {
    type: 'RESET_DEVICE',
    mac,
  };
}

export function locateDevice(mac) {
  return {
    type: 'LOCATE_DEVICE',
    mac,
  };
}

export function fetchDevices() {
  return (dispatch, getState) => {
    const query = getState().devices.get('query').toJS();
    
    dispatch(reqeustFetchDevices());

    utils.fetch(urls.fetchDevices, query)
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          dispatch(reciveFetchDevices(json.data));
        }
      });
  };
}

export function saveDevicesAction(data) {
  return (dispatch, getState) => {
    //const query = getState().devices.get('query').toJS();
    
    dispatch(reqeustFetchDevices());

    utils.save(urls.action, data)
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          dispatch(fetchDevices(json.data));
        }
      });
  };
}

// Edit
export function reqeustFetchDeviceNetwork(mac) {
  return {
    type: 'REQEUST_FETCH_DEVICE_NETWORK',
    mac,
  };
}
export function reciveFetchDeviceNetwork(data) {
  return {
    type: 'RECIVE_FETCH_DEVICE_NETWORK',
    data,
  };
}
export function changeDeviceNetwork(data) {
  return {
    type: 'CHANGE_DEVICE_NETWORK',
    data
  }
}

export function closeDeviceEdit() {
  return {
    type: 'CLOSE_DEVICE_EDIT',
  };
}

export function fetchDeviceNetwork(mac) {
  return (dispatch, getState) => {
    const query = {
      mac: mac
    };
    dispatch(reqeustFetchDeviceNetwork(mac));

    utils.fetch(urls.fetchDeviceInfo, query)
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          dispatch(reciveFetchDeviceNetwork(json.data));
        }
      });
  };
}


export function saveDeviceNetwork(mac) {
  return (dispatch, getState) => {
    const data = getState().devices.get('edit').toJS();
    
    dispatch(appActions.requestSave());
    
    utils.save(urls.setDevice, data)
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          dispatch(closeDeviceEdit());
          dispatch(fetchDevices());
        }
        
        dispatch(appActions.receiveSave());
      });
  };
}

