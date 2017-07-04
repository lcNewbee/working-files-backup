import { fromJS, Map } from 'immutable';

const defaultState = fromJS({
  saving: false,
  data: {
    oldpasswd: '',
    newpasswd: '',
    confirmpasswd: '',
  },
  countryData: {
    fetching: false,
    data: {
      country: 'CN',
    },
  },
});

export default function (state = defaultState, action) {
  switch (action.type) {
    case 'CHANGE_PASSWORD_SETTINGS':
      return state.mergeIn(['data'], action.data);

    case 'REQEUST_SAVE_PASSWORD':
      return state.set('saving', true);

    case 'RECEIVE_SAVE_PASSWORD':
      return state.set('saving', false)
        .set('state', action.state);

    case 'RESET_PASSWORD':
      return state.mergeIn(['data'], {
        oldpasswd: '',
        newpasswd: '',
        confirmpasswd: '',
      }).set('state', Map({}));

    case 'SET_PASSWORD_ERROR':
      return state.set('state', fromJS(action.state));

    case 'REQEUST_FETCH_COUNTRYDATA':
      return state.setIn(['countryData', 'fetching'], true);
    case 'RECEIVE_COUNTRYDATA':
      return state.setIn(['countryData', 'fetching'], false)
          .mergeDeepIn(['countryData', 'data'], action.data);
    default:

  }
  return state;
}
