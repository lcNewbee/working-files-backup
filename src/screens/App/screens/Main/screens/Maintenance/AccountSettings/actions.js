export function showValidMsg(show, msg) {
  return {
    type: 'SHOW_VALID_MSG',
    show,
    msg,
  };
}
