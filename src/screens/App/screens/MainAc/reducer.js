import { fromJS } from 'immutable';

const defaultState = fromJS({
  popOver: {
    isShow: false,
    transitionName: 'fade-up',

    // 'vlanAsider' 'groupAsider' 'topMenu'
    name: 'topMenu',
  },
  modal: {
    isShow: false,
    name: 'group',
  },
  vlan: {
    selected: '2',
    list: [
      {
        id: '1',
        remark: '测试'
      }, {
        id: '2',
        remark: '研发'
      }
    ]
  },
  group: {
    selected: '2',
    list: [
      {
        id: '1',
        groupName: '测试',
        remark: '测试',
        devices: [
          {
            name: "23",
            ip: "32",
          }
        ]
      }, {
        id: '2',
        groupName: '测试',
        remark: '研发',
        devices: [
          {
            name: "23",
            ip: "32",
          }
        ]
      }
    ]
  }
});

function togglePopOverState(state, option) {
  let ret = state;
  let isShow = option.isShow;
  let name = option.name || state.getIn(['popOver', 'name']);

  if(isShow === undefined) {
    isShow = !state.getIn(['popOver', 'isShow']);
  }

  return state.mergeIn(['popOver'], {
    isShow,
    name,
  });
}

function changeModalState(state, option) {
  let ret = state;
  let myOption = option;

  if(myOption.isShow === undefined) {
    myOption.isShow = !state.getIn(['modal', 'isShow']);
  }

  myOption.name = option.name || state.getIn(['modal', 'name']);

  return state.mergeIn(['modal'], myOption);
}

export default function (state = defaultState, action) {
  switch (action.type) {
    case 'TOGGLE_MAIN_POP_OVER':
      return togglePopOverState(state, action.option);

    case 'SHOW_MAIN_MODAL':
      return changeModalState(state, action.option);

    case 'SELECT_VLAN':
      return togglePopOverState(state, {
          name: 'vlanAsider',
          isShow: false
        }).setIn(['vlan', 'selected'], action.id);

    case 'SELECT_GROUP':
      return togglePopOverState(state, {
          name: 'groupAsider',
          isShow: false,
        }).setIn(['group', 'selected'], action.id);

    default:
  }
  return state;
}
