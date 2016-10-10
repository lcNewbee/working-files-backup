import { fromJS } from 'immutable';

const defaultItem = fromJS({
  fetching: false,
  query: {
    type: '0',
    size: 20,
    page: 1,
  },
  data: {
    settings: {},
    list: [],
  },
  curList: [],

  // 页面全局配置
  curSettings: {},

  // 当前正在操作的列表项
  curListItem: {},

  // 操作相关查询对象
  actionQuery: {},

  // 列表某项添加或修改时默认数据
  defaultEditData: {},
});
const defaultState = fromJS({
  curScreenId: 'base',
  base: defaultItem,
});

/**
 * Init screen state
 *
 * @param {immutable} state
 * @param {object} action
 * @returns New immutable state
 */
function initScreenState(state, action) {
  const screenId = action.payload.id;
  let ret = state;
  let settingsData = fromJS({});
  let myItem = state.get(screenId);

  if (!myItem) {
    myItem = defaultItem.mergeDeep(action.payload);
  } else {
    myItem = myItem.mergeDeep(action.payload);
  }

  if (action.payload.defaultSettingsData) {
    settingsData = settingsData
        .merge(action.payload.defaultSettingsData);
  }

  if (!state.get(screenId) || state.get(screenId).isEmpty()) {
    ret = state.mergeIn(
      [screenId],
      myItem.set('curSettings', settingsData)
    );
  }

  return ret
    .set('curScreenId', screenId);
}

/**
 * Change the selected list data, save the selected
 *
 * @param {immutable} state
 * @param {any} data
 * @param {string} curScreenName
 * @returns New immutable state
 */
function selectedListItem(state, action, curScreenName) {
  const data = action.payload;
  let list = state.getIn([curScreenName, 'data', 'list']);
  let selectedList = state.getIn([curScreenName, 'actionQuery', 'selected']) || fromJS([]);

  if (data.index !== -1) {
    list = list.setIn([data.index, '_selected'], data.selected);
    if (data.selected) {
      selectedList = selectedList.push(data.index);
    } else {
      selectedList = selectedList = selectedList.delete(selectedList.indexOf(data.index));
    }
  } else {
    selectedList = fromJS([]);
    if (data.selected) {
      list = list.map((item, index) => {
        selectedList = selectedList.push(index);

        return item.set('_selected', true);
      });
    } else {
      list = list.map(item => item.set('_selected', false));
    }
  }

  return state.setIn([curScreenName, 'data', 'list'], list)
      .setIn([curScreenName, 'actionQuery', 'selectedList'], selectedList);
}


function updateCurEditListItem(curScreenName, state, action) {
  const curIndex = state.getIn([curScreenName, 'actionQuery', 'index']);
  let ret = state.mergeDeepIn([curScreenName, 'curListItem'], action.payload);

  if (action.meta.sync) {
    ret = ret.mergeDeepIn([curScreenName, 'data', 'list', curIndex], action.payload);
  }

  return ret;
}

function activeListItem(state, curScreenName, action) {
  const curList = state.getIn([curScreenName, 'data', 'list']);
  const defaultEditData = state.getIn([curScreenName, 'defaultEditData']) || fromJS({});
  let listItemIndex = 0;
  let myItem = fromJS({});

  if (action.payload.keyName === 'index') {
    listItemIndex = action.payload.val;
  } else {
    listItemIndex = curList.findIndex(
      item => item.get(action.payload.keyName) === action.payload.val
    );
  }

  myItem = curList.get(listItemIndex);

  return state.setIn(
      [curScreenName, 'curListItem'],
      defaultEditData.merge(myItem)
    )
    .mergeIn([curScreenName, 'actionQuery'], {
      action: action.meta.action || 'edit',
      myTitle: `${_('Edit')}: ${action.payload.val}`,
      index: listItemIndex,
    });
}

export default function (state = defaultState, action) {
  const curScreenName = (action.meta && action.meta.name) || state.get('curScreenId');
  const defaultEditData = state.getIn([curScreenName, 'defaultEditData']) || fromJS({});

  switch (action.type) {

    // Screen 全局action
    case 'INIT_SCREEN':
      return initScreenState(state, action, curScreenName);

    case 'LEAVE_SCREEN':
      return state.mergeIn([curScreenName, 'query'], {
        search: '',
      });

    case 'REQEUST_FETCH_SCREEN_DATA':
      return state.setIn([curScreenName, 'fetching'], true);

    case 'RECIVE_SCREEN_DATA':
      return state.setIn([curScreenName, 'fetching'], false)
        .mergeDeepIn([curScreenName, 'curSettings'], (action.payload && action.payload.settings))
        .mergeIn([curScreenName, 'data'], action.payload)
        .setIn([curScreenName, 'data', 'updateAt'], action.meta.updateAt);

    // Screen Setting相关
    case 'UPDATE_SCREEN_SETTINGS':
      return state.mergeDeepIn([curScreenName, 'curSettings'], action.payload);

    // Screen 列表操作
    case 'CHANGE_LIST_QUERY':
      return state.mergeIn([curScreenName, 'query'], action.payload);

    case 'CHANGE_LIST_ACTION_QUERY':
      return state.mergeIn([curScreenName, 'actionQuery'], action.payload);

    case 'ADD_LIST_ITEM':
      return state.setIn(
        [curScreenName, 'curListItem'],
        fromJS({}).merge(action.payload || defaultEditData)
      )
      .mergeIn([curScreenName, 'actionQuery'], {
        action: 'add',
        myTitle: _('Add'),
      });

    case 'SELECT_LIST_ITEM':
      return selectedListItem(state, action, curScreenName);

    case 'UPDATE_CUR_EDIT_LIST_ITEM':
      return updateCurEditListItem(curScreenName, state, action);

    case 'UPDATE_LIST_ITEM_BY_INDEX':
      return state.mergeDeepIn(
        [curScreenName, 'data', 'list', action.meta.index],
        action.payload,
      );

    case 'ACTIVE_LIST_ITEM':
      return activeListItem(state, curScreenName, action);

    case 'CLOSE_LIST_ITEM_MODAL':
      return state.setIn([curScreenName, 'curListItem'], fromJS({}))
        .setIn([curScreenName, 'actionQuery', 'action'], '');

    default:

  }
  return state;
}
