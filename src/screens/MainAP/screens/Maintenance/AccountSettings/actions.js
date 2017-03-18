export function showValidMsg(show, msg) {
  return {
    type: 'SHOW_VALID_MSG',
    show,
    msg,
  };
}

export function restoreSelfState() {
  return {
    type: 'RESTORE_SELF_STATE',
  };
}
