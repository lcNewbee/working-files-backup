import Immutable, {Map, List, fromJS} from 'immutable';

const defaultState = fromJS({
  data: {
    list: [],
    curr: {}
  }
});

function receiveSettings(state, settingData) {
  let ret = state.update('data', data => data.merge(settingData));
  let list0 = ret.getIn(['data', 'list', 0]);
 
  if(state.getIn(['data', 'curr']).isEmpty()) {
    ret = ret.setIn(['data', 'curr'], list0);
  }
  
  return ret.set('fetching', false);
}

export default function(state = defaultState, action) {
  switch (action.type) {
    case 'REQEUST_FETCH_WIFI':
      return state.set('fetching', true);
      
    case 'RECEIVE_WIFI':
      return receiveSettings(state, action.data);
      
    default:

  }
  return state;
};