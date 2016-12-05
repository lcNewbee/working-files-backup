import { fromJS } from 'immutable';

const defaultState = fromJS({
  fetching: false,
  data: {
    conutry: '',
    password: '',
    timeZone: (new Date()).getTimezoneOffset(),
  },
  showProgressBar: false,
  showThinModeConfigModal: false,
  currModeData: {
    enable: '0',
    discoveryType: 'dhcp',
    acIp: '',
  },
  nextModeData: {
    enable: '0',
    discoveryType: 'dhcp',
    acIp: '',
  },
});

function onNextModeData(state, action) {
  const nextModeData = state.get('nextModeData').merge(action.data);
  return state.set('nextModeData', nextModeData);
}

function onCurrModeData(state, action) {
  const currModeData = state.get('currModeData').merge(action.data);
  return state.set('currModeData', currModeData);
}

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
    case 'CHANGE_SHOW_PROGRESS_BAR':
      return state.set('showProgressBar', action.data);
    case 'CHANGE_NEXT_MODE_DATA':
      return onNextModeData(state, action);
    case 'CHANGE_CURR_MODE_DATA':
      return onCurrModeData(state, action);
    case 'CHANGE_SHOW_THIN_MODE_CONFIG_MODAL':
      return state.set('showThinModeConfigModal', action.data);
    default:
  }
  return state;
}

