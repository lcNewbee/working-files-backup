import {Map, List, fromJS} from 'immutable';

function setFetching(state) {
  return state.update('fetching', val => true);
}

function updateData(state, name, value) {
  return state.updateIn(['data', name], val => value);
}

let defaultState = fromJS({
  fetching: false,
  query: {
    sort_type: '1',
    time_type: 'today'
  },
  data: {
    apInfo: {},
    clientInfo: {
      producerlist: {

      }
    },
    aplist: [],
    clientlist: []
  },
  offlineAp: {
    query: {
     page: 1,
     size: 50
    },
    list: []
  }
});

export default function(state = defaultState, action) {
  switch (action.type) {
    case 'REQEUST_STATS':
      return setFetching(state);

    case 'REVEVICE_STATS':
      return state.mergeIn(['data'], action.data);

    case 'CHANGE_STATS_QUERY':
      return state.mergeIn(['query'], action.data);

    case 'REVEVICE_FETCH_OFFLINE_AP':
      return state.mergeIn(['offlineAp'], action.data);

    case 'CHANGE_OFFLINE_AP_QUERY':
      return state.mergeIn(['offlineAp', 'query'], action.data);
  }
  return state;
};
