import { List, Map, fromJS } from 'immutable';
import chai, { expect } from 'chai';
import reducer from '../reducer';

describe('MainAxc reducer', () => {
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

    nextState.should.equal(fromJS({
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

    nextState.should.equal(fromJS({
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

    nextState.should.equal(fromJS({
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

    nextState.should.equal(fromJS({
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

    nextState.should.equal(fromJS({
      modal: {
        isShow: false,
        size: 'lg',
        name: 'vlan',
        okButton: false,
        cancelButton: false,
      },
    }));
  });

  it('Should change select vlan when SELECT_VLAN with id', () => {
    const initialState = fromJS({
      vlan: {
        selected: {
          id: '2',
          remark: '研发',
        },
        list: [
          {
            id: '1',
            remark: '测试',
          }, {
            id: '2',
            remark: '研发',
          },
        ],
      },
    });
    const action = {
      type: 'SELECT_VLAN',
      id: '1',
    };
    const nextState = reducer(initialState, action);

    nextState.should.equal(fromJS({
      popOver: {
        isShow: false,
        name: 'vlanAsider',
      },
      vlan: {
        selected: {
          id: '1',
          remark: '测试',
        },
        list: [
          {
            id: '1',
            remark: '测试',
          }, {
            id: '2',
            remark: '研发',
          },
        ],
      },
    }));
  });

  it('Should no change selected when SELECT_VLAN with not found id', () => {
    const initialState = fromJS({
      vlan: {
        selected: {
          id: '2',
          remark: '研发',
        },
        list: [
          {
            id: '1',
            remark: '测试',
          }, {
            id: '2',
            remark: '研发',
          },
        ],
      },
    });
    const action = {
      type: 'SELECT_VLAN',
      id: '3',
    };
    const nextState = reducer(initialState, action);

    nextState.should.equal(fromJS({
      popOver: {
        isShow: false,
        name: 'vlanAsider',
      },
      vlan: {
        selected: {
          id: '2',
          remark: '研发',
        },
        list: [
          {
            id: '1',
            remark: '测试',
          }, {
            id: '2',
            remark: '研发',
          },
        ],
      },
    }));
  });

  it('Should change select vlan when SELECT_VLAN with id', () => {
    const initialState = fromJS({
      vlan: {
        selected: {
          id: '2',
          remark: '研发',
        },
        list: [
          {
            id: '1',
            remark: '测试',
          }, {
            id: '2',
            remark: '研发',
          },
        ],
      },
    });
    const action = {
      type: 'SELECT_VLAN',
      id: '1',
    };
    const nextState = reducer(initialState, action);

    nextState.should.equal(fromJS({
      popOver: {
        isShow: false,
        name: 'vlanAsider',
      },
      vlan: {
        selected: {
          id: '1',
          remark: '测试',
        },
        list: [
          {
            id: '1',
            remark: '测试',
          }, {
            id: '2',
            remark: '研发',
          },
        ],
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
      id: '3',
    };
    const nextState = reducer(initialState, action);

    nextState.should.equal(fromJS({
      popOver: {
        isShow: false,
        name: 'groupAsider',
      },
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

  it('Should delete group when DELETE_AP_GROUP with id', () => {
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
      type: 'DELETE_AP_GROUP',
      id: '1',
    };
    const nextState = reducer(initialState, action);
  });
});
