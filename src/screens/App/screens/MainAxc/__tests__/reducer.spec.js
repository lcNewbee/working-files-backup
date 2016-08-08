import {List, Map, fromJS} from 'immutable';
import chai, {expect} from 'chai';
import reducer from '../reducer';

describe('MainAxc reducer', () => {
  it('Should toggle isShow porp when TOGGLE_MAIN_POP_OVER with undefined option', () => {
    const initialState = fromJS({
      popOver: {
        isShow: false,
        transitionName: 'fade-up',

        // 'vlanAsider' 'groupAsider' 'topMenu'
        name: 'topMenu',
      }
    });
    const action = {
      type: 'TOGGLE_MAIN_POP_OVER',
    };
    const nextState = reducer(initialState, action);

    nextState.should.equal(fromJS({
      popOver: {
        isShow: true,
        transitionName: 'fade-up',

        // 'vlanAsider' 'groupAsider' 'topMenu'
        name: 'topMenu',
      }
    }));
  })

  it('TOGGLE_MAIN_POP_OVER when undefined option', () => {
    const initialState = fromJS({
      popOver: {
        isShow: false,
        transitionName: 'fade-up',

        // 'vlanAsider' 'groupAsider' 'topMenu'
        name: 'topMenu',
      }
    });
    const action = {
      type: 'TOGGLE_MAIN_POP_OVER',
    };
    const nextState = reducer(initialState, action);

    nextState.should.equal(fromJS({
      popOver: {
        isShow: true,
        transitionName: 'fade-up',

        // 'vlanAsider' 'groupAsider' 'topMenu'
        name: 'topMenu',
      }
    }));
  })
});
