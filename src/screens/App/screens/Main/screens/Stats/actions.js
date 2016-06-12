import utils from 'utils';

let refreshTimeout = null;

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

    utils.fetch('/goform/getApClientInfo', query)
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

export function fetchOfflineAp() {
  return (dispatch, getState) => {
    const query = {
        page: 1,
        size: 100
    };
    
    dispatch(reqeustFetchOfflineAp());

    utils.fetch('/goform/getOfflineDevInfo', {query})
      .then(function(json) {
        if(json.state && json.state.code === 2000) {
          dispatch(reveviceFetchOfflineAp(json.data))
        }
      })
  };
}