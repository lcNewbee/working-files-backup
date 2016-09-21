import * as appActions from 'shared/actions/app';
import urls from 'shared/config/urls_axc';

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

export function saveMainModal() {

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

export function rqFetchApGroup() {
  return {
    type: 'RQ_DELETE_AP_GROUP',
  };
}

export function rcFetchApGroup(data) {
  return {
    type: 'RC_DELETE_AP_GROUP',
    data,
  };
}

export function fetchApGroup() {
  return (dispatch) => {
    dispatch(appActions.fetch(urls.fetchGroups))
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          dispatch(rcFetchApGroup(json.data));
        }
      });
  };
}

function rcFetchGroupAps(data) {
  return {
    type: 'RC_FETCH_GROUP_APS',
    data,
  };
}

export function fetchGroupAps() {
  return (dispatch, getState) => {
    const productState = getState().product;
    const query = {
      groupId: productState.getIn(['group', 'selected', 'id']),
    };

    dispatch(appActions.fetch(urls.fetchGroupDevs, query))
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          dispatch(rcFetchGroupAps(json.data));
        }
      });
  };
}

export function selectAddApGroupDevice(data) {
  return {
    type: 'SELECT_ADD_AP_GROUP_DEVICE',
    data,
  };
}
