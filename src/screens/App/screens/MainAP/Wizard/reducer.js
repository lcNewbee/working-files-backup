import { fromJS } from 'immutable';

const defaultState = fromJS({
  fetching: false,
  data: {
    conutry: '',
    password: '',
    timeZone: (new Date()).getTimezoneOffset(),
  },
  currMode: 'fat',
  nextMode: '',
  showProgressBar: false,
});

export default function (state = defaultState, action) {
  switch (action.type) {
    case 'UPDATE_DATA':
      return state.update('data', obj => obj.merge(action.data));

    case 'REQEUST_LOGIN':
      return state.set('fetching', true)
        .set('status', '');

    case 'RESPONSE_LOGIN':
      return state.merge({
        fetching: false,
        status: action.result,
        loginedAt: action.loginedAt,
      });

    // Mine
    case 'CHANGE_CURRENT_MODE':
      return state.set('currMode', action.data);
    case 'CHANGE_SHOW_PROGRESS_BAR':
      return state.set('showProgressBar', action.data);
    case 'CHANGE_NEXT_MODE':
      return state.set('nextMode', action.data);
    default:
  }
  return state;
}

