import { fromJS } from 'immutable';

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

    default:

  }
  return state;
}
