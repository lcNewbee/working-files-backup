import { fromJS } from 'immutable';

const defaultState = fromJS({
  showErrorMsg: '0',
  errorMsg: '',
});


export default function (state = defaultState, action) {
  switch (action.type) {
    case 'SHOW_VALID_MSG':
      return state.set('showErrorMsg', action.show)
                  .set('errorMsg', action.msg);
    default:
  }
  return state;
}
