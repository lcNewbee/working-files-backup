import { fromJS } from 'immutable';
import ACTIONS from 'shared/constants/action';

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
    case ACTIONS.UPDATE_ROUTER:
      return state.mergeIn(['router'], action.payload);

    /**
     * 全局数据验证
     */
    case ACTIONS.START_VALIDATE_ALL:
      return handleValidateAll(state, action);

    case ACTIONS.RESET_VAILDATE_MSG:
      return state.set('invalid', fromJS({}));

    case ACTIONS.REPORT_VALID_ERROR:
      return receiveReport(state, action.data);

    /**
     * Ajax
     */
    case ACTIONS.REQUEST_SAVE:
      return state.set('saving', true);

    case ACTIONS.RECEIVE_SAVE:
      return state.set('saving', false)
        .set('savedAt', action.savedAt)
        .set('state', fromJS(action.state));

    case ACTIONS.RECEIVE_AJAX_ERROR:
      console.error('Ajax Error = ', action.payload);
      return state
        .mergeIn(['ajaxError'], action.payload)
        .set(ajaxTypeMap[action.payload.type], false);

    case ACTIONS.RECEIVE_SERVER_ERROR:
      return state.set('state', fromJS(action.payload));

    case ACTIONS.RQ_FETCH:
      return state.set('fetching', true);

    case ACTIONS.RC_FETCH:
      return state.set('fetching', false);

    /**
     * 登录状态
     */
    case ACTIONS.CHANGE_LOGIN_STATUS:
      sessionStorage.setItem('a_165F8BA5ABE1A5DA', action.data);
      return state;

    case ACTIONS.REFRESH_ALL:
      return state.set('refreshAt', action.refreshAt);

    // 获取 设备基本配置信息
    case ACTIONS.REQUEST_FETCH_AC_INFO:
      return state.set('fetching', true);

    case ACTIONS.RECIVECE_FETCH_AC_INFO:
      return receiveAcInfo(state, action);

    // 全局摸态框通知
    case ACTIONS.CREATE_MODAL:
      return state.set('modal', fromJS({
        status: 'show',
        role: 'alert',
        title: __('MESSAGE'),
      })).mergeIn(['modal'], action.data);

    case ACTIONS.CHANGE_MODAL_STATE:
      return state.mergeIn(['modal'], action.data);

    // 修改登录状态
    case ACTIONS.CHANGE_LOGIN_STATE:
      return changeLoginState(state, action);

    case ACTIONS.INIT_APP_CONFIG:
      return initConfig(state, action.payload);

    default:
  }
  return state;
}
