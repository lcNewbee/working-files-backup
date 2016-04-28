import Immutable, {Map, List, fromJS} from 'immutable';

function setFetching(state) {
  return state.update('fetching', val => true);
}

function mergeData(state, action) {
  return state.update('data', data => data.merge(action.data))
}

function deleteListById(state, id) {
  let ret = state;
  const index = state.getIn(['data', 'list']).findIndex(function(item) {
    return item.get('id') == id;
  });

  if(index !== -1) {
    ret = state.deleteIn(['data', 'list', index])
  }

  return ret;
}

function getItemById(state, id) {
  return state.getIn(['data', 'list']).find(function(item) {
    return item.get('id') == id;
  })
}

let defaultState = fromJS({
  fetching: false,
  data: {
    list: []
  }
});

export default function(state = defaultState, action) {
  switch (action.type) {
    case 'RECEIVE_DEVICE_GROUPS':
      return mergeData(state, action);

    case 'REQEUST_FETCH_DEVICE_GROUPS':
      return setFetching(state);

    case 'EDIT_GROUP':
      return state.setIn(['data', 'edit'], getItemById(state, action.id));

    case 'ADD_GROUP':
      return state.setIn(['data', 'edit'], Map({}))

    case 'REMOVE_EDIT_GROUP':
      return state.deleteIn(['data', 'edit']);

    case 'DELETE_DEVICE_GROUP':
      return deleteListById(state, action.id);

  }
  return state;
};
