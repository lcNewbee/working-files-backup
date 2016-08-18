import { fromJS } from 'immutable';

const defaultState = fromJS({
  fetching: false,
  data: {
    list: [],
  },
  query: {
    type: '0',
    size: 20,
    page: 2,
  },
  actionQuery: {},
});

export default function (state = defaultState, action) {
  switch (action.type) {
    case 'REQEUST_FETCH_ALARM_EVENTS':
      return state.set('fetching', true);

    case 'RECIVE_FETCH_ALARM_EVENTS':
      return state.set('fetching', false)
        .set('updateAt', action.updateAt)
        .mergeIn(['data'], action.data);

    case 'CHANGE_ALARM_EVENTS_QUERY':
      return state.mergeIn(['query'], action.query);

    case 'LEAVE_ALARM_EVENTS_SCREEN':
      return state.mergeIn(['query'], {
        search: '',
      });

    default:
  }
  return state;
}
