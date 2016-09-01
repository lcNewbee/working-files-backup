import * as appActions from './app';

const refreshTimeout = null;

export function reqeustFetchList() {
  return {
    type: 'REQEUST_FETCH_LIST',
  };
}

export function reciveFetchList(data, name) {
  return {
    type: 'RECIVE_FETCH_LIST',
    updateAt: Date.now(),
    data,
    name,
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

export function updateListSettings(data) {
  return {
    type: 'UPDATE_LIST_SETTINGS',
    data,
  };
}

export function addListItem(defaultItem) {
  return {
    type: 'ADD_LIST_ITEM',
    defaultItem,
  };
}

export function selectListItem(data) {
  return {
    type: 'SELECT_LIST_ITEM',
    data,
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

export function fetchList(url) {
  return (dispatch, getState) => {
    const globalState = getState();
    // const refreshTime = globalState.app.get('rateInterval');
    const name = globalState.list.get('curListId');
    const formUrl = globalState.list.getIn([name, 'formUrl']);
    const fetchUrl = globalState.list.getIn([name, 'fetchUrl']) || formUrl;
    let query = globalState.list.getIn([name, 'query']) || {};

    window.clearTimeout(refreshTimeout);
    dispatch(reqeustFetchList());

    if (query && query.toJS) {
      query = query.toJS();
    }

    return dispatch(appActions.fetch(url || fetchUrl, query))
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          dispatch(reciveFetchList(json.data, name));
        }

        // if (refreshTime && refreshTime > 0) {
        //   refreshTimeout = window.setTimeout(() => {
        //     dispatch(fetchList(formUrl));
        //   }, refreshTime);
        // }
      });
  };
}

export function onListAction(url) {
  return (dispatch, getState) => {
    const globalState = getState();
    const name = globalState.list.get('curListId');
    const editMap = globalState.list.getIn([name, 'data', 'edit']);
    const formUrl = globalState.list.getIn([name, 'formUrl']);
    const saveUrl = globalState.list.getIn([name, 'saveUrl']) || formUrl;
    const fetchUrl = globalState.list.getIn([name, 'fetchUrl']) || formUrl;
    let actionQuery = globalState.list.getIn([name, 'actionQuery']);
    const actionType = actionQuery.get('action');

    window.clearTimeout(refreshTimeout);

    // 需要把修改后数据合并到post参数里
    if (actionType === 'add' || actionType === 'edit') {
      actionQuery = actionQuery.merge(editMap).toJS();
    }

    return dispatch(appActions.save(url || saveUrl, actionQuery))
      .then((json) => {
        let ret = 'Server Error';

        if (json.state && json.state.code === 2000) {
          dispatch(fetchList(fetchUrl));
          ret = 'ok';
        }
        return ret;
      });
  };
}
