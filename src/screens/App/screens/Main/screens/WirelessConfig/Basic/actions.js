
export function changeScanStatus(data) {
  return {
    type: 'CHANGE_SCAN_STATUS',
    data,
  };
}

export function changeShowScanResultStatus(data) {
  return {
    type: 'CHANGE_SHOW_SCAN_RESULT_STATUS',
    data,
  };
}

export function setScanResult(data) {
  return {
    type: 'SET_SCAN_RESULT',
    data,
  };
}

export function changeSelectedResult(data) {
  return {
    type: 'CHANGE_SELECTED_RESULT',
    data,
  };
}

export function leaveScreen() {
  return {
    type: 'LEAVE_SCREEN',
  };
}
