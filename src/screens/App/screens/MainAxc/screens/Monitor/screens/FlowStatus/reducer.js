import { Map, List, fromJS } from 'immutable';

const defaultState = fromJS({
  fetching: false,
  data: {
    list: [],
  },
  query: {
    type: '0',
    size: 20,
    page: 1,
  },
  actionQuery: {},
});

export default function (state = defaultState, action) {
  switch (action.type) {
    case 'REQEUST_FETCH_FlOW':
      return state.set('fetching', true);

    case 'RECIVE_FETCH_FlOW':
      return state.set('fetching', false)
        .set('updateAt', action.updateAt)
        .mergeIn(['data'], action.data);

    case 'CHANGE_FlOW_QUERY':
      return state.mergeIn(['query'], action.query);

    case 'CHANGE_FlOW_ACTION_QUERY':
      return state.mergeIn(['actionQuery'], action.actionQuery);

    case 'LEAVE_FlOW_SCREEN':
      return state.mergeIn(['query'], {
        search: '',
      });

    default:

  }
  return state;
}
