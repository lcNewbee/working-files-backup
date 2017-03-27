import utils from 'shared/utils';
import { actions as appActions } from 'shared/containers/app';
import urls from 'shared/config/urls';

let refreshTimeout = null;

function reqeustStats() {
  return {
    type: 'REQEUST_STATS',
  };
}

export function reveviceStats(data) {
  return {
    type: 'REVEVICE_STATS',
    data,
  };
}

export function leaveStatusScreen() {
  window.clearTimeout(refreshTimeout);

  return {
    type: 'LEAVE_STATUS_SCREEN',
  };
}

export function showOfflineAp() {
  return {
    type: 'SHOW_OFFLINE_AP',
  };
}

export function hideOfflineAp() {
  return {
    type: 'HIDE_OFFLINE_AP',
  };
}

export function fetchStatus() {
  return (dispatch, getState) => {
    var query = getState().status.get('query').toJS();
    const refreshTime = getState().app.get('rateInterval');

    window.clearTimeout(refreshTimeout)
    dispatch(reqeustStats());

    dispatch(appActions.fetch(urls.fetchStatsInfo, query))
      .then(function (json) {
        if (json.state && json.state.code === 2000) {
          dispatch(reveviceStats(json.data))
        }

        if (refreshTime > 0) {
          refreshTimeout = window.setTimeout(function () {
            dispatch(fetchStatus())
          }, refreshTime)
        }
      })
  };
}

export function changeStatsQuery(data) {
  return {
    type: 'CHANGE_STATS_QUERY',
    data,
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

    dispatch(appActions.fetch(urls.fetchOfflineAp, query))
      .then(function (json) {
        if (json.state && json.state.code === 2000) {
          dispatch(reveviceFetchOfflineAp(json.data))
        }
      })
  };
}

export function deleteOfflineAp(mac) {
  return (dispatch, getState) => {
    var subData = {
      mac: mac
    };

    dispatch(appActions.save(urls.deleteOfflineAp, subData))
      .then(function (json) {
        if (json.state && json.state.code === 2000) {
          dispatch(fetchOfflineAp(5000))
        }
      });
  };
}
