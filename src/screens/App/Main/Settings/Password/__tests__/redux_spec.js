import {List, Map, fromJS} from 'immutable';
import chai, {expect} from 'chai';

import reducer from '../reducer';
import * as actions from '../actions';

describe('Password Rudex', () => {
  
  it('should updata data.curr when CHANGE_PASSWORD_SETTINGS', () => {
    const initialState = fromJS({
      data: {
        
      }
    });
    
    let action = actions.changePasswordSettings({
      "oldpassword": "group231",
      "newpassword": "654",
      "confirmpasswd": "654"
    });
    
    let nextState = reducer(initialState, action);
    
    expect(nextState).to.be.equal(fromJS({
      data: {
        "oldpassword": "group231",
        "newpassword": "654",
        "confirmpasswd": "654"
      }
    }));
  });
  
  it('', () => {
    
  });
  
});
