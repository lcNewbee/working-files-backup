import { fromJS } from 'immutable';


const defaultState = fromJS({
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
      time: 100,
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
    case 'RESET_SELF_STATE':
      return defaultState;
    default:
  }
  return state;
}
