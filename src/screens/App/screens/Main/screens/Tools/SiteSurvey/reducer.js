import { fromJS } from 'immutable';

const defaultState = fromJS({
  showTable: true,
});

export default function (state = defaultState, action) {
  switch (action.type) {
    default:
  }
  return state;
}
