import { fromJS } from 'immutable';

const defaultState = fromJS({
  popOver: {
    isShow: false,
    transitionName: 'fade-up',

    // 'vlanAsider' 'groupAsider' 'topMenu'
    name: 'topMenu',
  },

  // 弹出框配置，
  modal: {
    isShow: false,
    size: 'lg',
    name: 'group',
  },

  // Ap组相关
  group: {
    selected: {
      id: 1,
    },
    list: [],

    // 当前管理组内设备列表
    devices: [],
  },

  // 未分组设备列表
  defaultDevices: [],
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

function receiveApGroup(state, action) {
  const list = action.payload.list;
  let selectedItem = state.getIn(['group', 'selected']);

  if (selectedItem.isEmpty() && list[0]) {
    selectedItem = fromJS(list[0]);
  }

  return state.setIn(['group', 'selected'], selectedItem)
    .setIn(['group', 'list'], fromJS(list));
}

function selectList(state, name, id) {
  const selectedItem = state.getIn([name, 'list'])
      .find(item => item.get('id') === id) ||
      state.getIn([name, 'selected']);

  return state.setIn([name, 'selected'], selectedItem);
}

function selectManageList(state, name, id) {
  const selectedItem = state.getIn([name, 'list'])
      .find(item => item.get('id') === id) ||
      state.getIn([name, 'manageSelected']);

  return state.setIn([name, 'manageSelected'], selectedItem);
}

function selectedListItem(list, data) {
  let ret = list;

  if (data.index !== -1) {
    ret = ret.setIn([data.index, 'selected'], data.selected);
  } else {
    ret = ret.map(item => item.set('selected', data.selected));
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

    case 'SELECT_MANAGE_GROUP':
      return selectManageList(state, 'group', action.id);

    case 'RC_DELETE_AP_GROUP':
      return receiveApGroup(state, action);

    case 'RC_FETCH_GROUP_APS':
      return state.setIn(['devices'], fromJS(action.data.list));

    case 'SELECT_ADD_AP_GROUP_DEVICE':
      return state.set('devices', selectedListItem(state.get('devices'), action.data));

    default:
  }
  return state;
}
