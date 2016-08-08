import utils from 'shared/utils';
import * as appActions from 'shared/actions/app';
import urls from 'shared/config/urls';

export function removeEditDeviceGroup() {
  return {
    type: 'REMOVE_EDIT_GROUP',
  };
}

export function addDeviceGroup() {
  return {
    type: 'ADD_GROUP'
  };
}

export function changeEditGroup(data) {
  return {
    type: 'CHANGE_EDIT_GROUP',
    data
  };
}

export function deleteDeviceGroup(groupname) {
  return {
    type: 'DELETE_DEVICE_GROUP',
    groupname
  };
}

export function editDeviceGroup(groupname) {
  return {
    type: 'EDIT_GROUP',
    groupname
  };
}

export function lookGroupDevices(groupname) {
  return {
    type: 'LOOK_GROUP_DEVICES',
    groupname
  };
}

// 选择或取消 设备
export function selectDevice(mac, unselect) {
  return {
    type: 'SELECT_DEVICE',
    mac,
    unselect
  }
}

// 获取组列表
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
export function fetchDeviceGroups() {
  return dispatch => {
    dispatch(reqeustFetchDeviceGroups());

    dispatch(appActions.fetch(urls.fetchGroups))
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          dispatch(receiveDeviceGroups(json.data));
        }
      });
  };
}

// 获取可配置的AP列表
export function reqeustFetchGroupDevices() {
  return {
    type: 'REQEUST_FETCH_GROUP_DEVICES'
  };
}
export function receiveGroupDevices(data) {
  return {
    type: 'RECEIVE_GROUP_DEVICES',
    data: data,
    updateAt: Date.now()
  };
}

export function fetchGroupDevices() {
  return dispatch => {
    dispatch(reqeustFetchGroupDevices());

    dispatch(appActions.fetch(urls.fetchGroupDevs))
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          dispatch(receiveGroupDevices(json.data));
        }
      });
  };
}

// 保存具体设备组
export function saveDeviceGroup() {
  return (dispatch, getState) => {
    const data = getState().groupSettings.get('edit').toJS();
    const actionType = getState().groupSettings.get('actionType');
    let saveUrl = urls.addGroup;


    if(actionType === 'edit') {
      saveUrl = urls.editGroup;
    }

    dispatch(appActions.save(saveUrl, data))
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          dispatch(fetchDeviceGroups());
          dispatch(removeEditDeviceGroup());
          dispatch(fetchGroupDevices());
        }
      });
  };
}

export function deleteDeviceGroup(groupname) {
  return (dispatch, getState) => {
    const data = {
      groupname
    };

    dispatch(reqeustFetchDeviceGroups());

    dispatch(appActions.save(urls.deleteGroup, data))
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          dispatch(fetchDeviceGroups());
          dispatch(fetchGroupDevices());
        }
      });
  };
}

