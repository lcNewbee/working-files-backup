import utils from 'utils';

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
  const url = '/goform/getApDevInfo';
  
  return (dispatch, getState) => {
    const query = getState().devices.get('query').toJS();
    
    dispatch(reqeustFetchDevices());

    utils.fetch(url, query)
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          dispatch(reciveFetchDevices(json.data));
        }
      });
  };
}

export function saveDevicesAction(data) {
  const url = '/goform/setApAction';
  
  return (dispatch, getState) => {
    //const query = getState().devices.get('query').toJS();
    
    dispatch(reqeustFetchDevices());

    utils.save(url, data)
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          dispatch(fetchDevices(json.data));
        }
      });
  };
}

