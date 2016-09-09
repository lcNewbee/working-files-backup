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
    payload: data,
    meta: {
      name,
      updateAt: Date.now(),
    },
  };
}

export function changeListQuery(payload) {
  return {
    type: 'CHANGE_LIST_QUERY',
    payload,
  };
}

export function changeListActionQuery(payload) {
  return {
    type: 'CHANGE_LIST_ACTION_QUERY',
    payload,
  };
}

export function editListItemByIndex(index) {
  return {
    type: 'EDIT_LIST_ITEM_BY_INDEX',
    payload: {
      index,
    },
  };
}

export function updateEditListItem(data, sync) {
  return {
    type: 'UPDATE_EDIT_LIST_ITEM',
    data,
    sync,
  };
}
export function updateListItemByIndex(index, data) {
  return {
    type: 'UPDATE_LIST_ITEM_BY_INDEX',
    data,
    index,
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
    const name = globalState.screens.get('curListId');
    const formUrl = globalState.screens.getIn([name, 'formUrl']);
    const fetchUrl = globalState.screens.getIn([name, 'fetchUrl']) || formUrl;
    let query = globalState.screens.getIn([name, 'query']) || {};

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

export function saveListSettings(url) {
  return (dispatch, getState) => {
    const globalState = getState();
    const name = globalState.screens.get('curListId');
    const curData = globalState.screens.getIn([name, 'curSettings']);
    const oriData = globalState.screens.getIn([name, 'data', 'settings']);
    const formUrl = globalState.screens.getIn([name, 'formUrl']);
    const fetchUrl = globalState.screens.getIn([name, 'fetchUrl']) || formUrl;

    if (!curData.equals(oriData)) {
      console.log('hasChange');
    }

    return dispatch(appActions.save(url || formUrl, curData.toJS()))
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          dispatch(fetchList(fetchUrl));
        }
      });
  };
}

export function onListAction(url) {
  return (dispatch, getState) => {
    const globalState = getState();
    const name = globalState.screens.get('curListId');
    const editMap = globalState.screens.getIn([name, 'data', 'edit']);
    const formUrl = globalState.screens.getIn([name, 'formUrl']);
    const saveUrl = globalState.screens.getIn([name, 'saveUrl']) || formUrl;
    const fetchUrl = globalState.screens.getIn([name, 'fetchUrl']) || formUrl;
    let actionQuery = globalState.screens.getIn([name, 'actionQuery']);
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
