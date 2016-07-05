import {Map, List, fromJS} from 'immutable';

const defaultState = fromJS({
  fetching: false,
  data: {
    list: []
  },
  query: {
    type: 0,
    size: 20,
    page: 1
  },
  actionQuery: {}
});

export default function(state = defaultState, action) {
  switch (action.type) {
    case 'REQEUST_FETCH_LOG':
      return state.set('fetching', true);

    case 'RECIVE_FETCH_LOGS':
      return state.set('fetching', false)
        .set('updateAt', action.updateAt)
        .mergeIn(['data'], action.data);

    case 'CHANGE_LOGS_QUERY':
      return state.mergeIn(['query'], action.query);
    
    case "CHANGE_LOG_ACTION_QUERY":
      return state.mergeIn(['actionQuery'], action.actionQuery);

  }
  return state;
};
