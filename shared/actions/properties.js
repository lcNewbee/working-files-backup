import * as appActions from 'shared/actions/app';

export function togglePropertyPanel() {
  return {
    type: 'TOGGLE_PROPERTY_PANEL',
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
    item,
  };
}

export function addToPropertyPanel(option) {
  return {
    type: 'ADD_TO_PROPERTY_PANEL',
    option,
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
