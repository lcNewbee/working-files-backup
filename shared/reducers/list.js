import { fromJS } from 'immutable';

const defaultItem = fromJS({
  fetching: false,
  query: {
    type: '0',
    size: 20,
    page: 1,
  },
  data: {
    edit: {},
    list: [],
  },
  actionQuery: {},
});
const defaultState = fromJS({
  curListId: 'base',
  base: defaultItem,
});

function initListItem(state, action) {
  let ret = state;
  const listId = action.option.listId;
  const myItem = defaultItem.merge(action.option);

  if (!state.get(listId) || state.get(listId).isEmpty()) {
    ret = state.mergeIn([listId], myItem);
  }

  return ret.set('curListId', listId);
}

export default function (state = defaultState, action) {
  const curListName = state.get('curListId');
  switch (action.type) {
    case 'INIT_LIST':
      return initListItem(state, action);

    case 'REQEUST_FETCH_LIST':
      return state.setIn([curListName, 'fetching'], true);

    case 'RECIVE_FETCH_LIST':
      return state.setIn([curListName, 'fetching'], false)
        .setIn([curListName, 'updateAt'], action.updateAt)
        .mergeIn([curListName, 'data'], action.data);

    case 'CHANGE_LIST_QUERY':
      return state.mergeIn([curListName, 'query'], action.query);

    case 'CHANGE_LIST_ACTION_QUERY':
      return state.mergeIn([curListName, 'actionQuery'], action.query);

    case 'UPDATE_EDIT_LIST_ITEM':
      return state.mergeIn([curListName, 'data', 'edit'], action.data);

    case 'EDIT_LIST_ITEM_BY_INDEX':
      return state.setIn([curListName, 'data', 'edit'],
        state.getIn([curListName, 'data', 'list', action.index]).merge({
          myTitle: `${_('Edit')}: ${action.index}`,
        })).setIn([curListName, 'actionQuery', 'action'], 'edit');

    case 'ADD_LIST_ITEM':
      return state.setIn(
        [curListName, 'data', 'edit'],
        fromJS({
          myTitle: _('Add'),
        }).merge(action.defaultItem)
      )
      .setIn([curListName, 'actionQuery', 'action'], 'add');

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