import * as appActions from 'shared/actions/app';
import urls from 'shared/config/urls';


export function receiveSystemStatus(data) {
  return {
    type: 'RECEIVE_SYSTEM_STATUS',
    data,
  };
}

export function kickUser(mac){
}

export function fetchSystemStatus() {
  return dispatch => {
    dispatch(appActions.fetch(urls.fetchSystemStatus))
            .then((json) => {
              if (json.state && json.state.code === 2000) {
                console.log(json.data);
                dispatch(receiveSystemStatus(json.data));
              }
            });
  };
}

