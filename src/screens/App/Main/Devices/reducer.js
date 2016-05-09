import { fromJS } from 'immutable';

const defaultState = fromJS({
  fetching: false,
  data: {
    list: [],
  },
  query: {
    devicetype: 0,
    size: 20,
    page: 1
  },
});

export default function (state = defaultState, action) {
  switch (action.type) {
    case 'REQEUST_FETCH_DEVICE':
      return state.set('fetching', true);

    case 'RECIVE_FETCH_DEVICES':
      return state.set('fetching', false)
        .set('updateAt', action.updateAt)
        .mergeIn(['data'], action.data);

    case 'CHANGE_DEVICES_QUERY':
      return state.mergeIn(['query'], action.query);
    default:

  }
  return state;
}
