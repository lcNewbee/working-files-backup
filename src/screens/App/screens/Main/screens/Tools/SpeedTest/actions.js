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

export function changeChartData(data) {
  return {
    type: 'CHANGE_CHART_DATA',
    data,
  };
}

export function clickSpeedTestRunBtn() {
  return (dispatch, getState) => {
    const showAdvance = getState().speedtest.get('showAdvance');
    let query = getState().settings.get('curData');
    if (showAdvance === '1') {
      query = query.toJS();
    }
    let n = 0;
    const a = window.setInterval(() => {
      if (n < query.time * 2) {
        dispatch(appActions.save('goform/bandwidth_test', query))
            .then((json) => {
              if (json.state && json.state.code === 2000) {
                const txdata = json.data.tx === '' ? 0 : json.data.tx;
                const rxdata = json.data.tx === '' ? 0 : json.data.rx;
                const totaldata = json.data.total === '' ? 0 : json.data.total;
                dispatch(changeChartData({
                  txdata,
                  rxdata,
                  totaldata,
                }));
              } else if (json.state && json.state.code === 4000) {
                window.alert(json.state.msg);
                window.clearInterval(a);
              }
            });
        n++;
      } else {
        window.clearInterval(a);
      }
    }, 500);
  };
}
