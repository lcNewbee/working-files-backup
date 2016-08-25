
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

