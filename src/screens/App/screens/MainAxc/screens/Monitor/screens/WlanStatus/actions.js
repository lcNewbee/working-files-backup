import utils from 'shared/utils';
import * as appActions from 'shared/actions/app';
import urls from 'shared/config/urls_axc';

let refreshTimeout = null;

export function reqeustFetchFlow() {
  return {
    type: 'REQEUST_FETCH_FlOW'
  };
}

export function reciveFetchFlow(data) {
  return {
    type: 'RECIVE_FETCH_FlOW',
    updateAt: Date.now(),
    data
  };
}

export function changeFlowQuery(query) {
  return {
    type: 'CHANGE_FlOW_QUERY',
    query
  };
}

export function rebootClient(mac) {
  return {
    type: 'REBOOT_FlOW',
    id
  };
}

export function resetClient(mac) {
  return {
    type: 'RESET_FlOW',
    id
  };
}

export function changeClientActionQuery(actionQuery) {
  return {
    type: 'CHANGE_FlOW_ACTION_QUERY',
    actionQuery
  }
}

export function locateClient(mac) {
  return {
    type: 'LOCATE_FlOW',
    id
  };
}

export function leaveFlowScreen() {
  window.clearTimeout(refreshTimeout);

  return {
    type: 'LEAVE_FlOW_SCREEN'
  };
}

export function fetchFlow() {
  return (dispatch, getState) => {
    const refreshTime = getState().app.get('rateInterval');
    const query = getState().clients.get('query').toJS();

    window.clearTimeout(refreshTimeout);
    dispatch(reqeustFetchFlow());

    dispatch(appActions.fetch(urls.fetchClientInfo, query))
      .then(function(json) {
        if(json.state && json.state.code === 2000) {
          dispatch(reciveFetchFlow(json.data))
        }

        if(refreshTime && refreshTime > 0) {
          refreshTimeout = window.setTimeout(function() {
            dispatch(fetchFlow())
          }, refreshTime)
        }
      });
  };
}

export function saveFlowAction() {
  return (dispatch, getState) => {
    const query = getState().clients.get('actionQuery').toJS();

    dispatch(reqeustFetchFlow());

    query.type = getState().clients.getIn(['query', 'type']);

    dispatch(appActions.save(urls.setClientAction, query))
      .then(function(json) {
        if(json.state && json.state.code === 2000) {
          dispatch(fetchFlow(5000))
        }
      });
  };
}

