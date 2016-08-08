import utils from 'shared/utils';
import * as appActions from 'shared/actions/app';
import urls from 'shared/config/urls';

// Fetch
export function reqeustFetchWifi() {
  return {
    type: "REQEUST_FETCH_WIFI"
  }
}
export function receiveWifi(data) {
  return {
    type: "RECEIVE_WIFI",
    updateAt: Date.now(),
    data
  }
}
export function fetchWifiSettings() {
  return dispatch => {
    dispatch(reqeustFetchWifi());

    dispatch(appActions.fetch(urls.fetchWifi))
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          dispatch(receiveWifi(json.data));
        }
      });
  };
}

// handle user custom action
export function changeWifiGroup(name) {
  return {
    type: "CHANGE_WIFI_GROUP",
    name
  }
}

export function changeWifiSettings(data) {
  return {
    type: "CHANGE_WIFI_SETTINGS",
    data
  }
}

// Set
export function reqeustSetWifi() {
  return {
    type: "REQEUST_SET_WIFI"
  }
}
export function receiveSetWifi() {
  return {
    type: "RECEIVE_SET_WIFI"
  }
}
export function setWifi() {
  return (dispatch, getState) => {
    const data = getState().wireless.getIn(['data', 'curr']);

    dispatch(appActions.save(urls.saveWifi, data))
      .then(function(json){
        if (json.state && json.state.code === 2000) {
          dispatch(fetchWifiSettings());
        }
      });
  };
}
