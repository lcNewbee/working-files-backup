import utils from 'utils';
import * as appActions from 'actions/ajax';

const urls = {
  fetch: "/goform/getGuestInfo",
  save: "/goform/setGuestInfo",
}

// Fetch
export function reqeustFetchGuest() {
  return {
    type: "REQEUST_FETCH_GUEST"
  }
}
export function receiveGuest(data) {
  return {
    type: "RECEIVE_GUEST",
    updateAt: Date.now(),
    data
  }
}
export function fetchGuestSettings() {
  return dispatch => {
    dispatch(reqeustFetchGuest());

    utils.fetch(urls.fetch)
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          dispatch(receiveGuest(json.data));
        }
      });
  };
}

// handle user custom action
export function changeGuestGroup(name) {
  return {
    type: "CHANGE_GUEST_GROUP",
    name
  }
}

export function changeGuestSettings(data) {
  return {
    type: "CHANGE_GUEST_SETTINGS",
    data
  }
}

// Set 
export function reqeustSetGuest() {
  return {
    type: "REQEUST_SET_GUEST"
  }
}
export function receiveSetGuest() {
  return {
    type: "RECEIVE_SET_GUEST"
  }
}
export function setGuest() {
  return (dispatch, getState) => {
    const data = getState().guest.getIn(['data', 'curr']);
    
    dispatch(appActions.requestSave());

    utils.save(urls.save, data)
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          dispatch(receiveGuest());
          dispatch(fetchGuestSettings());
        }
        
        dispatch(appActions.receiveSave())
      });
  };
}