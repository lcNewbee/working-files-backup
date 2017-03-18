export function showUserPop(isShow) {
  return {
    type: 'SHOW_USER_POP',
    isShow,
  };
}

export function setDeviceRadioList(data) {
  return {
    type: 'SET_DEVICE_RADIO_LIST',
    data,
  };
}

export function setRadioSelectOptions(data) {
  return {
    type: 'SET_RADIO_SELECT_OPTIONS',
    data,
  };
}

export function changeMenus(data) {
  return {
    type: 'CHANGE_MENUS',
    data,
  };
}
