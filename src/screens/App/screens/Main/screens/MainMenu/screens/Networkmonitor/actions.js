import * as appActions from 'shared/actions/app';
import urls from 'shared/config/urls';


export function receiveMonitorInfo(data) {
  return {
    type: 'RECEIVE_MONITOR_INFO',
    data,
  };
}


export function fetchMonitorStatus() {
  return (dispatch, getState) => {
    // console.log('in action');
    dispatch(appActions.fetch(urls.fetchMonitorStatus)).then((json) => {
      console.log(json);
      dispatch(receiveMonitorInfo(json));
    });
  };
}

