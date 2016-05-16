import utils from 'utils';

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

export function fetchStatus() {
  return (dispatch, getState) => {
    var query = getState().status.get('query').toJS();
    
    dispatch(reqeustStats());

    utils.fetch('/goform/getApClientInfo', query)
      .then(function(json) {
        if(json.state && json.state.code === 2000) {
          dispatch(reveviceStats(json.data))
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