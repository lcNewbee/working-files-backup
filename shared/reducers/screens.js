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
  curListId: 'base',
  base: defaultItem,
});

function initListItem(state, action) {
  const listId = action.option.listId;
  let ret = state;
  let settingsData = fromJS({});
  let myItem = state.get(listId);

  if (!myItem) {
    myItem = defaultItem.mergeDeep(action.option);
  } else {
    myItem = myItem.mergeDeep(action.option);
  }

  if (action.option.defaultSettingsData) {
    settingsData = settingsData
        .merge(action.option.defaultSettingsData);
  }

  if (!state.get(listId) || state.get(listId).isEmpty()) {
    ret = state.mergeIn(
      [listId],
      myItem.set('curSettings', settingsData)
    );
  }

  return ret
    .set('curListId', listId);
}
function selectedListItem(state, data, curScreenName) {
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
  let ret = state.mergeDeepIn([curScreenName, 'data', 'edit'], action.data);

  if (action.sync) {
    ret = ret.mergeDeepIn([curScreenName, 'data', 'list', curIndex], action.data);
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
  const curScreenName = (action.meta && action.meta.name) || state.get('curListId');
  const defaultEditData = state.getIn([curScreenName, 'defaultEditData']) || fromJS({});

  switch (action.type) {
    case 'INIT_LIST':
      return initListItem(state, action, curScreenName);

    case 'REQEUST_FETCH_LIST':
      return state.setIn([curScreenName, 'fetching'], true);

    case 'RECIVE_FETCH_LIST':
      return state.setIn([curScreenName, 'fetching'], false)
        .mergeDeepIn([curScreenName, 'curSettings'], (action.payload && action.payload.settings))
        .mergeIn([curScreenName, 'data'], action.payload)
        .setIn([curScreenName, 'data', 'updateAt'], action.meta.updateAt);

    case 'CHANGE_LIST_QUERY':
      return state.mergeIn([curScreenName, 'query'], action.payload);

    case 'CHANGE_LIST_ACTION_QUERY':
      return state.mergeIn([curScreenName, 'actionQuery'], action.payload);

    case 'UPDATE_EDIT_LIST_ITEM':
      return updateEditListItem(curScreenName, state, action);

    case 'UPDATE_LIST_SETTINGS':
      return state.mergeDeepIn([curScreenName, 'curSettings'], action.payload);

    case 'UPDATE_LIST_ITEM_BY_INDEX':
      return state.mergeDeepIn([curScreenName, 'data', 'list', action.index], action.data);

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

    case 'ADD_LIST_ITEM':
      return state.setIn(
        [curScreenName, 'data', 'edit'],
        fromJS({
          myTitle: _('Add'),
        }).merge(defaultEditData)
      )
      .setIn([curScreenName, 'actionQuery', 'action'], 'add');

    case 'SELECT_LIST_ITEM':
      return selectedListItem(state, action.data, curScreenName);

        // state.setIn([curScreenName, 'data', 'list'],
        //   selectedListItem(state.getIn([curScreenName, 'data', 'list']), action.data))
        //   .setIn(['curScreenName', 'actionQuery', 'selected'], action.data.index);

    case 'CLOSE_LIST_ITEM_MODAL':
      return state.setIn([curScreenName, 'data', 'edit'], fromJS({}))
        .setIn([curScreenName, 'actionQuery', 'action'], '');

    case 'LEAVE_LIST_SCREEN':
      return state.mergeIn([curScreenName, 'query'], {
        search: '',
      });

    default:

  }
  return state;
}
