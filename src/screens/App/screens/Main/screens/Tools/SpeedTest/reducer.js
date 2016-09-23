import { fromJS } from 'immutable';

const defaultState = fromJS({
  showAdvance: '0',
  showResults: '0',
  showScanResults: false,
  bandwidth: '512',
  selectedIp: '',
  rx: '1000',
  tx: '1000',
  total: '1024',
  time: '',
});

export default function (state = defaultState, action) {
  switch (action.type) {
    case 'TOGGLE_SHOW_ADVANCE_BTN':
      return state.set('showAdvance', (state.get('showAdvance') === '1' ? '0' : '1'));
    case 'TOGGLE_SHOW_RESULT_BTN':
      console.log('toggle');
      return state.set('showResults', action.data);
    case 'INIT_SELF_STATE':
      return state.set('showAdvance', '0')
                  .set('showResults', '0');
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
    default:
  }
  return state;
}
