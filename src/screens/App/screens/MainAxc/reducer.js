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
    selected: {},
    manageSelected: {},
    addData: {
      groupname: '',
      groupRemark: '',
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
  let manageSelectedItem = state.getIn(['group', 'manageSelected']);

  if (selectedItem.isEmpty() && list[0]) {
    selectedItem = fromJS(list[0]);
  }

  if (manageSelectedItem.isEmpty() && list[0]) {
    manageSelectedItem = fromJS(list[0]);
  }

  return state.setIn(['group', 'selected'], selectedItem)
    .setIn(['group', 'manageSelected'], manageSelectedItem)
    .setIn(['group', 'list'], fromJS(list));
}

function receiveDevices(state, action) {
  const rcList = action.payload.list || [];
  let ret = state;

  // 如果是默认ap
  if (action.meta) {
    ret = ret.set('defaultDevices', fromJS(rcList));
  } else {
    ret = ret.setIn(['group', 'devices'], fromJS(rcList));
  }

  return ret;
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

function selectAddGroupDevices(state, action) {
  const data = action.payload;
  let defaultDevices = state.get('defaultDevices');

  if (data.index !== -1) {
    defaultDevices = defaultDevices.setIn([data.index, '__selected__'], data.selected);
  } else {
    defaultDevices = defaultDevices.map(item => item.set('__selected__', data.selected));
  }
  return state.set('defaultDevices', defaultDevices);
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

    case 'RC_FETCH_AP_GROUP':
      return receiveApGroup(state, action);

    case 'RC_FETCH_GROUP_APS':
      return receiveDevices(state, action);

    case 'SELECT_ADD_AP_GROUP_DEVICE':
      return selectAddGroupDevices(state, action);

    case 'UPDATE_ADD_AP_GROUP_DEVICE':
      return state.mergeIn(['group', 'addData'], action.payload);

    default:
  }
  return state;
}
