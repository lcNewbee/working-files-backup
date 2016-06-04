import {Map, List, fromJS} from 'immutable';

const defaultState = fromJS({
  saving: false,
  invalid: {}
});

function receiveReport(state, data) {
  var ret;
  
  if(!data.checkResult) {
    ret = state.deleteIn(['invalid', data.name]);
  } else {
    ret = state.setIn(['invalid', data.name], data.checkResult);
  }
  
  return ret;
}

export default function( state = defaultState, action ) {

  switch (action.type) {
    case 'START_VALIDATE_ALL':
      return state.set('validateAt', action.validateAt)
          .set('invalid', Map({}));
          
    case 'RESET_VAILDATE_MSG':
      return state.set('invalid', Map({}));
      
    case 'REQUEST_SAVE':
      return state.set('saving', true);
    
    case 'RECEIVE_SAVE':
      return state.set('saving', false)
        .set('savedAt', action.savedAt)
        .set('state', action.state);
        
    case 'REPORT_VALID_ERROR':
      return receiveReport(state, action.data);
      
    case 'REFRESH_ALL':
      return state.set('refreshAt', action.refreshAt);
      
    default:
  }
  return state;
};
