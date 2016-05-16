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
export function receiveSavePassword() {
  return {
    type: "RECEIVE_SAVE_PASSWORD",
    savedAt: Date.now(),
  }
}

export function savePassword() {
  return (dispatch, getState) => {
    const data = getState().password.get('data');
    
    dispatch(reqeustSavePassword());

    utils.save(urls.save, data)
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          dispatch(receiveSavePassword());
        }
      });
  };
}