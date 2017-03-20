import { fromJS } from 'immutable';

const defaultState = fromJS({
  showTable: false,
});

export default function (state = defaultState, action) {
  switch (action.type) {
    case 'CHANGE_SHOW_TABLE_STATUS':
      return state.set('showTable', action.data);
    default:
  }
  return state;
}
