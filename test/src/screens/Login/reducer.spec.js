import { fromJS } from 'immutable';
import { expect } from 'chai';

import reducer from '../../../../src/screens/App/screens/Login/reducer';

describe('Login reducer', () => {
  it('handles UPDATE_DATA', () => {
    const initialState = fromJS({
      data: {
        username: '',
        password: '',
      },
    });
    const action = {
      type: 'UPDATE_DATA',
      data: {
        username: 'ewe',
        password: 'ewe',
      },
    };
    const nextState = reducer(initialState, action);

    expect(nextState).to.be.equal(fromJS({
      data: {
        username: 'ewe',
        password: 'ewe',
      },
    }));
  });

  it('handles REQEUST_LOGIN', () => {
    const initialState = fromJS({
      fetching: false,
      data: {
        username: 'ewe',
        password: 'ewe',
      },
    });

    const action = {
      type: 'REQEUST_LOGIN',
    };
    const nextState = reducer(initialState, action);

    expect(nextState).to.be.equal(fromJS({
      fetching: true,
      data: {
        username: 'ewe',
        password: 'ewe',
      },
      status: '',
    }));
  });

  it('handles RESPONSE_LOGIN', () => {
    const initialState = fromJS({
      fetching: true,
      status: 'init',
      data: {
        username: 'ewe',
        password: 'ewe',
      },
    });
    const time = Date.now();
    const action = {
      type: 'RESPONSE_LOGIN',
      result: 'fail',
      loginedAt: time,
    };
    const nextState = reducer(initialState, action);

    expect(nextState).to.be.equal(fromJS({
      fetching: false,
      status: 'fail',
      loginedAt: time,
      data: {
        username: 'ewe',
        password: 'ewe',
      },
    }));
  });
});
