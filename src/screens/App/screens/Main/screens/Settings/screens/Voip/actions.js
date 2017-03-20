import utils from 'shared/utils';
import * as appActions from 'shared/actions/app';
import urls from 'shared/config/urls';

// Fetch
export function reqeustFetchVoip() {
  return {
    type: "REQEUST_FETCH_VOIP"
  }
}
export function receiveVoip(data) {
  return {
    type: "RECEIVE_VOIP",
    updateAt: Date.now(),
    data
  }
}
export function fetchVoipSettings() {
  return dispatch => {
    dispatch(reqeustFetchVoip());

    dispatch(appActions.fetch(urls.fetchVoip))
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          dispatch(receiveVoip(json.data));
        }
      });
  };
}

// handle user custom action
export function changeVoipGroup(name) {
  return {
    type: "CHANGE_VOIP_GROUP",
    name
  }
}

export function changeVoipSettings(data) {
  return {
    type: "CHANGE_VOIP_SETTINGS",
    data
  }
}

// Set
export function reqeustSetVoip() {
  return {
    type: "REQEUST_SET_VOIP"
  }
}
export function receiveSetVoip() {
  return {
    type: "RECEIVE_SET_VOIP"
  }
}
export function setVoip() {
  return (dispatch, getState) => {
    const data = getState().voip.getIn(['data', 'curr']);

    dispatch(appActions.save(urls.saveVoip, data))
      .then(function(json){
        if (json.state && json.state.code === 2000) {
          dispatch(fetchVoipSettings());
        }
      });
  };
}
