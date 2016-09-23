export function changeRemainTime(data) {
  return {
    type: 'CHANGE_REMAIN_TIME',
    data,
  };
}

export function changePerChannelScanTime(data) {
  return {
    type: 'CHANGE_PER_CHANNEL_SCAN_TIME',
    data,
  };
}

export function changeChannelLen(data) {
  return {
    type: 'CHANGE_CHANNEL_LEN',
    data,
  };
}

export function changeUtiTableShowStatus(data) {
  return {
    type: 'CHANGE_UTI_TABLE_SHOW_STATUS',
    data,
  };
}
