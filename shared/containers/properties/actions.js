import { actions as appActions } from 'shared/containers/app';
import ACTION_TYPES from './actionTypes';

export function togglePropertyContainer(isShow) {
  return {
    type: ACTION_TYPES.TOGGLE_VISIBLE,
    payload: isShow,
  };
}

export function collapsePropertyPanel(index) {
  return {
    type: ACTION_TYPES.COLLAPSE_PANEL,
    index,
  };
}

export function changePropertyPanelItem(item) {
  return {
    type: ACTION_TYPES.CHANGE_PANEL_ITEM,
    payload: item,
  };
}

export function initPropertyPanel(query, info) {
  return {
    type: ACTION_TYPES.INIT_PANEL,
    payload: {
      query,
      info,
    },
  };
}
export function rcPropertyPanelData(mac, data) {
  return {
    type: ACTION_TYPES.RC_PANEL_DATA,
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
    type: ACTION_TYPES.CHANGE_PANEL_DATA,
    data,
  };
}

export function removePropertyPanel(index) {
  return {
    type: ACTION_TYPES.REMOVE_PANEL,
    index,
  };
}
