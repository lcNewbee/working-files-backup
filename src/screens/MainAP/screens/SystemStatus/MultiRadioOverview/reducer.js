import { fromJS } from 'immutable';

const defaultState = fromJS({
  firstRefresh: true,
  currRadioConfig: {
    radioId: '0',
    radioType: '2.4G',
  },
  customSettingsForChart: {
    ssidFlowDir: 'download', // 'upload' or 'download'
    top10ClientFlowDir: 'download', // 'upload' or 'download'
  },
  serverData: {
    cpuTotal: '100',
    cpuInfo: '40',
    memFree: '68056',
    memTotal: '126324',
    flowPerSsid: [
    ],
    top10FlowClients: [
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
