import { fromJS } from 'immutable';

const defaultState = fromJS({
  showTable: false,
  currRadioConfig: {
    radioId: '0',
    radioType: '2.4G',
  },
});

export default function (state = defaultState, action) {
  switch (action.type) {
    case 'CHANGE_SHOW_TABLE_STATUS':
      return state.set('showTable', action.data);
    case 'CHANGE_CURR_RADIO_CONFIG':
      return state.set('currRadioConfig', action.data);
    default:
  }
  return state;
}
