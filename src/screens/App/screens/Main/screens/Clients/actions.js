import utils from 'utils';
import * as appActions from 'actions/app';

const FETCH_URL = '/goform/getClientInfo';
const ACTION_URL = '/goform/setClientAction';
let refreshTimeout = null;

export function reqeustFetchClients() {
  return {
    type: 'REQEUST_FETCH_CLIENT'
  };
}

export function reciveFetchClients(data) {
  return {
    type: 'RECIVE_FETCH_CLIENTS',
    updateAt: Date.now(),
    data
  };
}

export function changeClientsQuery(query) {
  return {
    type: 'CHANGE_CLIENTS_QUERY',
    query
  };
}

export function rebootClient(mac) {
  return {
    type: 'REBOOT_CLIENT',
    id
  };
}

export function resetClient(mac) {
  return {
    type: 'RESET_CLIENT',
    id
  };
}

export function changeClientActionQuery(actionQuery) {
  return {
    type: 'CHANGE_CLIENT_ACTION_QUERY',
    actionQuery
  }
}

export function locateClient(mac) {
  return {
    type: 'LOCATE_CLIENT',
    id
  };
}

export function leaveClientsScreen() {
  window.clearTimeout(refreshTimeout);

  return {
    type: 'LEAVE_CLIENTS_SCREEN'
  };
}

export function fetchClients() {
  return (dispatch, getState) => {
    const refreshTime = getState().app.get('rateInterval');
    const query = getState().clients.get('query').toJS();

    window.clearTimeout(refreshTimeout);
    dispatch(reqeustFetchClients());

    dispatch(appActions.aFetch(FETCH_URL, query))
      .then(function(data) {
        if(data) {
          dispatch(reciveFetchClients(data))
        }

        if(refreshTime && refreshTime > 0) {
          refreshTimeout = window.setTimeout(function() {
            dispatch(fetchClients())
          }, refreshTime)
        }
      });
  };
}

export function saveClientsAction() {
  return (dispatch, getState) => {
    const query = getState().clients.get('actionQuery').toJS();

    dispatch(reqeustFetchClients());

    query.type = getState().clients.getIn(['query', 'type']);

    utils.save(ACTION_URL, query)
      .then(function(json) {
        if(json.state && json.state.code === 2000) {
          dispatch(fetchClients(5000))
        }
      });
  };
}

