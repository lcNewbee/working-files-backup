import utils from 'utils';

const urls = {
  fetch: "/goform/getDevGroup"
}
export function reqeustFetchDeviceGroups() {
  return {
    type: 'REQEUST_FETCH_DEVICE_GROUPS'
  };
}

export function receiveDeviceGroups(data) {
  return {
    type: 'RECEIVE_DEVICE_GROUPS',
    data: data,
    updateAt: Date.now()
  };
}

export function editDeviceGroups(id) {
  return {
    type: 'EDIT_GROUP',
    id: id
  };
}

export function removeEditDeviceGroups() {
  return {
    type: 'REMOVE_EDIT_GROUP',
  };
}

export function addDeviceGroups() {
  return {
    type: 'ADD_GROUP'
  };
}

export function deleteDeviceGroups(id) {
  return {
    type: 'DELETE_DEVICE_GROUP',
    id: id
  };
}

export function fetchDeviceGroups() {
  return dispatch => {
    dispatch(reqeustFetchDeviceGroups());

    utils.fetch(urls.fetch)
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          dispatch(receiveDeviceGroups(json.data));
        }
      });
  };
}

