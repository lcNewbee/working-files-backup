import { fromJS } from 'immutable';

import reducer from '../reducer';
import * as actions from '../actions';

describe('Password Rudex', () => {
  it('should updata data.curr when CHANGE_PASSWORD_SETTINGS', () => {
    const initialState = fromJS({
      data: {

      },
    });

    const action = actions.changePasswordSettings({
      oldpassword: 'group231',
      newpassword: '654',
      confirmpasswd: '654',
    });

    const nextState = reducer(initialState, action);

    expect(nextState).toEqual(fromJS({
      data: {
        oldpassword: 'group231',
        newpassword: '654',
        confirmpasswd: '654',
      },
    }));
  });
});
