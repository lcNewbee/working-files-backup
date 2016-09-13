import { fromJS } from 'immutable';


const defaultState = fromJS({
  scaning: true,
  showScanResult: false,
  selectedResult: {},
  showCtyModal: false,
  agreeProtocol: false,
  selectedCountry: '',
  channels: [],
  maxTxpower: '27',
  security: {
    mode: 'wpa',
    cipher: 'aes',
    key: '12345678',
  },
});

export default function (state = defaultState, action) {
  switch (action.type) {
    case 'CHANGE_SCAN_STATUS':
      return state.set('scaning', action.data);
    case 'CHANGE_SHOW_SCAN_RESULT_STATUS':
      return state.set('showScanResult', action.data);
    case 'CHANGE_SELECTED_RESULT':
      return state.set('selectedResult', action.data);
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
    case 'LEAVE_SCREEN':
      return state.set('scaning', false)
                  .set('showScanResult', false)
                  .set('selectedResult', fromJS())
                  .set('showCtyModal', false)
                  .set('agreeProtocol', false)
                  .set('selectedCountry', '')
                  .set('channels', fromJS([]))
                  .set('maxTxpower', '27');
    default:
  }
  return state;
}

