import utils from 'utils';
import * as appActions from 'actions/ajax';

const urls = {
  fetch: "/goform/getPortal",
  save: "/goform/setPortalInfo",
  upload: "/goform/setPortalImage",
}

// Fetch
export function reqeustFetchPortal() {
  return {
    type: "REQEUST_FETCH_PORTAL"
  }
}
export function receivePortal(data) {
  return {
    type: "RECEIVE_PORTAL",
    updateAt: Date.now(),
    data
  }
}
export function fetchPortalSettings() {
  
  return dispatch => {
    dispatch(reqeustFetchPortal());

    utils.fetch(urls.fetch)
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          dispatch(receivePortal(json.data));
        }
      });
  };
}

// handle user custom action
export function changePortalGroup(name) {
  return {
    type: "CHANGE_PORTAL_GROUP",
    name
  }
}

export function changePortalSettings(data) {
  return {
    type: "CHANGE_PORTAL_SETTINGS",
    data
  }
}

// Set 
export function reqeustSetPortal() {
  return {
    type: "REQEUST_SET_PORTAL"
  }
}
export function receiveSetPortal() {
  return {
    type: "RECEIVE_SET_PORTAL"
  }
}
export function setPortal() {
  return (dispatch, getState) => {
    const data = getState().portal.getIn(['data', 'curr']).delete('image');
    
    dispatch(appActions.requestSave());

    utils.save(urls.save, data)
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          dispatch(receivePortal());
          dispatch(fetchPortalSettings());
        }
        
        dispatch(appActions.receiveSave());
      });
  };
}