import { fromJS } from 'immutable';


const defaultState = fromJS({
  currRadioConfig: {
    radioId: '1',
    radioType: '2.4G',
  },
  scaning: true,
  showScanResult: false,
  showRadioSetting: true,
  showSsidSetting: true,
  showMultiSsid: false,

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
  tableItemForSsid: {
    isShow: '0',
    val: '',
    item: {},
    pos: '',
  },
  whichButton: '',
  radioSettings: {},
  multiSsid: {},
  basicSettings: {},
});

function onUpdateSelfItemSettings(state, action) {
  const curModule = action.data.curModule;
  const data = action.data.data;
  return state.mergeIn([curModule], data);
}


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
      return defaultState;
    case 'RESTORE_SELF_STATE':
      return defaultState;

    case 'CHANGE_TITLE_SHOW_ICON':
      return state.set(action.data.name, action.data.value);
    case 'CHANGE_TABLE_ITEM_FOR_SSID':
      return state.set('tableItemForSsid', action.data);
    case 'UPDATE_SELF_ITEM_SETTINGS':
      return onUpdateSelfItemSettings(state, action);
    case 'UPDATE_RADIO_SETTINGS_ITEM':
      return state.mergeIn(['radioSettings'], action.data);
    case 'UPDATE_MULTI_SSID_ITEM':
      return state.mergeIn(['multiSsid'], action.data);
    case 'UPDATE_BASIC_SETTINGS':
      return state.mergeIn(['basicSettings'], action.data);
    case 'CHANGE_WHICH_BUTTON':
      return state.set('whichButton', action.data);

    case 'CHANGE_CURR_RADIO_CONFIG':
      return state.set('currRadioConfig', action.data);
    default:
  }
  return state;
}

