import { fromJS } from 'immutable';

const defaultState = fromJS({
  userPop: false,
  rateInterval: 5000,
  sidebar: false,
});

export default function (state = defaultState, action) {
  switch (action.type) {
    case 'SHOW_USER_POP':
      return state.set('userPop', !!action.isShow);

    default:
  }
  return state;
}
