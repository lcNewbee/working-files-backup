import Immutable, {Map, List, fromJS} from 'immutable';

const defaultState = fromJS({
  data: {
    list: [],
    curr: {
    }
  }
});

function receiveSettings(state, settingData) {
  let ret = state.update('data', data => data.merge(settingData));
  let listCurr = ret.getIn(['data', 'list', 0]);
  const currData = state.getIn(['data', 'curr']) || Map({});
 
  if(currData.isEmpty()) {
    
    ret = ret.setIn(['data', 'curr'], listCurr);
    
  } else {
    listCurr = ret.getIn(['data', 'list']).find(function(item) {
      return currData.get('groupname') === item.get('groupname');
    });
  }
  
  return ret.setIn(['data', 'curr'], listCurr)
      .set('fetching', false);
}

export default function(state = defaultState, action) {
  switch (action.type) {
    case 'REQEUST_FETCH_GUEST':
      return state.set('fetching', true);
      
    case 'RECEIVE_GUEST':
      return receiveSettings(state, action.data);
      
    case "CHANGE_GUEST_GROUP":
      return state.updateIn(['data', 'curr'], data => {
        return state.getIn(['data', 'list'])
          .find(function(item) {
            return item.get('groupname') === action.name;
          })
      });
   case "CHANGE_GUEST_SETTINGS":
      return state.mergeIn(['data', 'curr'], action.data)
      
    default:

  }
  return state;
};