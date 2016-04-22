import {Map, List, fromJS} from 'immutable';

function setFetching(state) {
  return state.update('fetching', val => true);
}

function updateData(state, name, value) {
  return state.updateIn(['data', name], val => value);
}

let defaultState = fromJS({
  fetching: false,
  data: {
    username: '',
    password: ''
  }
});

export default function(state = defaultState, action) {
  switch (action.type) {
    case 'UPDATE_DATA':
      return updateData(state, action.name, action.value);

    case 'REQEUST_LOGIN':
      return setFetching(state);

  }
  return state;
};