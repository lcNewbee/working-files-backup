import {Map, List, fromJS} from 'immutable';

function getControlStatus() {
  var ret = false;
  var a_165F8BA5ABE1A5DA = '0';

  if(sessionStorage && sessionStorage.getItem('a_165F8BA5ABE1A5DA') !== null) {
    a_165F8BA5ABE1A5DA = sessionStorage.getItem('a_165F8BA5ABE1A5DA');
  }

  ret = typeof a_165F8BA5ABE1A5DA === 'string' && a_165F8BA5ABE1A5DA === '0';

  return ret;
};

function clearLoginSession() {
  if(typeof sessionStorage.removeItem === 'function') {
    sessionStorage.removeItem('a_165F8BA5ABE1A5DA')
  }
}

const defaultState = fromJS({
  saving: false,
  version: '1.0.4',
  rateInterval: 15000,
  invalid: {},
  noControl: false
});

function receiveReport(state, data) {
  var ret;

  if(!data.checkResult) {
    ret = state.deleteIn(['invalid', data.name]);
  } else {
    ret = state.setIn(['invalid', data.name], data.checkResult);
  }

  return ret;
}

export default function( state = defaultState, action ) {

  switch (action.type) {
    case 'START_VALIDATE_ALL':
      return state.set('validateAt', action.validateAt)
          .set('invalid', Map({}));

    case 'RESET_VAILDATE_MSG':
      return state.set('invalid', Map({}));

    case 'REQUEST_SAVE':
      return state.set('saving', true);

    case 'RECEIVE_SAVE':
      return state.set('saving', false)
        .set('savedAt', action.savedAt)
        .set('state', action.state);

    case 'REPORT_VALID_ERROR':
      return receiveReport(state, action.data);

    case "CHANGE_LOGIN_STATUS":
      sessionStorage.setItem('a_165F8BA5ABE1A5DA', action.data);
      return state;

    case 'REFRESH_ALL':
      return state.set('refreshAt', action.refreshAt);

    default:
  }
  return state;
};
