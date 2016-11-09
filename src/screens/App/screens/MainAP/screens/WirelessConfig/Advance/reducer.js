import { fromJS } from 'immutable';

const defaultState = fromJS({
  fetching: false,
});

export default function (state = defaultState, action) {
  return state;
}
