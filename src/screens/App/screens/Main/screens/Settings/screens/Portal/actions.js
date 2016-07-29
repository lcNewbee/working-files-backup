import utils from 'shared/utils';
import * as appActions from 'shared/actions/app';
import urls from 'shared/config/urls';

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

    dispatch(appActions.fetch(urls.fetchPortal))
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

    dispatch(appActions.save(urls.savePortal, data))
      .then(function(json){
        if (json.state && json.state.code === 2000) {
          dispatch(fetchPortalSettings());
        }
      });

  };
}
