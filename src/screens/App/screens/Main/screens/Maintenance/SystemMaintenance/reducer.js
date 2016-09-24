import { fromJS } from 'immutable';


const defaultState = fromJS({
  progressBarInfo: {
    title: 'rebooting , please wait...',
    time: 60,
    isShow: false,
  },
});

export default function (state = defaultState, action) {
  switch (action.type) {
    case 'CHANGE_SHOW_PROGESS_BAR':
      return state.set('showProgessBar', action.data);
    case 'CHANGE_PROGRESS_BAR_INFO':
      return state.set('progressBarInfo', action.data);
    default:
  }
  return state;
}
