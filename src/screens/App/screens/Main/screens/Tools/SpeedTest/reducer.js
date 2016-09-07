import { fromJS } from 'immutable';

const defaultState = fromJS({
  showAdvance: '0',
  showResults: '0',
  showScanResults: false,
  bandwidth: '512',
  selectedIp: '',
  rX: '1000',
  tX: '1000',
  total: '1024',
});

export default function (state = defaultState, action) {
  switch (action.type) {
    case 'TOGGLE_SHOW_ADVANCE_BTN':
      return state.set('showAdvance', (state.get('showAdvance') === '1' ? '0' : '1'));
    case 'TOGGLE_SHOW_RESULT_BTN':
      console.log('toggle');
      return state.set('showResults', '1');
    case 'INIT_SELF_STATE':
      return state.set('showAdvance', '0')
                  .set('showResults', '0');
    case 'RECEIVE_TEST_RESULT':
      return state.merge(action.data);
    case 'CHANGE_SHOW_SCAN_RESULTS':
      return state.set('showScanResults', action.data);
    case 'CHANGE_SELECTED_IP':
      return state.set('selectedIp', action.data);
    default:
  }
  return state;
}
