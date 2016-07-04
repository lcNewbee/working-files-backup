import utils from 'utils';

const APP_CONFIG = {
  fetchInfo: '/goform/getAcInfo'
};

export function refreshAll() {
  return {
    type: 'REFRESH_ALL',
    refreshAt: Date.now()
  }
}

export function changeLoginStatus(data) {
  return {
    type: 'CHANGE_LOGIN_STATUS',
    data
  }
}

export function requestFetchAcInfo() {
  return {
    type: 'REQUEST_FETCH_AC_INFO'
  }
}
export function receiveFetchAcInfo(data) {
  return {
    type: 'RECIVECE_FETCH_AC_INFO',
    data
  }
}

export function fetchAcInfo() {
  return (dispatch, getState) => {

    dispatch(requestFetchAcInfo());

    utils.fetch(APP_CONFIG.fetchInfo)
      .then(function(json) {
        if(json.state && json.state.code === 2000) {
          dispatch(receiveFetchAcInfo(json.data))
        }
      });
  };
}
