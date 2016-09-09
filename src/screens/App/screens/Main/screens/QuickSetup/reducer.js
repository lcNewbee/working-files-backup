import { fromJS } from 'immutable';

const defaultState = fromJS({
  page: '1',
  deviceMode: 'station',
  repeaterCfg: {

  },
  apCfg: {

  },
  stationCfg: {

  },
});

export default function (state = defaultState, action) {
  switch (action.type) {
    case 'CHANGE_PAGE':
      return state.set('page', action.data);
    case 'CHANGE_DEVICE_MODE':
      return state.set('deviceMode', action.data);
    default:
  }
  return state;
}
