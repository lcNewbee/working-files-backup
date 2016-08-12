import * as appActions from 'shared/actions/app';
import urls from 'shared/config/urls_axc';

let refreshTimeout = null;

export function reqeustFetchFlow() {
  return {
    type: 'REQEUST_FETCH_FlOW',
  };
}

export function reciveFetchFlow(data) {
  return {
    type: 'RECIVE_FETCH_FlOW',
    updateAt: Date.now(),
    data,
  };
}

export function changeFlowQuery(query) {
  return {
    type: 'CHANGE_FlOW_QUERY',
    query,
  };
}

export function leaveFlowScreen() {
  window.clearTimeout(refreshTimeout);

  return {
    type: 'LEAVE_FlOW_SCREEN',
  };
}

export function fetchFlow() {
  return (dispatch, getState) => {
    const refreshTime = getState().app.get('rateInterval');
    const query = getState().flow.get('query').toJS();

    window.clearTimeout(refreshTimeout);
    dispatch(reqeustFetchFlow());

    dispatch(appActions.fetch(urls.getFlowList, query))
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          dispatch(reciveFetchFlow(json.data));
        }

        if (refreshTime && refreshTime > 0) {
          refreshTimeout = window.setTimeout(() => {
            dispatch(fetchFlow());
          }, refreshTime);
        }
      });
  };
}

