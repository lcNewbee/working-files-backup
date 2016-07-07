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

export function createModal(data) {
  return {
    type: 'CREATE_MODAL',
    data
  }
}

export function changeModalState(data) {
  return {
    type: 'CHANGE_MODAL_STATE',
    data
  }
}

export function closeModal(data) {
  return (dispatch, getState) => {
    var handleOk = getState().app.getIn(['modal', 'apply']);

    if(data.status === 'ok') {
      handleOk();
    }

    dispatch(changeModalState(data));
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


/**
 * Ajax
 */
export function requestSave() {
  return {
    type: 'REQUEST_SAVE'
  }
}

export function receiveSave(state) {
  return {
    type: 'RECEIVE_SAVE',
    savedAt: Date.now(),
    state
  }
}

export function receiveAjaxError(url) {
  return {
    type: 'RECEIVE_AJAX_ERROR',
    errorAt: Date.now(),
    url
  }
}

export function receiveServerError(state) {
  return {
    type: 'RECEIVE_SERVER_ERROR',
    errorAt: Date.now(),
    state
  }
}

export function aFetch(url, query) {
  return (dispatch, getState) => {

    return utils.fetch(url, query)
      .then(function(json) {
        if(!json.state || (json.state && json.state.code !== 2000)) {
          dispatch(receiveServerError(json.state));
        }
        return json.data;
      })
      .catch(function(error) {
        dispatch(receiveAjaxError(url));
      });
  }
}


/**
 * Validate data
 */
export function startValidateAll() {
  return {
    type: 'START_VALIDATE_ALL',
    validateAt: Date.now()
  }
}
export function validateAll(func) {
  return (dispatch, getState) => {
    dispatch(startValidateAll());

    setTimeout(() => {
      const invalid = getState().app.get('invalid');

      if(typeof func === 'function') {
        func(invalid)
      }
    }, 20)
  }
}

export function resetVaildateMsg() {
  return {
    type: 'RESET_VAILDATE_MSG'
  }
}

export function reportValidError(data) {
  return {
    type: 'REPORT_VALID_ERROR',
    data
  }
}
