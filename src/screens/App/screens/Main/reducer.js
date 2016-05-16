import {Map, List, fromJS} from 'immutable';


let defaultState = fromJS({
  userPop: false,
  sidebar: false
});

export default function(state = defaultState, action) {
  switch (action.type) {
    case "SHOW_USER_POP":
      return state.set('userPop', !!action.isShow);
    
    default:
  }
  return state;
};