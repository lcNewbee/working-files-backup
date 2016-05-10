import utils from 'utils';

const FETCH_URL = '/goform/getClientInfo';
const ACTION_URL = '/goform/setClientAction';

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

export function fetchClients() {
  return (dispatch, getState) => {
    const query = getState().clients.get('query').toJS();

    dispatch(reqeustFetchClients());

    utils.fetch(FETCH_URL, query)
      .then(function(json) {
        if(json.state && json.state.code === 2000) {
          dispatch(reciveFetchClients(json.data))
        }
      });
  };
}

export function saveClientsAction() {
  return (dispatch, getState) => {
    const query = getState().clients.get('actionQuery').toJS();

    dispatch(reqeustFetchClients());
    
    utils.save(ACTION_URL, query)
      .then(function(json) {
        if(json.state && json.state.code === 2000) {
          dispatch(fetchClients(json.data))
        }
      });
  };
}

