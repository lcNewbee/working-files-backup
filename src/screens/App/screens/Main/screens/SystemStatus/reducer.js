import { fromJS } from 'immutable';

const defaultState = fromJS({
  firstRefresh: true,
});

export default function (state = defaultState, action) {
  switch (action.type) {
    case 'CHANGE_FIRST_REFRESH':
      return state.set('firstRefresh', action.data);
    default:
  }
  return state;
}
