import utils from 'utils';
import * as appActions from 'actions/app';

let refreshTimeout = null;
const urls = {
  fetch: '/goform/getApClientInfo',
  offlineAp: '/goform/getOfflineDevInfo'
}

function reqeustStats() {
  return {
    type: 'REQEUST_STATS'
  };
}

export function reveviceStats(data) {
  return {
    type: 'REVEVICE_STATS',
    data
  };
}

export function leaveStatusScreen() {
  window.clearTimeout(refreshTimeout);

  return {
    type: 'LEAVE_STATUS_SCREEN'
  };
}

export function fetchStatus() {
  return (dispatch, getState) => {
    var query = getState().status.get('query').toJS();
    const refreshTime = getState().app.get('rateInterval');

    window.clearTimeout(refreshTimeout)
    dispatch(reqeustStats());

    dispatch(appActions.fetch(urls.fetch, query))
      .then(function(json) {
        if(json.state && json.state.code === 2000) {
          dispatch(reveviceStats(json.data))
        }

        if(refreshTime > 0) {
          refreshTimeout = window.setTimeout(function() {
            dispatch(fetchStatus())
          }, refreshTime)
        }
      })
  };
}

export function changeStatsQuery(data) {
  return {
    type: 'CHANGE_STATS_QUERY',
    data
  };
}

function reqeustFetchOfflineAp() {
  return {
    type: 'REQEUST_FETCH_OFFLINE_AP'
  };
}

export function reveviceFetchOfflineAp(data) {
  return {
    type: 'REVEVICE_FETCH_OFFLINE_AP',
    data
  };
}

export function changeOfflineApQuery(data) {
  return {
    type: 'CHANGE_OFFLINE_AP_QUERY',
    data
  };
}

export function fetchOfflineAp() {
  return (dispatch, getState) => {
    const query = getState().status.getIn(['offlineAp', 'query']).toJS();

    dispatch(reqeustFetchOfflineAp());

    dispatch(appActions.fetch(urls.offlineAp, query))
      .then(function(json) {
        if(json.state && json.state.code === 2000) {
          dispatch(reveviceFetchOfflineAp(json.data))
        }
      })
  };
}
