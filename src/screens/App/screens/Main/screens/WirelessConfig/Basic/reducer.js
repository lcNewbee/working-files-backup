import { fromJS } from 'immutable';


const defaultState = fromJS({
  scaning: true,
  showScanResult: false,
  selectedResult: {},
});

export default function (state = defaultState, action) {
  switch (action.type) {
    case 'CHANGE_SCAN_STATUS':
      return state.set('scaning', action.data);
    case 'CHANGE_SHOW_SCAN_RESULT_STATUS':
      return state.set('showScanResult', action.data);
    // case 'SET_SCAN_RESULT':
    //   return state.set('scanResult', action.data);
    case 'CHANGE_SELECTED_RESULT':
      // console.log('action change result');
      return state.set('selectedResult', action.data);
    case 'LEAVE_SCREEN':
      return state.clear();
    default:
  }
  return state;
}
