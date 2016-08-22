import utils from '../utils';

const APP_CONFIG = {
  fetchInfo: '/goform/getAcInfo',
};

export function refreshAll() {
  return {
    type: 'REFRESH_ALL',
    refreshAt: Date.now(),
  };
}

export function changeLoginStatus(data) {
  return {
    type: 'CHANGE_LOGIN_STATUS',
    data,
  };
}

export function createModal(data) {
  return {
    type: 'CREATE_MODAL',
    data,
  };
}

export function changeModalState(data) {
  return {
    type: 'CHANGE_MODAL_STATE',
    data,
  };
}

export function closeModal(data) {
  return (dispatch, getState) => {
    const handleOk = getState().app.getIn(['modal', 'apply']);

    if (data.status === 'ok' && typeof handleOk === 'function') {
      handleOk();
    }

    dispatch(changeModalState(data));
  };
}

export function requestFetchAcInfo() {
  return {
    type: 'REQUEST_FETCH_AC_INFO',
  };
}
export function receiveFetchAcInfo(data) {
  return {
    type: 'RECIVECE_FETCH_AC_INFO',
    data,
  };
}

export function fetchAcInfo() {
  return (dispatch) => {
    dispatch(requestFetchAcInfo());

    utils.fetch(APP_CONFIG.fetchInfo)
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          dispatch(receiveFetchAcInfo(json.data));
        }
      });
  };
}


/**
 * Ajax
 */
export function requestSave() {
  return {
    type: 'REQUEST_SAVE',
  };
}

export function receiveSave(state) {
  return {
    type: 'RECEIVE_SAVE',
    savedAt: Date.now(),
    state,
  };
}

export function receiveAjaxError(url) {
  return {
    type: 'RECEIVE_AJAX_ERROR',
    errorAt: Date.now(),
    url,
  };
}

export function receiveServerError(state) {
  return {
    type: 'RECEIVE_SERVER_ERROR',
    errorAt: Date.now(),
    state,
  };
}

/**
 * 全局Ajax fetch action
 */
export function rqFetch() {
  return {
    type: 'RQ_FETCH',
  };
}
export function rcFetch() {
  return {
    type: 'RC_FETCH',
  };
}
export function fetch(url, query) {
  return (dispatch) => {
    dispatch(rqFetch());

    return utils.fetch(url, query)
      .then((json) => {
        if (json === undefined) {
          return {};
        }
        if (!json.state || (json.state && json.state.code !== 2000)) {
          dispatch(receiveServerError(json.state));
        }
        dispatch(rcFetch());

        return json;
      })
      .catch(() => {
        dispatch(receiveAjaxError(url));
      });
  };
}

/**
 * 全局Ajax save action
 */
export function save(url, query) {
  return (dispatch) => {
    dispatch(requestSave());

    return utils.save(url, query)
      .then((json) => {
        if (json === undefined) {
          return {};
        }
        if (!json.state || (json.state && json.state.code !== 2000)) {
          dispatch(receiveServerError(json.state));
        }
        dispatch(receiveSave());
        return json;
      })
      .catch(() => {
        dispatch(receiveAjaxError(url));
      });
  };
}


/**
 * Validate data
 */
export function startValidateAll() {
  return {
    type: 'START_VALIDATE_ALL',
    validateAt: Date.now(),
  };
}
export function validateAll(func) {
  return (dispatch, getState) => {
    const validatePromise = new Promise((resolve) => {
      setTimeout(() => {
        const invalid = getState().app.get('invalid');

        if (typeof func === 'function') {
          func(invalid);
        }
        resolve(invalid);
      }, 20);
    });

    dispatch(startValidateAll());

    return validatePromise;
  };
}

export function resetVaildateMsg() {
  return {
    type: 'RESET_VAILDATE_MSG',
  };
}

export function reportValidError(data) {
  return {
    type: 'REPORT_VALID_ERROR',
    data,
  };
}
