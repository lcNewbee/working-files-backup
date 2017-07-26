import { fromJS } from 'immutable';

const defaultState = fromJS({
  restoreState: '0',
  interfaceList: [],
});

export default function (state = defaultState, action) {
  switch (action.type) {
    case 'RECEIVE_QUICK_SETUP_FETCH_DATA':
      return fromJS(action.data);
    default:
  }
  return state;
}
