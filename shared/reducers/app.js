import { fromJS } from 'immutable';

let guiVersion;

const defaultState = fromJS({
  fetching: false,
  saving: false,
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
const ajaxTypeMap = {
  save: 'saving',
  fetch: 'fetching',
};

function initConfig(state, payload) {
  guiVersion = payload.version.replace(/\./g, '');
  guiVersion = `.${guiVersion}`;

  return state.set('config', payload)
    .set('guiName', payload.title);
}

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
    case 'INIT_APP_CONFIG':
      return initConfig(state, action.payload);

    /**
     * 全局数据验证
     */
    case 'START_VALIDATE_ALL':
      return state.set('validateAt', action.validateAt)
          .set('invalid', fromJS({}));

    case 'RESET_VAILDATE_MSG':
      return state.set('invalid', fromJS({}));

    case 'REPORT_VALID_ERROR':
      return receiveReport(state, action.data);

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
      return state
        .mergeIn(['ajaxError'], action.payload)
        .set(ajaxTypeMap[action.payload.type], false);

    case 'RECEIVE_SERVER_ERROR':
      return state.set('state', action.state);

    case 'RQ_FETCH':
      return state.set('fetching', true);

    case 'RC_FETCH':
      return state.set('fetching', false);

    /**
     * 登录状态
     */
    case 'CHANGE_LOGIN_STATUS':
      sessionStorage.setItem('a_165F8BA5ABE1A5DA', action.data);
      return state;

    case 'REFRESH_ALL':
      return state.set('refreshAt', action.refreshAt);

    // 获取 设备基本配置信息
    case 'REQUEST_FETCH_AC_INFO':
      return state.set('fetching', true);

    case 'RECIVECE_FETCH_AC_INFO':
      return receiveAcInfo(state, action);

    // 全局摸态框通知
    case 'CREATE_MODAL':
      return state.set('modal', fromJS({
        status: 'show',
        role: 'alert',
        title: _('MESSAGE'),
      })).mergeIn(['modal'], action.data);

    case 'CHANGE_MODAL_STATE':
      return state.mergeIn(['modal'], action.data);

    default:
  }
  return state;
}
