import utils from 'utils';

export function reqeustFetchDevices() {
  return {
    type: 'REQEUST_FETCH_DEVICE'
  };
}

export function reciveFetchDevices(data) {
  return {
    type: 'RECIVE_FETCH_DEVICES',
    updateAt: Date.now(),
    data
  };
}

export function changeDevicesQuery(query) {
  return {
    type: 'CHANGE_DEVICES_QUERY',
    query
  };
}

export function rebootDevice(id) {
  return {
    type: 'REBOOT_DEVICE',
    id
  };
}

export function resetDevice(id) {
  return {
    type: 'RESET_DEVICE',
    id
  };
}

export function locateDevice(id) {
  return {
    type: 'LOCATE_DEVICE',
    id
  };
}

export function fetchDevices(url) {
  return (dispatch, getState) => {
    let query = getState().devices.get('query').toJS();

    dispatch(reqeustFetchDevices());

    utils.fetch(url, query)
      .then(function(json) {
        if(json.state && json.state.code === 2000) {
          dispatch(reciveFetchDevices(json.data))
        }
      });
  };
}

