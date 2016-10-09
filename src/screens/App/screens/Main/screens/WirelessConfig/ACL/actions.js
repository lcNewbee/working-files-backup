

export function initMacstatus(len) {
  return {
    type: 'INIT_MAC_STATUS',
    len,
  };
}


export function updateMacStatus(index) {
  return {
    type: 'UPDATE_MAC_STATUS',
    index,
  };
}

export function changeMacInput(data) {
  return {
    type: 'CHANGE_MAC_INPUT',
    data,
  };
}

export function changePreLenInMacInput(data) {
  return {
    type: 'CHANGE_PRE_LEN_IN_MAC_INPUT',
    data,
  };
}

export function addMacToLocalList(data) {
  return {
    type: 'ADD_MAC_TO_LOCAL_LIST',
    data,
  };
}

export function changeSelectedSsid(data) {
  return {
    type: 'CHANGE_SELECTED_SSID',
    data,
    // {selectedSsid: 0,选择的SSID对应的value值
    //   macListLen: 4  该SSID的过滤列表长度
    // }
  };
}

