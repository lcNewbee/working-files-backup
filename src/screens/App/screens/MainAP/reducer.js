import { fromJS } from 'immutable';

const defaultState = fromJS({
  userPop: false,
  deviceRadioList: [],
  radioSelectOptions: [],
  menus: [],
});

export default function (state = defaultState, action) {
  switch (action.type) {
    case 'SHOW_USER_POP':
      return state.set('userPop', !!action.isShow);
    case 'SET_DEVICE_RADIO_LIST':
      return state.set('deviceRadioList', action.data);
    case 'SET_RADIO_SELECT_OPTIONS':
      return state.set('radioSelectOptions', action.data);
    case 'CHANGE_MENUS':
      return state.set('menus', action.data);
    default:
  }
  return state;
}
