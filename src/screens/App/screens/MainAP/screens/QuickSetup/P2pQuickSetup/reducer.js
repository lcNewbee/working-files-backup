import { fromJS } from 'immutable';

const defaultState = fromJS({
  currRadioConfig: {
    radioId: '0',
    radioType: '2.4G',
  },
  page: '1',
  deviceMode: 'sta',
  reinitAt: new Date().getTime(),
  showCtyModal: false,
  agreeProtocol: false,
  selectedCountry: '',
  channels: [],
  scaning: false,
  showScanResult: false,
  selectedResult: {},
});

export default function (state = defaultState, action) {
  switch (action.type) {
    case 'CHANGE_PAGE':
      return state.set('page', action.data);
    case 'CHANGE_DEVICE_MODE':
      return state.set('deviceMode', action.data);
    case 'CHANGE_CTY_MODAL':
      return state.set('showCtyModal', action.data);
    case 'CHANGE_AGREE_PROTOCOL':
      return state.set('agreeProtocol', action.data);
    case 'CHANGE_COUNTRY_CODE':
      return state.set('selectedCountry', action.data);
    case 'CLOSE_COUNTRY_SELECT_MODAL':
      return state.set('showCtyModal', false).set('agreeProtocol', false)
                  .set('selectedCountry', action.data);
    case 'RECEIVE_COUNTRY_INFO':
      return state.set('channels', fromJS(action.data.channels))
                  .set('maxTxpower', action.data.maxTxpower);
    case 'CHANGE_SCAN_STATUS':
      return state.set('scaning', action.data);
    case 'CHANGE_SHOW_SCAN_RESULT_STATUS':
      return state.set('showScanResult', action.data);
    case 'CHANGE_SELECTED_RESULT':
      return state.set('selectedResult', action.data);
    case 'CHANGE_REINIT_AT':
      return state.set('reinitAt', new Date().getTime());
    case 'CHANGE_CURR_RADIO_CONFIG':
      return state.set('currRadioConfig', action.data);
    case 'LEAVE_SCREEN':
      return defaultState;
    case 'RESTORE_SELF_STATE':
      return defaultState;
    default:
  }
  return state;
}
