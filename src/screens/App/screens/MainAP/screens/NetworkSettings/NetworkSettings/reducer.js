import { fromJS } from 'immutable';

const defaultState = fromJS({
  fetching: false,
  showProgressModal: false,
});

export default function (state = defaultState, action) {
  switch (action.type) {
    case 'CHANGE_PROGRESS_MODAL_SHOW_STATUS':
      return state.set('showProgressModal', action.data);
    default:
  }
  return state;
}
