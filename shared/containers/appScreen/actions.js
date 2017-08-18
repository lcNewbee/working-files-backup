import utils, { immutableUtils } from 'shared/utils';
import { actions as appActions } from '../app';
import ACTION_TYPES from './actionTypes';

let refreshTimeout = null;

// Screen common actions
export function addScreen(screenId, route) {
  return {
    type: ACTION_TYPES.ADD,
    payload: {
      id: screenId,
      route,
    },
  };
}
export function initScreen(option) {
  return {
    type: ACTION_TYPES.INIT,
    payload: option,
  };
}
export function updateScreen(option) {
  return {
    type: ACTION_TYPES.UPDATE,
    payload: option,
  };
}
export function leaveScreen(screenId) {
  window.clearTimeout(refreshTimeout);

  return {
    type: ACTION_TYPES.LEAVE,
    meta: {
      name: screenId,
    },
  };
}
export function changeScreenQuery(payload) {
  return {
    type: ACTION_TYPES.CHANGE_QUERY,
    payload,
  };
}
export function changeScreenActionQuery(payload) {
  return {
    type: ACTION_TYPES.CHANGE_ACTION_QUERY,
    payload,
  };
}
export function changeScreenSaveStatus(payload) {
  return {
    type: ACTION_TYPES.CHANGE_SAVE_STATUS,
    payload,
  };
}
export function updateScreenCustomProps(payload) {
  return {
    type: ACTION_TYPES.UPDATE_CUSTOM_PROPS,
    payload,
  };
}
export function requestFetchScreenData() {
  return {
    type: ACTION_TYPES.REQUEST_FETCH_DATA,
  };
}
export function receiveScreenData(data, name) {
  return {
    type: ACTION_TYPES.RECEIVE_DATA,
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
    let query = globalState.screens.getIn([name, 'query']) || globalState.screens.clear();

    window.clearTimeout(refreshTimeout);
    dispatch(requestFetchScreenData());

    if (query && query.toJS) {
      query = query.toJS();
    }

    if (option) {
      // 处理 ajax mode参数，是否跨域
      if (option.mode) {
        ajaxOption.mode = option.mode;
      }

      // 处理 自定义 URL
      if (option.url) {
        myUrl = option.url;
      }

      // 处理完全自定义查询参数 query
      if (option.query) {
        query = option.query;
      }
    }

    // 如果 Url 路径不存在，返回空 Promise
    if (!myUrl) {
      return new Promise((resolve) => {
        resolve('Fetch url is need');
      });
    }

    return dispatch(appActions.fetch(myUrl, query, ajaxOption))
      .then((json) => {
        const curPage = json && json.data && json.data.page;

        if (json && json.state && json.state.code === 2000) {
          // 如果请求的页码大于返回数据的总页数，请求最后页
          if (curPage && curPage.totalPage < query.page) {
            dispatch(changeScreenQuery({
              page: curPage.totalPage,
            }));
            dispatch(fetchScreenData());

          // 正常接收数据
          } else {
            dispatch(receiveScreenData(json.data, name));
          }
        } else {
          dispatch(receiveScreenData(null, name));
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
export function updateCurListItem(data, sync) {
  return {
    type: ACTION_TYPES.UPDATE_CUR_EDIT_LIST_ITEM,
    payload: data,
    meta: {
      sync,
    },
  };
}
export function updateListItemByIndex(index, data) {
  return {
    type: ACTION_TYPES.UPDATE_LIST_ITEM_BY_INDEX,
    payload: data,
    meta: {
      index,
    },
  };
}
export function activeListItemByIndex(payload, meta) {
  return {
    type: ACTION_TYPES.ACTIVE_LIST_ITEM,
    payload: utils.extend({}, payload, {
      keyName: '__index__',
    }),
    meta,
  };
}
export function activeListItemByKeyValue(payload, meta) {
  return {
    type: ACTION_TYPES.ACTIVE_LIST_ITEM,
    payload,
    meta,
  };
}
export function addListItem(defaultItem, listKeyMap) {
  return {
    type: ACTION_TYPES.ADD_LIST_ITEM,
    payload: defaultItem,
    meta: listKeyMap,
  };
}
export function selectListItem(payload, meta) {
  return {
    type: ACTION_TYPES.SELECT_LIST_ITEM,
    payload,
    meta,
  };
}
export function closeListItemModal() {
  return {
    type: ACTION_TYPES.CLOSE_LIST_ITEM_MODAL,
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
    let $$actionQuery = globalState.screens.getIn([name, 'actionQuery']);
    const actionType = $$actionQuery.get('action');
    const needMerge = option && option.needMerge;
    const ajaxOption = {
      mode: ajaxMode,
    };
    let myUrl = saveUrl;
    let subData = null;
    let originalData = globalState.screens.getIn([name, 'data', 'list', $$actionQuery.get('index')]);

    if (originalData && originalData.get) {
      originalData = originalData.toJS();
    }

    window.clearTimeout(refreshTimeout);

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

      // 处理自定义数据
      if (option.customData) {
        $$actionQuery = $$actionQuery.merge(option.customData);
      }
    }

    // 需要把修改后数据合并到post参数里
    if (actionType === 'add') {
      subData = $$actionQuery.merge(editMap).toJS();
      delete subData.selectedList;
    } else if (actionType === 'edit' || actionType === '__edit__') {
      subData = $$actionQuery.merge(editMap).merge({
        originalData,
      }).toJS();
      subData.action = 'edit';
    } else if (needMerge) {
      subData = $$actionQuery.merge(editMap).toJS();
    } else {
      subData = $$actionQuery.toJS();
    }

    // 删除不需要传到后台的属性属性
    delete subData.myTitle;
    delete subData.index;

    if (subData.groupid === 'not') {
      delete subData.groupid;
    }

    // 如果 Url 路径不存在，返回空 Promise
    if (!myUrl) {
      return new Promise((resolve) => {
        resolve('List action url is need');
      });
    }

    dispatch(changeScreenSaveStatus(true));
    return dispatch(appActions.save(myUrl, subData, ajaxOption))
      .then((json) => {
        const ret = json;

        dispatch(changeScreenSaveStatus(false));
        if (json && json.state) {
          if (json.state.code <= 6000) {
            dispatch(closeListItemModal());
          }
        }

        dispatch(fetchScreenData({
          url: fetchUrl,
        }));

        if (ret) {
          ret.subData = subData;
        }
        return ret;
      });
  };
}

/**
 * SCREEN SETTINGS action
 */
export function updateScreenSettings(payload, meta) {
  return {
    type: ACTION_TYPES.UPDATE_SETTINGS,
    payload,
    meta,
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

        // 一直会下发的参数列表
        if (Array.isArray(option.alwaySaveKeys)) {
          option.alwaySaveKeys.forEach((key) => {
            $$subData = $$subData.set(key, $$curData.get(key));
          });
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

    // 如果 Url 路径不存在，返回空 Promise
    if (!saveUrl) {
      return new Promise((resolve) => {
        resolve('Settings url is need');
      });
    }

    dispatch(changeScreenSaveStatus(true));
    return dispatch(
      appActions.save(saveUrl, $$subData.toJS(), ajaxOption),
    )
      .then((json) => {
        const ret = json;

        dispatch(changeScreenSaveStatus(false));
        dispatch(fetchScreenData({
          url: fetchUrl,
        }));

        if (ret) {
          ret.subData = $$subData.toJS();
        }

        return ret;
      });
  };
}
