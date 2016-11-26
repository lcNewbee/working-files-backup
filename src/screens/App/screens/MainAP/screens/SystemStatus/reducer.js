import { fromJS } from 'immutable';

const defaultState = fromJS({
  firstRefresh: true,
  currRadioConfig: {
    radioId: '0',
    radioType: '2.4G',
  },
  customSettingsForChart: {
    ssidFlowDir: 'upload', // 'upload' or 'download'
    top10ClientFlowDir: 'upload', // 'upload' or 'download'
  },
  serverData: {
    cpuTotal: '100',
    cpuInfo: '40',
    memFree: '40',
    memTotal: '100',
    flowPerSsid: [
      { name: 'Axilsopt1', value: '103' },
      { name: 'Axilspot2', value: '5' },
      { name: 'Axilspot3', value: '7' },
      { name: 'Axilsopt4', value: '3' },
      { name: 'Axilspot5', value: '5' },
      { name: 'Axilspot6', value: '7' },
      { name: 'Axilsopt7', value: '3' },
      { name: 'Axilspot8', value: '5' },
      { name: 'Axilspot9', value: '7' },
      { name: 'Axilsopt00', value: '3' },
      { name: 'Axilspot11', value: '5' },
    ],
    top10FlowClients: [
      { name: 'user1', value: '1000' },
      { name: 'user2', value: '999' },
      { name: 'user3', value: '888' },
      { name: 'user1', value: '777' },
      { name: 'user2', value: '666' },
      { name: 'user3', value: '555' },
      { name: 'user1', value: '444' },
      { name: 'user2', value: '333' },
      { name: 'user3', value: '222' },
    ],
  },
});

function onChangeServeDataItem(state, action) {
  const serverData = state.get('serverData').merge(action.data);
  return state.set('serverData', serverData);
}

function onChangeCustomSettings(state, action) {
  const customSettingsForChart = state.get('customSettingsForChart').merge(action.data);
  return state.set('customSettingsForChart', customSettingsForChart);
}

export default function (state = defaultState, action) {
  switch (action.type) {
    case 'CHANGE_FIRST_REFRESH':
      return state.set('firstRefresh', action.data);
    case 'CHANGE_CURR_RADIO_CONFIG':
      return state.set('currRadioConfig', action.data);
    case 'CHANGE_SERVER_DATA':
      return onChangeServeDataItem(state, action);
    case 'CHANGE_CUSTOM_SETTINGS_FOR_CHART':
      return onChangeCustomSettings(state, action);
    default:
  }
  return state;
}
