import { describe, it } from 'mocha';
import { expect } from 'chai';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as screenActions from 'shared/actions/screens';

const middlewares = [thunk]; // add your middlewares like `redux-thunk`
const mockStore = configureStore(middlewares);


describe('shared/actions/screens.js', () => {
  // Test example with mocha and expect
  it('should dispatch action', () => {
    const initialState = {};
    const updateListSettingsAction = screenActions.updateScreenSettings({
      a: 1,
    });

    const store = mockStore(initialState);
    store.dispatch(updateListSettingsAction);

    const actions = store.getActions();

    expect(actions).to.be.deep.equal([updateListSettingsAction]);
  });

  it('should dispatch action 2', () => {
    const getState = {};
    const data = {
      ads: 1,
      b: 2,
    };
    const expectedAction = {
      type: 'UPDATE_LIST_SETTINGS',
      data,
    };
    const expectedActions = [expectedAction];

    const store = mockStore(getState, expectedActions);
    store.dispatch(screenActions.updateScreenSettings());
  });
});
