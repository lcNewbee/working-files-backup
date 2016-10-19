import { fromJS } from 'immutable';

import reducer from 'src/screens/App/screens/MainAxc/reducer';

describe('MainAxc index reducer', () => {
  it('Should toggle isShow porp when TOGGLE_MAIN_POP_OVER with undefined option', () => {
    const initialState = fromJS({
      popOver: {
        isShow: false,
        transitionName: 'fade-up',

        // 'vlanAsider' 'groupAsider' 'topMenu'
        name: 'topMenu',
      },
    });
    const action = {
      type: 'TOGGLE_MAIN_POP_OVER',
    };
    const nextState = reducer(initialState, action);

    expect(nextState).equal(fromJS({
      popOver: {
        isShow: true,
        transitionName: 'fade-up',

        // 'vlanAsider' 'groupAsider' 'topMenu'
        name: 'topMenu',
      },
    }));
  });

  it('Should merge porps when TOGGLE_MAIN_POP_OVER with option', () => {
    const initialState = fromJS({
      popOver: {
        isShow: false,
        transitionName: 'fade-up',

        // 'vlanAsider' 'groupAsider' 'topMenu'
        name: 'topMenu',
      },
    });
    const action = {
      type: 'TOGGLE_MAIN_POP_OVER',
      option: {
        name: 'ok',
        transitionName: 'fade-ok',
        isShow: true,
      },
    };
    const nextState = reducer(initialState, action);

    expect(nextState).equal(fromJS({
      popOver: {
        isShow: true,
        transitionName: 'fade-ok',

        // 'vlanAsider' 'groupAsider' 'topMenu'
        name: 'ok',
      },
    }));
  });

  it('Should merge default porps when SHOW_MAIN_MODAL with undefined option', () => {
    const initialState = fromJS({
      modal: {
        isShow: false,
        size: 'lg',
        name: 'group',
      },
    });
    const action = {
      type: 'SHOW_MAIN_MODAL',
    };
    const nextState = reducer(initialState, action);

    expect(nextState).equal(fromJS({
      modal: {
        isShow: true,
        size: 'md',
        name: 'group',
        okButton: true,
        cancelButton: true,
      },
    }));
  });

  it('Should merge default porps when SHOW_MAIN_MODAL with undefined option', () => {
    const initialState = fromJS({
      modal: {
        isShow: false,
        size: 'lg',
        name: 'group',
      },
    });
    let action = {
      type: 'SHOW_MAIN_MODAL',
      option: {
        okButton: true,
        cancelButton: false,
      },
    };
    let nextState = reducer(initialState, action);

    expect(nextState).equal(fromJS({
      modal: {
        isShow: true,
        size: 'md',
        name: 'group',
        okButton: true,
        cancelButton: false,
      },
    }));

    action = {
      type: 'SHOW_MAIN_MODAL',
      option: {
        okButton: false,
        cancelButton: false,
        isShow: false,
        name: 'vlan',
        size: 'lg',
      },
    };
    nextState = reducer(nextState, action);

    expect(nextState).equal(fromJS({
      modal: {
        isShow: false,
        size: 'lg',
        name: 'vlan',
        okButton: false,
        cancelButton: false,
      },
    }));
  });

  it('Should no change selected when SELECT_GROUP with undefined or not found id', () => {
    const initialState = fromJS({
      group: {
        selected: {
          id: '1',
          groupName: '测试',
        },
        list: [
          {
            id: '1',
            groupName: '测试',
          }, {
            id: '2',
            groupName: '研发',
          },
        ],
      },
    });
    const action = {
      type: 'SELECT_GROUP',
    };
    const nextState = reducer(initialState, action);

    expect(nextState).equal(fromJS({
      group: {
        selected: {
          id: '1',
          groupName: '测试',
        },
        list: [
          {
            id: '1',
            groupName: '测试',
          }, {
            id: '2',
            groupName: '研发',
          },
        ],
      },
    }));
  });
});
