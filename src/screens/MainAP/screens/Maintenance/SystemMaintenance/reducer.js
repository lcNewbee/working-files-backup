import { fromJS } from 'immutable';


const defaultState = fromJS({
  poeOut: '0',
  voipEnable: '0',
  progressBarInfo: {
    title: _('rebooting , please wait...'),
    time: 60,
    isShow: false,
    start: false,
  },
  upgradeBarInfo: {
    isShow: false,
    firstBar: {
      title: _('Uploading file...'),
      time: 30,
      start: false,
    },
    secondBar: {
      time: 150,
      start: false,
    },
  },
});

export default function (state = defaultState, action) {
  switch (action.type) {
    case 'CHANGE_SHOW_PROGESS_BAR':
      return state.set('showProgessBar', action.data);
    case 'CHANGE_PROGRESS_BAR_INFO':
      return state.set('progressBarInfo', action.data);
    case 'RESTORE_SELF_STATE':
      return defaultState;
    case 'CHANGE_UPGRADE_BAR_INFO':
      return state.set('upgradeBarInfo', action.data);
    case 'CHANGE_POE_OUT':
      return state.set('poeOut', action.data);
    case 'RESET_SELF_STATE':
      return defaultState;
    case 'CHANGE_VOIP_ENABLE':
      return state.set('voipEnable', action.data);
    default:
  }
  return state;
}
