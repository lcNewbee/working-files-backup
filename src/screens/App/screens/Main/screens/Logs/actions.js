import utils from 'utils';
import * as appActions from 'actions/app';

const FETCH_URL = '/goform/getLogInfo';
const CLEAN_URL = '/goform/clearAllLogInfo'
let refreshTimeout = null;

export function reqeustFetchLogs() {
  return {
    type: 'REQEUST_FETCH_LOG'
  };
}

export function reciveFetchLogs(data) {
  return {
    type: 'RECIVE_FETCH_LOGS',
    updateAt: Date.now(),
    data
  };
}

export function changeLogsQuery(query) {
  return {
    type: 'CHANGE_LOGS_QUERY',
    query
  };
}
export function leaveLogsScreen() {
  window.clearTimeout(refreshTimeout);

  return {
    type: 'LEAVE_LOGS_SCREEN'
  };
}

export function fetchLogs() {
  return (dispatch, getState) => {
    const query = getState().logs.get('query').toJS();
    const refreshTime = getState().app.get('rateInterval');

    window.clearTimeout(refreshTimeout)
    dispatch(reqeustFetchLogs());

    dispatch(appActions.fetch(FETCH_URL, query))
      .then(function(json) {
        if(json.state && json.state.code === 2000) {
          dispatch(reciveFetchLogs(json.data))
        }

        if(refreshTime > 0) {
          refreshTimeout = window.setTimeout(function() {
            dispatch(fetchLogs())
          }, refreshTime)
        }
      });
  };
}

export function cleanAllLog() {
  return (dispatch) => {
    window.clearTimeout(refreshTimeout);
    dispatch(appActions.requestSave());

    dispatch(appActions.fetch(CLEAN_URL))
      .then((json) => {
        dispatch(fetchLogs());
        dispatch(appActions.receiveSave(json.state))
      });
  }
}

