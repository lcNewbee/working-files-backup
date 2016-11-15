import * as appActions from './app';

let refreshTimeout = null;

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
export function changeScreenQuery(payload) {
  return {
    type: 'CHANGE_SCREEN_QUERY',
    payload,
  };
}
export function changeScreenActionQuery(payload) {
  return {
    type: 'CHANGE_SCREEN_ACTION_QUERY',
    payload,
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
    const refreshTime = globalState.app.get('rateInterval');
    const name = globalState.screens.get('curScreenId');
    const isFetchInfinite = globalState.screens.getIn([name, 'isFetchInfinite']);
    const formUrl = globalState.screens.getIn([name, 'formUrl']);
    const fetchUrl = globalState.screens.getIn([name, 'fetchUrl']) || formUrl;
    const curFetchIntervalTime = globalState.screens.getIn([name, 'fetchIntervalTime']) || refreshTime;
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

        if (isFetchInfinite && curFetchIntervalTime > 0) {
          refreshTimeout = window.setTimeout(() => {
            dispatch(fetchScreenData(formUrl));
          }, refreshTime);
        }
      });
  };
}

// SCREEN list actions
export function updateCurEditListItem(data, sync) {
  return {
    type: 'UPDATE_CUR_EDIT_LIST_ITEM',
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
    type: 'ACTIVE_LIST_ITEM',
    payload: {
      keyName: 'index',
      val: index,
    },
    meta: {
      action,
    },
  };
}
export function activeListItem(keyName, val, action) {
  return {
    type: 'ACTIVE_LIST_ITEM',
    payload: {
      keyName,
      val,
    },
    meta: {
      action,
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
    const editMap = globalState.screens.getIn([name, 'curListItem']);
    const formUrl = globalState.screens.getIn([name, 'formUrl']);
    const saveUrl = globalState.screens.getIn([name, 'saveUrl']) || formUrl;
    const fetchUrl = globalState.screens.getIn([name, 'fetchUrl']) || formUrl;
    const actionQuery = globalState.screens.getIn([name, 'actionQuery']);
    const actionType = actionQuery.get('action');
    let subData = actionQuery.toJS();
    let originalData = globalState.screens.getIn([name, 'data', 'list', actionQuery.get('index')]);

    if (originalData && originalData.get) {
      originalData = originalData.toJS();
    }

    window.clearTimeout(refreshTimeout);

    // 需要把修改后数据合并到post参数里
    if (actionType === 'add') {
      subData = actionQuery.merge(editMap).toJS();
    } else if (actionType === 'edit') {
      subData = actionQuery.merge(editMap).merge({
        originalData,
      }).toJS();
    }

    // 删除不需要传到后台的属性属性
    delete subData.myTitle;
    delete subData.index;

    return dispatch(appActions.save(url || saveUrl, subData))
      .then((json) => {
        let ret = 'Server Error';

        if (json.state && json.state.code === 2000) {
          // dispatch(fetchScreenData(fetchUrl));
          ret = 'ok';
        }
        dispatch(fetchScreenData(fetchUrl));
        dispatch(closeListItemModal());
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
    const subData = curData.toJS();

    if (!curData.equals(oriData)) {
      console.log('hasChange');
    }

    subData.action = 'setting';
    return dispatch(appActions.save(url || formUrl, subData))
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          dispatch(fetchScreenData(fetchUrl));
        }
      });
  };
}
