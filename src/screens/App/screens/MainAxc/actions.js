import * as appActions from 'shared/actions/app';

export function toggleMainPopOver(option) {
  return {
    type: 'TOGGLE_MAIN_POP_OVER',
    option,
  };
}

export function showMainModal(option) {
  return {
    type: 'SHOW_MAIN_MODAL',
    option,
  };
}

export function showPrevMainModal() {
  return {
    type: 'SHOW_PREV_MAIN_MODAL',
  };
}

export function selectVlan(id) {
  return {
    type: 'SELECT_VLAN',
    id,
  };
}

export function selectGroup(id) {
  return {
    type: 'SELECT_GROUP',
    id,
  };
}
export function selectManageGroup(id) {
  return {
    type: 'SELECT_MANAGE_GROUP',
    id,
  };
}
export function selectManageGroupAp(data) {
  return {
    type: 'SELECT_MANAGE_GROUP_AP',
    payload: data,
  };
}

// 获取
export function rcFetchApGroup(data) {
  return {
    type: 'RC_FETCH_AP_GROUP',
    payload: data,
  };
}
export function fetchApGroup() {
  return dispatch => dispatch(appActions.fetch('goform/group'))
    .then((json) => {
      if (json.state && json.state.code === 2000) {
        dispatch(rcFetchApGroup(json.data));
      }
    });
}

// 获取组内 AP
function rcFetchGroupAps(json, isDefault) {
  return {
    type: 'RC_FETCH_GROUP_APS',
    payload: json.data,
    meta: isDefault,
  };
}

export function fetchGroupAps(id) {
  return (dispatch, getState) => {
    const productState = getState().product;
    const groupid = id || productState.getIn(['group', 'selected', 'id']);
    const query = {
      groupid,
    };
    const isDefault = groupid === -1;

    // 如果没有 groupid 不请求数据
    if (!groupid && groupid !== 0) {
      return null;
    }

    return dispatch(appActions.fetch('goform/group/aps', query))
      .then((json) => {
        if (json) {
          dispatch(rcFetchGroupAps(json, isDefault));
        }
      });
  };
}

export function selectAddApGroupDevice(data) {
  return {
    type: 'SELECT_ADD_AP_GROUP_DEVICE',
    payload: data,
  };
}

export function updateAddApGroup(data) {
  return {
    type: 'UPDATE_ADD_AP_GROUP',
    payload: data,
  };
}

export function updateEditApGroup(data) {
  return {
    type: 'UPDATE_EDIT_AP_GROUP',
    payload: data,
  };
}
export function updateGroupAddDevice(data) {
  return {
    type: 'UPDATE_GROUP_ADD_DEVICE',
    payload: data,
  };
}

export function updateGroupMoveDevice(data) {
  return {
    type: 'UPDATE_GROUP_MOVE_DEVICE',
    payload: data,
  };
}
