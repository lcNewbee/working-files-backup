import Immutable, {Map, List, fromJS} from 'immutable';

const defaultState = fromJS({
  fetching: false,
  saving: false,
  data: {
    list: [],
    curr: {}
  }
});

function receiveQosData(state, settingData) {
  let ret = state.update('data', data => data.merge(settingData));
  let listCurr = ret.getIn(['data', 'list', 0])|| Map({});
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
    case 'REQEUST_FETCH_QOS':
      return state.set('fetching', true);
      
    case 'RECEIVE_QOS':
      return receiveQosData(state, action.data);
      
    case "CHANGE_QOS_GROUP":
      return state.updateIn(['data', 'curr'], data => {
        return state.getIn(['data', 'list'])
          .find(function(item) {
            return item.get('groupname') === action.name;
          })
      });
      
    case "REQEUST_SET_QOS":
      return state.set('saving', true);
    
    case "RECEIVE_SET_QOS":
      return state.set('saving', false)
      
    case "CHANGE_QOS_SETTINGS":
      return state.mergeIn(['data', 'curr'], action.data)
      
    default:

  }
  
  return state;
};