import { fromJS } from 'immutable';
import guiConfig from './app.json';

let guiVersion = guiConfig.version.replace(/\./g, '');
const defaultState = fromJS({
  saving: false,
  guiName: guiConfig.name,
  rateInterval: 15000,
  invalid: {},
  modal: {
    role: 'alert',
  },
  propertyData: {
    show: false,
    items: [],
  },
  noControl: false,
});

guiVersion = `.${guiVersion}`;

function receiveReport(state, data) {
  let ret;

  if (!data.checkResult) {
    ret = state.deleteIn(['invalid', data.name]);
  } else {
    ret = state.setIn(['invalid', data.name], data.checkResult);
  }

  return ret;
}

function receiveAcInfo(state, action) {
  const myData = fromJS(action.data)
    .set('version', action.data.version + guiVersion);

  return state.set('fetching', false).merge(myData);
}

export default function (state = defaultState, action) {
  switch (action.type) {

    case 'START_VALIDATE_ALL':
      return state.set('validateAt', action.validateAt)
          .set('invalid', fromJS({}));

    case 'RESET_VAILDATE_MSG':
      return state.set('invalid', fromJS({}));

    /**
     * Ajax
     */
    case 'REQUEST_SAVE':
      return state.set('saving', true);

    case 'RECEIVE_SAVE':
      return state.set('saving', false)
        .set('savedAt', action.savedAt)
        .set('state', action.state);

    case 'RECEIVE_AJAX_ERROR':
      return state.set('ajaxError', {
        url: action.url,
      });

    case 'RECEIVE_SERVER_ERROR':
      return state.set('state', action.state);

    case 'REPORT_VALID_ERROR':
      return receiveReport(state, action.data);

    case 'CHANGE_LOGIN_STATUS':
      sessionStorage.setItem('a_165F8BA5ABE1A5DA', action.data);
      return state;

    case 'REFRESH_ALL':
      return state.set('refreshAt', action.refreshAt);

    case 'REQUEST_FETCH_AC_INFO':
      return state.set('fetching', true);

    case 'RECIVECE_FETCH_AC_INFO':
      return receiveAcInfo(state, action);

    case 'CREATE_MODAL':
      return state.set('modal', fromJS({
        status: 'show',
        role: 'alert',
        title: _('MESSAGE'),
      })).mergeIn(['modal'], action.data);

    case 'CHANGE_MODAL_STATE':
      return state.mergeIn(['modal'], action.data);

    case 'changePropertyStatus':
      return state.setIn();

    default:
  }
  return state;
}
