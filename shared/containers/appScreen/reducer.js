import { fromJS } from 'immutable';
import ACTION_TYPES from './actionTypes';

const defaultItem = fromJS({
  fetching: false,
  query: {
    type: '0',
    size: 20,
    page: 1,
    search: '',
  },
  data: {
    settings: {},
    list: [],
  },

  // 用于保存Screen自定义属性
  customProps: {},

  //
  curList: [],

  // 页面全局配置
  curSettings: {},

  // 当前正在操作的列表项
  curListItem: {},

  // 操作的列表项默认值
  defaultEditData: {},

  // 操作相关查询对象
  actionQuery: {},
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
function initScreenState($$state, action) {
  const screenId = action.payload.id;
  const defaultSettingsData = action.payload.defaultSettingsData;
  let $$ret = $$state;
  let $$settingsData = $$ret.getIn([screenId, 'curSettings']) || fromJS({});
  let $$myScreenState = $$ret.get(screenId);
  if (!$$myScreenState) {
    $$myScreenState = defaultItem.mergeDeep(action.payload);
  } else {
    $$myScreenState = $$myScreenState.mergeDeep(action.payload);
  }


  // 只有当 $$settingsData 为空时才合并默认Settings
  if (defaultSettingsData && $$settingsData.isEmpty()) {
    $$settingsData = $$settingsData.merge(defaultSettingsData);
  }

  // 如何处理 screen的第一次初始化与其他初始
  $$ret = $$ret.mergeIn(
    [screenId],
    $$myScreenState.set('curSettings', $$settingsData),
  ).set('curScreenId', screenId);

  return $$ret;
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
  let selectedList = state.getIn([curScreenName, 'actionQuery', 'selectedList']) || fromJS([]);

  if (data.index !== -1) {
    list = list.setIn([data.index, '__selected__'], data.selected);
    if (data.selected) {
      selectedList = selectedList.push(data.index);
    } else {
      selectedList = selectedList.delete(data.index);
    }
  } else {
    selectedList = fromJS([]);

    if (data.selected) {
      list = list.map((item, index) => {
        let $$ret = item;

        if (data.unselectableList.indexOf(index) === -1) {
          selectedList = selectedList.push(index);
          $$ret = $$ret.set('__selected__', true);
        }
        return $$ret;
      });
    } else {
      list = list.map(item => item.set('__selected__', false));
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
      item => item.get(action.payload.keyName) === action.payload.val,
    );
  }

  myItem = curList.get(listItemIndex);

  return state.setIn(
      [curScreenName, 'curListItem'],
      defaultEditData.merge(myItem),
    )
    .mergeIn([curScreenName, 'actionQuery'], {
      action: action.meta.action || 'edit',
      myTitle: `${__('Edit')}: ${action.payload.val}`,
      index: listItemIndex,
    });
}

function receiveScreenData($$state, curScreenName, action) {
  let $$ret = $$state;
  let $$selectedList = $$state.getIn([curScreenName, 'actionQuery', 'selectedList']);

  if (action.payload && action.payload.settings) {
    $$ret = $$ret.mergeDeepIn([curScreenName, 'curSettings'], action.payload.settings);
  }

  // 如果接受新的 list，清空已选择状态
  if (action.payload && action.payload.list) {
    $$selectedList = fromJS([]);
  }

  return $$ret.setIn([curScreenName, 'fetching'], false)
    .mergeIn([curScreenName, 'data'], action.payload)
    .setIn([curScreenName, 'data', 'updateAt'], action.meta.updateAt)
    .setIn([curScreenName, 'actionQuery', 'selectedList'], $$selectedList);
}
function addScreen(state, action) {
  let $$ret = state;

  if (action.payload && action.payload.id) {
    $$ret = state.set(action.payload.id, defaultItem)
      .set('curScreenId', action.payload.id);

    if (action.payload.route) {
      $$ret = $$ret.mergeIn(
        [action.payload.id],
        fromJS(action.payload.route).delete('routes'),
      );
    }
  }

  return $$ret;
}
export default function (state = defaultState, action) {
  const curScreenName = (action.meta && action.meta.name) || state.get('curScreenId');
  const defaultEditData = state.getIn([curScreenName, 'defaultEditData']) || fromJS({});

  switch (action.type) {

    // Screen 全局action
    case ACTION_TYPES.ADD:
      return addScreen(state, action);
    case ACTION_TYPES.INIT:
      return initScreenState(state, action, curScreenName);

    case ACTION_TYPES.LEAVE:
      return state.mergeIn([curScreenName, 'query'], {
        search: '',
      })
      .setIn([curScreenName, 'curListItem'], defaultItem.get('curListItem'))
      .setIn([curScreenName, 'actionQuery', 'selectedList'], fromJS([]));

    case ACTION_TYPES.REQUEST_FETCH_DATA:
      return state.setIn([curScreenName, 'fetching'], true);

    case ACTION_TYPES.UPDATE_CUSTOM_PROPS:
      return state.mergeDeepIn([curScreenName, 'customProps'], action.payload);

    case ACTION_TYPES.RECEIVE_DATA:
      return receiveScreenData(state, curScreenName, action);

    // Screen Setting相关
    case ACTION_TYPES.UPDATE_SETTINGS:
      return state.mergeDeepIn([curScreenName, 'curSettings'], action.payload);

    // Screen 列表操作
    case ACTION_TYPES.CHANGE_QUERY:
      return state.mergeIn([curScreenName, 'query'], action.payload);

    case ACTION_TYPES.CHANGE_ACTION_QUERY:
      return state.mergeIn([curScreenName, 'actionQuery'], action.payload);

    case ACTION_TYPES.ADD_LIST_ITEM:
      return state.setIn(
        [curScreenName, 'curListItem'],
        fromJS({}).merge(action.payload || defaultEditData),
      )
      .mergeIn([curScreenName, 'actionQuery'], {
        action: 'add',
        myTitle: __('Add'),
      });

    case ACTION_TYPES.SELECT_LIST_ITEM:
      return selectedListItem(state, action, curScreenName);

    case ACTION_TYPES.UPDATE_CUR_EDIT_LIST_ITEM:
      return updateCurEditListItem(curScreenName, state, action);

    case ACTION_TYPES.UPDATE_LIST_ITEM_BY_INDEX:
      return state.mergeDeepIn(
        [curScreenName, 'data', 'list', action.meta.index],
        action.payload,
      );

    case ACTION_TYPES.ACTIVE_LIST_ITEM:
      return activeListItem(state, curScreenName, action);

    case ACTION_TYPES.CLOSE_LIST_ITEM_MODAL:
      return state.setIn([curScreenName, 'curListItem'], fromJS({}))
        .setIn([curScreenName, 'actionQuery', 'action'], '');

    default:

  }
  return state;
}
