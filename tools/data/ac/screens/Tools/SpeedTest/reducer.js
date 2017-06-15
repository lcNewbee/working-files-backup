import { fromJS } from 'immutable';

const defaultState = fromJS({
  showAdvance: '0',
  showResults: '0',
  showScanResults: false,
  showWaitingModal: false,
  stopWait: true,
  bandwidth: '512',
  selectedIp: '',
  rx: '0',
  tx: '0',
  total: '0',
  time: '30',
  query: {
    ip: '',
    time: '',
    packagelen: '',
  },
});

export default function (state = defaultState, action) {
  switch (action.type) {
    case 'TOGGLE_SHOW_ADVANCE_BTN':
      return state.set('showAdvance', (state.get('showAdvance') === '1' ? '0' : '1'));
    // case 'TOGGLE_SHOW_RESULT_BTN':
    //   return state.set('showResults', action.data);
    case 'INIT_SELF_STATE':
      return defaultState;
    case 'RECEIVE_TEST_RESULT':
      return state.set('rx', action.data.rx)
                  .set('tx', action.data.tx)
                  .set('total', action.data.total);
    case 'CHANGE_SHOW_SCAN_RESULTS':
      return state.set('showScanResults', action.data);
    case 'CHANGE_SELECTED_IP':
      return state.set('selectedIp', action.data);
    case 'CHANGE_TIME_CLOCK':
      return state.set('time', action.data);
    case 'CHANGE_CHART_DATA':
      return state.set('tx', action.data.txdata)
                  .set('rx', action.data.rxdata)
                  .set('total', action.data.totaldata);
    case 'CHANGE_QUERY_DATA':
      return state.set('query', fromJS(action.data));
    case 'CHANGE_STOP_WAIT':
      return state.set('stopWait', action.data);
    case 'CHANGE_SHOW_WAITING_MODAL':
      return state.set('showWaitingModal', action.data);
    case 'RESTORE_SELF_STATE':
      return defaultState;
    default:
  }
  return state;
}
