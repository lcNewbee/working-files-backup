

const defaultState = {
  bandwidth: '512',
  rX: '1000',
  tX: '1000',
  total: '1024',
};

export default function (state = defaultState, action) {
  switch (action.type) {
    case 'TOGGLE_SHOW_ADVANCE_BTN':
      return
    case 'CLICK_SPEED_TEST_RUN_BTN':
      return;
    default:
  }
  return state;
}
