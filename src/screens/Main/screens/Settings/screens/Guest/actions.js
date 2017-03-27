import utils from 'shared/utils';
import { actions as appActions } from 'shared/containers/app';
import urls from 'shared/config/urls';

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

    dispatch(appActions.fetch(urls.fetchGuestInfo))
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

    dispatch(appActions.save(urls.saveGuest, data))
      .then(function(json){
        if (json.state && json.state.code === 2000) {
          dispatch(fetchGuestSettings());
        }
      });
  };
}
