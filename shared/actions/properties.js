import * as appActions from 'shared/actions/app';
import {
  TOGGLE_PROPERTY,
  INIT_PROPERTY_PANEL,
  COLLAPSE_PROPERTY_PANEL,
  REMOVE_PROPERTY_PANEL,

  // 操作属性面板内容
  CHANGE_PROPERTY_PANEL_ITEM,

  // 接收属性面板数据 Data
  RC_PROPERTY_PANEL_DATA,

  // 更新属性面板数据
  CHANGE_PROPERTY_PANEL_DATA,
} from 'shared/constants/action';

export function togglePropertyContainer(isShow) {
  return {
    type: TOGGLE_PROPERTY,
    payload: isShow,
  };
}

export function collapsePropertyPanel(index) {
  return {
    type: COLLAPSE_PROPERTY_PANEL,
    index,
  };
}

export function changePropertyPanelItem(item) {
  return {
    type: CHANGE_PROPERTY_PANEL_ITEM,
    payload: item,
  };
}

export function initPropertyPanel(query, info) {
  return {
    type: INIT_PROPERTY_PANEL,
    payload: {
      query,
      info,
    },
  };
}
export function rcPropertyPanelData(mac, data) {
  return {
    type: RC_PROPERTY_PANEL_DATA,
    payload: {
      mac,
      data,
    },
  };
}
export function fetchPropertyPanelData(query) {
  return (dispatch) => {
    const mac = query.mac;
    dispatch(appActions.fetch('goform/group/ap', query))
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          dispatch(rcPropertyPanelData(mac, json.data));
        }
      });
  };
}

export function addPropertyPanel(query, info) {
  return (dispatch) => {
    dispatch(initPropertyPanel(query, info));
    dispatch(fetchPropertyPanelData(query));
  };
}

export function changePropertyPanelData(data) {
  return {
    type: CHANGE_PROPERTY_PANEL_DATA,
    data,
  };
}

export function removePropertyPanel(index) {
  return {
    type: REMOVE_PROPERTY_PANEL,
    index,
  };
}
