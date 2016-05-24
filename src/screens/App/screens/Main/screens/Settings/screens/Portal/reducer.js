import Immutable, {Map, List, fromJS} from 'immutable';

const defaultState = fromJS({
  data: {
    list: [
      {}
    ],
    curr: {
      
    }
  }
});

function receiveSettings(state, settingData) {
  let ret = state.update('data', data => data.merge(settingData));
  let listCurr = ret.getIn(['data', 'list', 0]);
  
  if (listCurr === undefined || listCurr.isEmpty()) {
    listCurr = Map({
      refreshtime: 3,
      timeout: 14400
    });
  }
  
  return ret.setIn(['data', 'curr'], listCurr)
      .set('fetching', false);
}

export default function(state = defaultState, action) {
  switch (action.type) {
    case 'REQEUST_FETCH_PORTAL':
      return state.set('fetching', true);
      
    case 'RECEIVE_PORTAL':
      return receiveSettings(state, action.data);
      
    case "CHANGE_PORTAL_GROUP":
      return state.updateIn(['data', 'curr'], data => {
        return state.getIn(['data', 'list'])
          .find(function(item) {
            return item.get('groupname') === action.name;
          })
      });
   case "CHANGE_PORTAL_SETTINGS":
      return state.mergeIn(['data', 'curr'], action.data)
      
    default:

  }
  return state;
};