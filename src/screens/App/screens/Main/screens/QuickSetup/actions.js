export function changePage(data) {
  return {
    type: 'CHANGE_PAGE',
    data,
  };
}

export function changeDeviceMode(data) {
  return {
    type: 'CHANGE_DEVICE_MODE',
    data,
  };
}
