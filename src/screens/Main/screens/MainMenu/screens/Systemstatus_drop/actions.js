import utils from 'shared/utils';
import { actions as appActions } from 'shared/containers/app';
import urls from 'shared/config/urls';


export function receiveSystemStatus(data) {
  return {
    type: 'RECEIVE_SYSTEM_STATUS',
    data,
  };
}

export function fetchSystemStatus() {
  return (dispatch, getState) => {
    dispatch(appActions.fetch(urls.fetchSystemStatus)).then((json) => {
      // console.log(json);
      dispatch(receiveSystemStatus(json.data));
    });
  };
}



