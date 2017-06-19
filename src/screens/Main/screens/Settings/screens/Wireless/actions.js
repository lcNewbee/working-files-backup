import utils from 'shared/utils';
import { actions as appActions } from 'shared/containers/app';
import urls from 'shared/config/urls';

// Fetch
export function reqeustFetchWifi() {
  return {
    type: 'REQEUST_FETCH_WIFI',
  };
}
export function receiveWifi(data, frequencyValue) {
  return {
    type: 'RECEIVE_WIFI',
    updateAt: Date.now(),
    data,
    frequencyValue,
  };
}
export function fetchWifiSettings(frequencyValue) {
  return (dispatch) => {
    dispatch(reqeustFetchWifi());

    return dispatch(appActions.fetch(urls.fetchWifi))
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          dispatch(receiveWifi(json.data, frequencyValue));
        }
      });
  };
}

// handle user custom action
export function changeWifiGroup(name, frequencyValue) {
  return {
    type: 'CHANGE_WIFI_GROUP',
    name,
    frequencyValue,
  };
}

export function changeWifiFrequency(frequencyValue) {
  return {
    type: 'CHANGE_FREQUENCY',
    frequencyValue,
  };
}
export function changeWifiSettings(data) {
  return {
    type: 'CHANGE_WIFI_SETTINGS',
    data,
  };
}

// Set
export function reqeustSetWifi() {
  return {
    type: 'REQEUST_SET_WIFI',
  };
}
export function receiveSetWifi() {
  return {
    type: 'RECEIVE_SET_WIFI',
  };
}
export function setWifi() {
  return (dispatch, getState) => {
    const data = getState().wireless.getIn(['data', 'curr']);

    dispatch(appActions.save(urls.saveWifi, data))
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          dispatch(fetchWifiSettings());
        }
      });
  };
}
