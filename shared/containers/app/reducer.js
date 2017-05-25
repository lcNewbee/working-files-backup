import { fromJS } from 'immutable';
import ACTION_TYPES from './actionTypes';

let guiVersion;

function getDefaltLogin() {
  let ret = sessionStorage.getItem('login');

  if (ret) {
    ret = JSON.parse(ret);
    ret.msg = '';
  } else {
    ret = {
      username: 'admin',

      // 用户权限管理
      purview: 'none',
      msg: '',
    };
  }

  return ret;
}

const defaultState = fromJS({
  fetching: false,
  saving: false,
  version: '',
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
  login: getDefaltLogin(),
  router: {
    routes: [],
  },
});
const ajaxTypeMap = {
  save: 'saving',
  fetch: 'fetching',
};

function initConfig(state, payload) {
  let versionCode = 0;

  guiVersion = payload.version.replace(/\./g, '');
  guiVersion = `${guiVersion}`;

  versionCode = payload.version.split('.').reduce(
    (x, y, index) => {
      let ret = parseInt(x, 10);
      const nextVal = parseInt(y, 10);

      if (index === 1) {
        ret = (10000 * ret) + (nextVal * 100);
      } else if (index === 2) {
        ret += nextVal;
      }

      return ret;
    },
  );

  // 把 appVersionCode 暴露到全局
  window.appVersionCode = versionCode;

  return state.set('config', payload)
    .set('guiName', payload.title || '')
    .set('versionCode', parseInt(versionCode, 10));
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
  let myData = fromJS(action.data);
  let versionsStr = guiVersion;

  if (action.data.version) {
    versionsStr = `${action.data.version}.${guiVersion}`;
  }

  myData = myData.set('version', versionsStr);

  return state.set('fetching', false).merge(myData);
}

function handleValidateAll(state, action) {
  const time = action.payload.validateAt;
  const formId = action.payload.formId || '__all__';

  return state.set('invalid', fromJS({}))
    .set('validateAt', `${formId}.${time}`);
}

function changeLoginState(state, action) {
  const newLogin = state.get('login').merge(action.payload).toJS();

  // sessionStorage.setItem('login', JSON.stringify(newLogin));
  sessionStorage.setItem('login', JSON.stringify(newLogin));

  return state.mergeIn(['login'], newLogin);
}

export default function (state = defaultState, action) {
  switch (action.type) {
    case ACTION_TYPES.UPDATE_ROUTER:
      return state.mergeIn(['router'], action.payload);

    /**
     * 全局数据验证
     */
    case ACTION_TYPES.START_VALIDATE_ALL:
      return handleValidateAll(state, action);

    case ACTION_TYPES.RESET_VALIDATE_MSG:
      return state.set('invalid', fromJS({}));

    case ACTION_TYPES.REPORT_VALID_ERROR:
      return receiveReport(state, action.data);

    /**
     * Ajax
     */
    case ACTION_TYPES.REQUEST_SAVE:
      return state.set('saving', true);

    case ACTION_TYPES.RECEIVE_SAVE:
      return state.set('saving', false)
        .set('savedAt', action.savedAt)
        .set('state', fromJS(action.state));

    case ACTION_TYPES.RECEIVE_AJAX_ERROR:
      console.error('Ajax Error = ', action.payload);
      return state
        .mergeIn(['ajaxError'], action.payload)
        .set(ajaxTypeMap[action.payload.type], false);

    case ACTION_TYPES.RECEIVE_SERVER_ERROR:
      return state.set('state', fromJS(action.payload));

    case ACTION_TYPES.RQ_FETCH:
      return state.set('fetching', true);

    case ACTION_TYPES.RC_FETCH:
      return state.set('fetching', false);

    /**
     * 登录状态
     */
    case ACTION_TYPES.CHANGE_LOGIN_STATUS:
      sessionStorage.setItem('a_165F8BA5ABE1A5DA', action.data);
      return state;
    case ACTION_TYPES.CHANGE_LOGIN_STATE:
      return changeLoginState(state, action);

    // 其他
    case ACTION_TYPES.REFRESH_ALL:
      return state.set('refreshAt', action.refreshAt);
    case ACTION_TYPES.RECEIVE_PRODUCT_INFO:
      return receiveAcInfo(state, action);

    // 全局摸态框通知
    case ACTION_TYPES.CREATE_MODAL:
      return state.set('modal', fromJS({
        status: 'show',
        role: 'alert',
        title: __('MESSAGE'),
      })).mergeIn(['modal'], action.data);

    case ACTION_TYPES.CHANGE_MODAL_STATE:
      return state.mergeIn(['modal'], action.data);

    case ACTION_TYPES.INIT_CONFIG:
      return initConfig(state, action.payload);

    default:
  }
  return state;
}
