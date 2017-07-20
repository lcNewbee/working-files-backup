import utils from 'shared/utils';
import urls from 'shared/config/urls';
import { actions as appActions } from 'shared/containers/app';

export function requestFetchCountryData() {
  return {
    type: 'REQEUST_FETCH_COUNTRYDATA',
  };
}
export function receiveCountryData(data) {
  return {
    type: 'RECEIVE_COUNTRYDATA',
    updateAt: Date.now(),
    data,
  };
}
export function fetchCountryData() {
  return (dispatch) => {
    dispatch(requestFetchCountryData());

    return dispatch(appActions.fetch(urls.fetchCountryData))
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          dispatch(receiveCountryData(json.data));
        }
        return json;
      });
  };
}

// Set country
export function setCountry(data) {
  return (dispatch) => {
    dispatch(appActions.save(urls.saveCountryData, data))
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          dispatch(fetchCountryData());
        }
      });
  };
}

export function changeCountry(data) {
  return {
    type: 'CHANGE_COUNTRY',
    data,
  };
}

export function changePasswordSettings(data) {
  return {
    type: 'CHANGE_PASSWORD_SETTINGS',
    data
  }
}

export function reqeustSavePassword() {
  return {
    type: "REQEUST_SAVE_PASSWORD"
  }
}
export function receiveSavePassword(state) {
  return {
    type: "RECEIVE_SAVE_PASSWORD",
    savedAt: Date.now(),
    state
  }
}
export function resetPassword() {
  return {
    type: "RESET_PASSWORD"
  }
}

export function setPasswordError(state) {
  return {
    type: "SET_PASSWORD_ERROR",
    state
  }
}

export function savePassword(callBack) {
  return (dispatch, getState) => {
    const data = getState().admin.get('data');

    dispatch(reqeustSavePassword());

    dispatch(appActions.save(urls.saveAdmin, data))
      .then(function(json){
        if (json.state && json.state.code === 2000) {
          dispatch(receiveSavePassword(json.state));
          window.location.hash = '#';

          if(typeof callBack === 'function') {
            callBack();
          }
        } else {
          dispatch(setPasswordError(json.state))
        }
      });
  };
}
