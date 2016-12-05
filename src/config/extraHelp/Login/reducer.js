import { fromJS } from 'immutable';

export default function (
  state = fromJS({
    direction: '1',
    enable: '1',
    radioType: '2.4',
  }), action) {
  switch (action.type) {
    case 'CHANGE_DIRECTION':
      return state.set('direction', action.data);
    case 'CHANGE_ENABLE':
      return state.set('enable', action.data);
    case 'CHANGE_RADIO_TYPE':
      return state.set('radioType', action.data);
    default:
  }
  return state;
}

