import utils from 'shared/utils';
import { actions as appActions } from 'shared/containers/app';
import urls from 'shared/config/urls';

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

    dispatch(appActions.fetch(urls.fetchLog, query))
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

    dispatch(appActions.fetch(urls.clearAllLog))
      .then((json) => {
        dispatch(fetchLogs());
        dispatch(appActions.receiveSave(json.state))
      });
  }
}

