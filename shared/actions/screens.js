import { immutableUtils } from 'shared/utils';
import * as appActions from 'shared/actions/app';
import ACTION_TYPE from 'shared/constants/action';

let refreshTimeout = null;

// Screen common actions
export function initScreen(option) {
  return {
    type: ACTION_TYPE.INIT_SCREEN,
    payload: option,
  };
}
export function leaveScreen() {
  window.clearTimeout(refreshTimeout);

  return {
    type: ACTION_TYPE.LEAVE_SCREEN,
  };
}
export function changeScreenQuery(payload) {
  return {
    type: ACTION_TYPE.CHANGE_SCREEN_QUERY,
    payload,
  };
}
export function changeScreenActionQuery(payload) {
  return {
    type: ACTION_TYPE.CHANGE_SCREEN_ACTION_QUERY,
    payload,
  };
}
export function updateScreenCustomProps(payload) {
  return {
    type: ACTION_TYPE.UPDATE_SCREEN_CUSTOM_PROPS,
    payload,
  };
}
export function reqeustFetchScreenData() {
  return {
    type: ACTION_TYPE.REQEUST_FETCH_SCREEN_DATA,
  };
}
export function reciveScreenData(data, name) {
  return {
    type: ACTION_TYPE.RECIVE_SCREEN_DATA,
    payload: data,
    meta: {
      name,
      updateAt: Date.now(),
    },
  };
}
export function fetchScreenData(option) {
  return (dispatch, getState) => {
    const globalState = getState();
    const refreshTime = globalState.app.get('rateInterval');
    const name = globalState.screens.get('curScreenId');
    const isFetchInfinite = globalState.screens.getIn([name, 'isFetchInfinite']);
    const formUrl = globalState.screens.getIn([name, 'formUrl']);
    const ajaxMode = globalState.screens.getIn([name, 'ajaxMode']);
    const fetchUrl = globalState.screens.getIn([name, 'fetchUrl']) || formUrl;
    const curFetchIntervalTime = globalState.screens.getIn([name, 'fetchIntervalTime']) || refreshTime;
    const ajaxOption = {
      mode: ajaxMode,
    };
    let myUrl = fetchUrl;
    let query = globalState.screens.getIn([name, 'query']) || {};

    window.clearTimeout(refreshTimeout);
    dispatch(reqeustFetchScreenData());

    if (query && query.toJS) {
      query = query.toJS();
    }

    if (option) {
      // 处理 ajax mode参数，是否跨域
      if (option.mode) {
        ajaxOption.mode = option.mode;
      }

      // 处理 ajax mode参数，是否跨域
      if (option.url) {
        myUrl = option.url;
      }
    }

    return dispatch(appActions.fetch(myUrl, query, ajaxOption))
      .then((json) => {
        if (json && json.state && json.state.code === 2000) {
          dispatch(reciveScreenData(json.data, name));
        } else {
          dispatch(reciveScreenData(null, name));
        }

        if (isFetchInfinite && curFetchIntervalTime > 0) {
          refreshTimeout = window.setTimeout(() => {
            dispatch(fetchScreenData());
          }, curFetchIntervalTime);
        }
      });
  };
}

// SCREEN list actions
export function updateCurEditListItem(data, sync) {
  return {
    type: ACTION_TYPE.UPDATE_CUR_EDIT_LIST_ITEM,
    payload: data,
    meta: {
      sync,
    },
  };
}
export function updateListItemByIndex(index, data) {
  return {
    type: ACTION_TYPE.UPDATE_LIST_ITEM_BY_INDEX,
    payload: data,
    meta: {
      index,
    },
  };
}
export function editListItemByIndex(index, action) {
  return {
    type: ACTION_TYPE.ACTIVE_LIST_ITEM,
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
    type: ACTION_TYPE.ACTIVE_LIST_ITEM,
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
    type: ACTION_TYPE.ADD_LIST_ITEM,
    payload: defaultItem,
  };
}
export function selectListItem(payload) {
  return {
    type: ACTION_TYPE.SELECT_LIST_ITEM,
    payload,
  };
}
export function closeListItemModal() {
  return {
    type: ACTION_TYPE.CLOSE_LIST_ITEM_MODAL,
  };
}
export function onListAction(option) {
  return (dispatch, getState) => {
    const globalState = getState();
    const name = globalState.screens.get('curScreenId');
    const editMap = globalState.screens.getIn([name, 'curListItem']);
    const formUrl = globalState.screens.getIn([name, 'formUrl']);
    const ajaxMode = globalState.screens.getIn([name, 'ajaxMode']);
    const saveUrl = globalState.screens.getIn([name, 'saveUrl']) || formUrl;
    const fetchUrl = globalState.screens.getIn([name, 'fetchUrl']) || formUrl;
    const actionQuery = globalState.screens.getIn([name, 'actionQuery']);
    const actionType = actionQuery.get('action');
    const needMerge = option && option.needMerge;
    const ajaxOption = {
      mode: ajaxMode,
    };
    let myUrl = saveUrl;
    let subData = actionQuery.toJS();
    let originalData = globalState.screens.getIn([name, 'data', 'list', actionQuery.get('index')]);

    if (originalData && originalData.get) {
      originalData = originalData.toJS();
    }

    window.clearTimeout(refreshTimeout);

    // 需要把修改后数据合并到post参数里
    if (actionType === 'add') {
      subData = actionQuery.merge(editMap).toJS();
      delete subData.selectedList;
    } else if (actionType === 'edit') {
      subData = actionQuery.merge(editMap).merge({
        originalData,
      }).toJS();
    } else if (needMerge) {
      subData = actionQuery.merge(editMap).toJS();
    }

    // 处理自定义配置
    if (option) {
      // 处理 ajax mode参数，是否跨域
      if (option.mode) {
        ajaxOption.mode = option.mode;
      }

      // 处理 ajax url参数，是否跨域
      if (option.url) {
        myUrl = option.url;
      }
    }

    // 删除不需要传到后台的属性属性
    delete subData.myTitle;
    delete subData.index;

    if (subData.groupid === 'not') {
      delete subData.groupid;
    }

    return dispatch(appActions.save(myUrl, subData, ajaxOption))
      .then((json) => {
        const ret = json;

        if (json && json.state) {
          if (json.state.code <= 6000) {
            dispatch(closeListItemModal());
          }
        }

        dispatch(fetchScreenData({
          url: fetchUrl,
        }));
        ret.subData = subData;

        return ret;
      });
  };
}

/**
 * SCREEN SETTINGS action
 */
export function updateScreenSettings(payload) {
  return {
    type: ACTION_TYPE.UPDATE_SCREEN_SETTINGS,
    payload,
  };
}
export function saveScreenSettings(option) {
  return (dispatch, getState) => {
    const globalState = getState();
    const name = globalState.screens.get('curScreenId');
    const $$curQuery = globalState.screens.getIn([name, 'query']);
    const $$actionQuery = globalState.screens.getIn([name, 'actionQuery']);
    const $$curData = globalState.screens.getIn([name, 'curSettings']);
    const $$oriData = globalState.screens.getIn([name, 'data', 'settings']);
    const formUrl = globalState.screens.getIn([name, 'formUrl']);
    const ajaxMode = globalState.screens.getIn([name, 'ajaxMode']);
    const fetchUrl = globalState.screens.getIn([name, 'fetchUrl']) || formUrl;
    const ajaxOption = {
      mode: ajaxMode,
    };
    let $$subData = $$curData;
    let saveUrl = formUrl;

    // 处理自定义配置
    if (option) {
      // 自定义URL
      if (option.url) {
        saveUrl = option.url;
      }

      // 只保存修改
      if (option.onlyChanged) {
        $$subData = immutableUtils.getChanged($$subData, $$oriData);

        // 如果没有改变的数据，就提交 actionQuery 数据
        if ($$subData.isEmpty()) {
          $$subData = $$actionQuery.delete('selectedList');
        }
      }
      // 数字类型转换
      if (option.numberKeys) {
        $$subData = immutableUtils.toNumberWithKeys($$subData, option.numberKeys);
      }

      // 自定义数据
      if (option.data) {
        $$subData = $$subData.merge(option.data);
      }

      // 处理 ajax mode参数，是否跨域
      if (option.mode) {
        ajaxOption.mode = option.mode;
      }
    }

    $$subData = $$subData.set('action', 'setting');

    if ($$curQuery.get('groupid') !== undefined) {
      $$subData = $$subData.set('groupid', $$curQuery.get('groupid'));
    }

    return dispatch(
      appActions.save(saveUrl, $$subData.toJS(), ajaxOption),
    )
      .then((json) => {
        const ret = json;

        dispatch(fetchScreenData({
          url: fetchUrl,
        }));
        ret.subData = $$subData.toJS();

        return ret;
      });
  };
}
