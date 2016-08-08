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
    size: 'lg',
    name: 'group',
  },

  vlan: {
    selected: {
      id: '2',
      remark: '市场部',
    },
    list: [
      {
        id: '1',
        remark: '测试',
      }, {
        id: '2',
        remark: '市场部',
      },
    ],
  },
  group: {
    selected: {},
    list: [
      {
        id: '1',
        groupName: '测试',
        remark: '测试',
        devices: [
          {
            name: '23',
            ip: '32',
          },
        ],
      }, {
        id: '2',
        groupName: '研发',
        remark: '研发',
        devices: [
          {
            name: '23',
            ip: '32',
          },
        ],
      },
    ],
  },

  devices: {

  },
});

function togglePopOverState(state, option) {
  const thisOption = option || {};

  if (thisOption.isShow === undefined) {
    thisOption.isShow = !state.getIn(['popOver', 'isShow']);
  }

  return state.mergeIn(['popOver'], thisOption);
}

function changeModalState(state, option) {
  const myOption = option || {};

  if (myOption.isShow === undefined) {
    myOption.isShow = !state.getIn(['modal', 'isShow']);
  }

  if (myOption.okButton === undefined) {
    myOption.okButton = true;
  }
  if (myOption.cancelButton === undefined) {
    myOption.cancelButton = true;
  }

  if (myOption.size === undefined) {
    myOption.size = 'md';
  }

  return state.mergeIn(['modal'], myOption);
}

function rcApGroup(state, list) {
  let selectedItem = state.getIn(['group', 'selected']);

  if (selectedItem.isEmpty() && list[0]) {
    selectedItem = fromJS(list[0]);
  }

  return state.setIn(['group', 'selected'], selectedItem)
    .setIn(['group', 'list'], fromJS(list));
}

function selectList(state, name, id) {
  const selectedItem = state.getIn([name, 'list'])
      .find((item) => item.get('id') === id) ||
      state.getIn([name, 'selected']);

  return state.setIn([name, 'selected'], selectedItem);
}

function selectedListItem(list, data) {
  let ret = list;

  if (data.index !== -1) {
    ret = ret.setIn([data.index, 'selected'], data.selected);
  } else {
    ret = ret.map((item) => item.set('selected', data.selected));
  }

  return ret;
}

export default function (state = defaultState, action) {
  switch (action.type) {
    case 'TOGGLE_MAIN_POP_OVER':
      return togglePopOverState(state, action.option);

    case 'SHOW_MAIN_MODAL':
      return changeModalState(state, action.option);

    case 'SELECT_VLAN':
      return selectList(state, 'vlan', action.id);

    case 'SELECT_GROUP':
      return selectList(state, 'group', action.id);

    case 'RC_DELETE_AP_GROUP':
      return rcApGroup(state, action.data.list);

    case 'RC_FETCH_GROUP_APS':
      return state.setIn(['devices'], fromJS(action.data.list));

    case 'SELECT_ADD_AP_GROUP_DEVICE':
      return state.set('devices', selectedListItem(state.get('devices'), action.data));

    default:
  }
  return state;
}
