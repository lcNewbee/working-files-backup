import { fromJS } from 'immutable';

const defaultState = fromJS({
  topMenu: false,
});

export default function (state = defaultState, action) {
  switch (action.type) {
    case 'ON_TOGGLE_TOP_MENU':
      return state.set('topMenu', !state.get('topMenu'));

    default:
  }
  return state;
}
