import { fromJS } from 'immutable';

const defaultState = fromJS({
  fetching: false,
  currRadioConfig: {
    radioId: '0',
    radioType: '2.4G',
  },
  rateSetOptions: [],
});

export default function (state = defaultState, action) {
  switch (action.type) {
    case 'CHANGE_CURR_RADIO_CONFIG':
      return state.set('currRadioConfig', action.data);
    case 'CHANGE_RATE_SET_OPTIONS':
      return state.set('rateSetOptions', action.data);
    default:
  }
  return state;
}
