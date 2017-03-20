import { fromJS } from 'immutable';

const defaultState = fromJS({
  showScanTable: false,
  channelUtiOptions: [],
  channelUtiList: [],
  currRadioConfig: {
    radioId: '0',
    radioType: '2.4G',
  },
});

export default function (state = defaultState, action) {
  switch (action.type) {
    case 'CHANGE_CHANNEL_UTI_OPTIONS':
      return state.set('channelUtiOptions', action.data);
    case 'CHANGE_CHANNEL_UTI_LIST':
      return state.set('channelUtiList', action.data);
    case 'CHANGE_CURR_RADIO_CONFIG':
      return state.set('currRadioConfig', action.data);
    case 'CHANGES_SHOW_SCAN_TABLE':
      return state.set('showScanTable', action.data);
    default:
  }
  return state;
}
