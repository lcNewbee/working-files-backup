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
    edit: {},
    list: [],
  },
  curList: [],
  curSettings: {},
  actionQuery: {},
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


function updateEditListItem(curScreenName, state, action) {
  const curIndex = state.getIn([curScreenName, 'data', 'edit', 'index']);
  let ret = state.mergeDeepIn([curScreenName, 'data', 'edit'], action.payload);

  if (action.meta.sync) {
    ret = ret.mergeDeepIn([curScreenName, 'data', 'list', curIndex], action.payload);
  }

  return ret;
}

function findListItemByKey(list, option) {
  return list.find(
    item => item.get(option.keyName) === option.val
  );
}

function editListItemByKey(state, curScreenName, action) {
  const curList = state.getIn([curScreenName, 'data', 'list']);
  const myItem = findListItemByKey(curList, action.payload);
  const defaultEditData = state.getIn([curScreenName, 'defaultEditData']) || fromJS({});

  return state.setIn(
    [curScreenName, 'data', 'edit'],
    defaultEditData
      .merge(myItem)
      .merge({
        myTitle: `${_('Edit')}: ${action.payload.val}`,
      })
  )
  .setIn([curScreenName, 'actionQuery', 'action'], 'edit');
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
        [curScreenName, 'data', 'edit'],
        fromJS({
          myTitle: _('Add'),
        }).merge(action.payload || defaultEditData)
      )
      .setIn([curScreenName, 'actionQuery', 'action'], 'add');

    case 'SELECT_LIST_ITEM':
      return selectedListItem(state, action, curScreenName);

    case 'UPDATE_EDIT_LIST_ITEM':
      return updateEditListItem(curScreenName, state, action);

    case 'UPDATE_LIST_ITEM_BY_INDEX':
      return state.mergeDeepIn(
        [curScreenName, 'data', 'list', action.meta.index],
        action.payload,
      );

    case 'EDIT_LIST_ITEM_BY_KEY':
      return editListItemByKey(state, curScreenName, action);

    case 'EDIT_LIST_ITEM_BY_INDEX':
      return state.setIn(
          [curScreenName, 'data', 'edit'],
          defaultEditData.merge(state.getIn([curScreenName, 'data', 'list', action.payload.index])).merge({
            myTitle: `${_('Edit')}: ${action.payload.index}`,
            index: action.payload.index,
          })
        )
        .setIn(
          [curScreenName, 'actionQuery', 'action'],
          action.payload.action || 'edit'
        );

    case 'CLOSE_LIST_ITEM_MODAL':
      return state.setIn([curScreenName, 'data', 'edit'], fromJS({}))
        .setIn([curScreenName, 'actionQuery', 'action'], '');

    default:

  }
  return state;
}
