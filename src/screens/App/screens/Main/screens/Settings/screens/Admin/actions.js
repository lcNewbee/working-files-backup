import utils from 'utils';

const urls = {
  save: "/goform/setAdmin",
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

export function savePassword() {
  return (dispatch, getState) => {
    const data = getState().admin.get('data');
    
    dispatch(reqeustSavePassword());

    utils.save(urls.save, data)
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          dispatch(receiveSavePassword(json.state));
          window.location.hash = '#';
        } else {
          dispatch(setPasswordError(json.state))
        }
      });
  };
}