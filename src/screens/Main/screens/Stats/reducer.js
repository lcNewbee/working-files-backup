import { Map, List, fromJS } from 'immutable';

function setFetching(state) {
  return state.update('fetching', val => true);
}

const defaultState = fromJS({
  fetching: false,
  isOfflineApShow: false,
  query: {
    sort_type: '1',
    time_type: 'today',
  },
  data: {
    apInfo: {},
    clientInfo: {

    },
    aplist: [],
    clientlist: [],
  },
  offlineAp: {
    query: {
      page: 1,
      size: 50,
    },
    list: [],
  },
});

function receiveOffilineApData(state, data) {
  if (data && data.list) {
    const dataOfflineList = data.list;
    const dataOfflineQuery = data.page;
    let i = 0;
    const size = data.list.length;
    const startIndex = (dataOfflineQuery.currPage - 1) * dataOfflineQuery.size;
    for (i; i < size; i += 1) {
      dataOfflineList[i].index = startIndex + i + 1;
    }
    const newData = {};
    newData.list = dataOfflineList;
    newData.query = dataOfflineQuery;
    return state.mergeIn(['offlineAp'], newData);
  }

  return state;
}


export default function (state = defaultState, action) {
  switch (action.type) {
    case 'REQEUST_STATS':
      return setFetching(state);

    case 'REVEVICE_STATS':
      return state.mergeIn(['data'], action.data);

    case 'CHANGE_STATS_QUERY':
      return state.mergeIn(['query'], action.data);

    case 'REVEVICE_FETCH_OFFLINE_AP':
      return receiveOffilineApData(state, action.data);
      // return state.mergeIn(['offlineAp'], action.data);

    case 'CHANGE_OFFLINE_AP_QUERY':
      return state.mergeIn(['offlineAp', 'query'], action.data);

    case 'SHOW_OFFLINE_AP':
      return state.set('isOfflineApShow', true);

    case 'HIDE_OFFLINE_AP':
      return state.set('isOfflineApShow', false);

    default:
  }
  return state;
}
