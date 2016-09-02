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
  const curListName = action.name || state.get('curListId');
  const defaultEditData = state.getIn([curListName, 'defaultEditData']) || fromJS({});

  switch (action.type) {
    case 'INIT_LIST':
      return initListItem(state, action, curListName);

    case 'REQEUST_FETCH_LIST':
      return state.setIn([curListName, 'fetching'], true);

    case 'RECIVE_FETCH_LIST':
      return state.setIn([action.name, 'fetching'], false)
        .setIn([action.name, 'updateAt'], action.updateAt)
        .mergeIn([action.name, 'curSettings'], (action.data && action.data.settings))
        .mergeIn([action.name, 'data'], action.data);

    case 'CHANGE_LIST_QUERY':
      return state.mergeIn([curListName, 'query'], action.query);

    case 'CHANGE_LIST_ACTION_QUERY':
      return state.mergeIn([curListName, 'actionQuery'], action.query);

    case 'UPDATE_EDIT_LIST_ITEM':
      return state.mergeIn([curListName, 'data', 'edit'], action.data);

    case 'UPDATE_LIST_SETTINGS':
      return state.mergeIn([curListName, 'curSettings'], action.data);

    case 'EDIT_LIST_ITEM_BY_INDEX':
      return state.setIn(
          [curListName, 'data', 'edit'],
          defaultEditData.merge(state.getIn([curListName, 'data', 'list', action.index])).merge({
            myTitle: `${_('Edit')}: ${action.index}`,
          })
        )
        .setIn([curListName, 'actionQuery', 'action'], 'edit');

    case 'ADD_LIST_ITEM':
      return state.setIn(
        [curListName, 'data', 'edit'],
        fromJS({
          myTitle: _('Add'),
        }).merge(defaultEditData)
      )
      .setIn([curListName, 'actionQuery', 'action'], 'add');

    case 'SELECT_LIST_ITEM':
      return state.setIn([curListName, 'data', 'list'],
          selectedListItem(state.getIn([curListName, 'data', 'list']), action.data));

    case 'CLOSE_LIST_ITEM_MODAL':
      return state.setIn([curListName, 'data', 'edit'], fromJS({}));

    case 'LEAVE_LIST_SCREEN':
      return state.mergeIn([curListName, 'query'], {
        search: '',
      });

    default:

  }
  return state;
}
