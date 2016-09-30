import * as appActions from './app';

const refreshTimeout = null;

// Screen common actions
export function initScreen(option) {
  return {
    type: 'INIT_SCREEN',
    payload: option,
  };
}
export function leaveScreen() {
  window.clearTimeout(refreshTimeout);

  return {
    type: 'LEAVE_SCREEN',
  };
}

export function reqeustFetchScreenData() {
  return {
    type: 'REQEUST_FETCH_SCREEN_DATA',
  };
}

export function reciveScreenData(data, name) {
  return {
    type: 'RECIVE_SCREEN_DATA',
    payload: data,
    meta: {
      name,
      updateAt: Date.now(),
    },
  };
}

export function fetchScreenData(url) {
  return (dispatch, getState) => {
    const globalState = getState();
    // const refreshTime = globalState.app.get('rateInterval');
    const name = globalState.screens.get('curScreenId');
    const formUrl = globalState.screens.getIn([name, 'formUrl']);
    const fetchUrl = globalState.screens.getIn([name, 'fetchUrl']) || formUrl;
    let query = globalState.screens.getIn([name, 'query']) || {};

    window.clearTimeout(refreshTimeout);
    dispatch(reqeustFetchScreenData());

    if (query && query.toJS) {
      query = query.toJS();
    }

    return dispatch(appActions.fetch(url || fetchUrl, query))
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          dispatch(reciveScreenData(json.data, name));
        }

        // if (refreshTime && refreshTime > 0) {
        //   refreshTimeout = window.setTimeout(() => {
        //     dispatch(fetchScreenData(formUrl));
        //   }, refreshTime);
        // }
      });
  };
}

// SCREEN LIST action
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
export function updateEditListItem(data, sync) {
  return {
    type: 'UPDATE_EDIT_LIST_ITEM',
    payload: data,
    meta: {
      sync,
    },
  };
}
export function updateListItemByIndex(index, data) {
  return {
    type: 'UPDATE_LIST_ITEM_BY_INDEX',
    payload: data,
    meta: {
      index,
    },
  };
}
export function editListItemByIndex(index, action) {
  return {
    type: 'EDIT_LIST_ITEM_BY_INDEX',
    payload: {
      index,
      action,
    },
  };
}

export function editListItemByKey(keyName, val) {
  return {
    type: 'EDIT_LIST_ITEM_BY_KEY',
    payload: {
      keyName,
      val,
    },
  };
}

export function addListItem(defaultItem) {
  return {
    type: 'ADD_LIST_ITEM',
    payload: defaultItem,
  };
}

export function selectListItem(payload) {
  return {
    type: 'SELECT_LIST_ITEM',
    payload,
  };
}

export function closeListItemModal() {
  return {
    type: 'CLOSE_LIST_ITEM_MODAL',
  };
}

export function onListAction(url) {
  return (dispatch, getState) => {
    const globalState = getState();
    const name = globalState.screens.get('curScreenId');
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
          dispatch(fetchScreenData(fetchUrl));
          ret = 'ok';
        }
        return ret;
      });
  };
}

/**
 * SCREEN SETTINGS action
 */
export function updateScreenSettings(payload) {
  return {
    type: 'UPDATE_SCREEN_SETTINGS',
    payload,
  };
}
export function saveScreenSettings(url) {
  return (dispatch, getState) => {
    const globalState = getState();
    const name = globalState.screens.get('curScreenId');
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
          dispatch(fetchScreenData(fetchUrl));
        }
      });
  };
}
