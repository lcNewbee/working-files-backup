export function changeTimeZone(data) {
  return {
    type: 'CHANGE_TIME_ZONE',
    data,
  };
}

export function restoreSelfState() {
  return {
    type: 'RESTORE_SELF_STATE',
  };
}
