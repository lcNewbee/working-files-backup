import * as appActions from 'shared/actions/app';

export function togglePropertyPanel(isShow) {
  return {
    type: 'TOGGLE_PROPERTY_PANEL',
    payload: isShow,
  };
}

export function collapsePropertys(index) {
  return {
    type: 'COLLAPSE_PROPERTYS',
    index,
  };
}

export function changePropertysItem(item) {
  return {
    type: 'CHANGE_PROPERTYS_ITEM',
    payload: item,
  };
}

export function initAddPropertyPanel(query, info) {
  return {
    type: 'INIT_ADD_PROPERTY_PANEL',
    payload: {
      query,
      info,
    },
  };
}
export function rcPropertyPanelData(mac, data) {
  return {
    type: 'RC_PROPERTY_PANEL_DATA',
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
export function addToPropertyPanel(query, info) {
  return (dispatch) => {
    dispatch(initAddPropertyPanel(query, info));
    dispatch(fetchPropertyPanelData(query));
  };
}


export function removeFromPropertyPanel(index) {
  return {
    type: 'REMOVE_FROM_PROPERTY_PANEL',
    index,
  };
}

export function updatePropertyPanelData(data) {
  return {
    type: 'UPDATE_PROPERTY_PANEL_DATA',
    data,
  };
}
