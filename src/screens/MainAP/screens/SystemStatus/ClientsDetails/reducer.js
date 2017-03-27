import { fromJS } from 'immutable';

const defaultState = fromJS({
  currRadioConfig: {
    radioId: '0',
    radioType: '2.4G',
  },
  showKickConfirm: '0',
});


export default function (state = defaultState, action) {
  switch (action.type) {
    case 'CHANGE_CURR_RADIO_CONFIG':
      return state.set('currRadioConfig', action.data);
    default:
  }
  return state;
}
