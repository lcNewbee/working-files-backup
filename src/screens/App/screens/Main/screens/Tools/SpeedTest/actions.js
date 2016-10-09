import urls from 'shared/config/urls';
import * as appActions from 'shared/actions/app';
import * as settingActions from 'shared/actions/settings';

export function toggleShowAdvanceBtn() {
  return {
    type: 'TOGGLE_SHOW_ADVANCE_BTN',
  };
}

export function toggleShowResultBtn(data) {
  return {
    type: 'TOGGLE_SHOW_RESULT_BTN',
    data,
  };
}

export function initSelfState() {
  return {
    type: 'INIT_SELF_STATE',
  };
}

export function receiveTestResult(data) {
  return {
    type: 'RECEIVE_TEST_RESULT',
    data,
  };
}

export function changeShowScanResults(data) {
  return {
    type: 'CHANGE_SHOW_SCAN_RESULTS',
    data,
  };
}

export function changeSelectedIp(data) {
  return {
    type: 'CHANGE_SELECTED_IP',
    data,
  };
}

export function changeTimeClock(data) {
  return {
    type: 'CHANGE_TIME_CLOCK',
    data,
  };
}

export function clickSpeedTestRunBtn() {
  return (dispatch, getState) => {
    const showAdvance = getState().speedtest.get('showAdvance');
    let query = getState().settings.get('curData');
    if (showAdvance === '1') {
      query = query.toJS();
    } else {
      query = query.delete('direction').delete('time').toJS();
    }

    dispatch(appActions.save('goform/bandwidth_test', query))
            .then((json) => {
              if (json.state && json.state.code === 2000) {
                dispatch(receiveTestResult(json.data));
                // dispatch(toggleShowResultBtn());
              }
            });
  };
}
