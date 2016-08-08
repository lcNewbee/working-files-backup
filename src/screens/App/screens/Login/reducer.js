import { fromJS } from 'immutable';

export default function (
  state = fromJS({
    fetching: false,
    data: {
      username: '',
      password: '',
    },
  }), action) {
  switch (action.type) {
    case 'UPDATE_DATA':
      return state.update('data', obj => obj.merge(action.data));

    case 'RESET_DATA':
      return state.set('data', fromJS({
        username: '',
        password: '',
      }));

    case 'REQEUST_LOGIN':
      return state.set('fetching', true)
        .set('status', '');

    case 'RESPONSE_LOGIN':
      return state.merge({
        fetching: false,
        status: action.result,
        loginedAt: action.loginedAt,
      });
    default:
  }
  return state;
}

