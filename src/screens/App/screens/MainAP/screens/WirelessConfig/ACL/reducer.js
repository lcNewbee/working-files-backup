import { fromJS, List } from 'immutable';

const defaultState = fromJS({
  currRadioConfig: {
    radioId: 0,
    radioType: '2.4G',
  },
  macstatus: [
  ],
  macInput: {
    macValue: '',
    preLen: 0,
  },

  selectedSsid: 0,

});

function onInitMacStatus(state, action) {
  // console.log('len', action.len);
  const list = [];
  let i = 0;
  // console.log('i');
  while (i < action.len) {
    // console.log('i', i);
    list.push(false);
    i++;
  }
  return state.set('macstatus', fromJS(list));
}

function onUpdateMacStatus(state, action) {
  const statusList = state.get('macstatus').toJS();
  const status = statusList[action.index];
  // console.log(statusList[action.index]);
  return state.setIn(['macstatus', action.index], !status);
}

function onChangeSelectedSsid(state, action) {
  console.log('action', action.data);
  const statusArr = new Array(action.data.macListLen).fill(false);
  console.log('statusArr', statusArr);
  return state.set('selectedSsid', action.data.selectedSsid)
              .set('macstatus', fromJS(statusArr));
}

export default function (state = defaultState, action) {
  switch (action.type) {
    case 'INIT_MAC_STATUS':
      return onInitMacStatus(state, action);
    case 'UPDATE_MAC_STATUS':
      return onUpdateMacStatus(state, action);
    case 'CHANGE_MAC_INPUT':
      return state.setIn(['macInput', 'macValue'], action.data);
    case 'CHANGE_PRE_LEN_IN_MAC_INPUT':
      return state.setIn(['macInput', 'preLen'], action.data);
    case 'CHANGE_SELECTED_SSID':
      return onChangeSelectedSsid(state, action);
    case 'CHANGE_CURR_RADIO_CONFIG':
      return state.set('currRadioConfig', action.data);
    case 'RESTORE_SELF_STATE':
      return defaultState;
    default:
  }
  return state;
}
