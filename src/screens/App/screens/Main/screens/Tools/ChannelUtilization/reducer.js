import { fromJS } from 'immutable';

const defaultState = fromJS({
  remainTime: -1,
  time: 3,
  channelLen: 0,
  showTable: false,
});

export default function (state = defaultState, action) {
  switch (action.type) {
    case 'CHANGE_REMAIN_TIME':
      return state.set('remainTime', action.data);
    case 'CHANGE_PER_CHANNEL_SCAN_TIME':
      return state.set('time', action.data);
    case 'CHANGE_CHANNEL_LEN':
      return state.set('channelLen', action.data);
    case 'CHANGE_UTI_TABLE_SHOW_STATUS':
      return state.set('showTable', action.data);
    default:
  }
  return state;
}
