import * as appActions from './app';
import utils from 'shared/utils';

let refreshTimeout = null;

export function reqeustFetchList() {
  return {
    type: 'REQEUST_FETCH_LIST',
  };
}

export function reciveFetchList(data) {
  return {
    type: 'RECIVE_FETCH_LIST',
    updateAt: Date.now(),
    data,
  };
}

export function changeListQuery(query) {
  return {
    type: 'CHANGE_LIST_QUERY',
    query,
  };
}
export function changeListActionQuery(query) {
  return {
    type: 'CHANGE_LIST_ACTION_QUERY',
    query,
  };
}

export function editListItemByIndex(index) {
  return {
    type: 'EDIT_LIST_ITEM_BY_INDEX',
    index,
  };
}

export function updateEditListItem(data) {
  return {
    type: 'UPDATE_EDIT_LIST_ITEM',
    data,
  };
}

export function addListItem(defaultItem) {
  return {
    type: 'ADD_LIST_ITEM',
    defaultItem,
  };
}

export function closeListItemModal() {
  return {
    type: 'CLOSE_LIST_ITEM_MODAL',
  };
}

export function leaveListScreen() {
  window.clearTimeout(refreshTimeout);

  return {
    type: 'LEAVE_LIST_SCREEN',
  };
}

export function initList(option) {
  return {
    type: 'INIT_LIST',
    option,
  };
}

export function fetchList() {
  return (dispatch, getState) => {
    const globalState = getState();
    const refreshTime = globalState.app.get('rateInterval');
    const name = globalState.list.get('curListId');
    const query = globalState.list.getIn([name, 'query']).toJS();
    const formUrl = globalState.list.getIn([name, 'formUrl']);

    window.clearTimeout(refreshTimeout);
    dispatch(reqeustFetchList());

    dispatch(appActions.fetch(formUrl, query))
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          dispatch(reciveFetchList(json.data));
        }

        if (refreshTime && refreshTime > 0) {
          refreshTimeout = window.setTimeout(() => {
            dispatch(fetchList(formUrl));
          }, refreshTime);
        }
      });
  };
}

export function onListAction() {
  return (dispatch, getState) => {
    const globalState = getState();
    const name = globalState.list.get('curListId');
    const editMap = globalState.list.getIn([name, 'edit']);
    const formUrl = globalState.list.getIn([name, 'formUrl']);
    let actionQuery = globalState.list.getIn([name, 'actionQuery']);

    window.clearTimeout(refreshTimeout);

    if (actionQuery.get('action') === 'remove') {
      actionQuery = actionQuery.merge(
        globalState.list.getIn([name, 'data', 'list', actionQuery.get('index')])
      );
    } else {
      actionQuery = actionQuery.merge(editMap).toJS();
    }

    dispatch(appActions.save(formUrl, actionQuery))
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          dispatch(fetchList(formUrl));
        }
      });
  };
}
