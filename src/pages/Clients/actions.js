import utils from 'utils';

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

export function rebootClient(id) {
  return {
    type: 'REBOOT_CLIENT',
    id
  };
}

export function resetClient(id) {
  return {
    type: 'RESET_CLIENT',
    id
  };
}

export function locateClient(id) {
  return {
    type: 'LOCATE_CLIENT',
    id
  };
}

export function fetchClients(url) {
  return (dispatch, getState) => {
    let query = getState().clients.get('query').toJS();

    dispatch(reqeustFetchClients());

    utils.fetch(url, query)
      .then(function(json) {
        if(json.state && json.state.code === 2000) {
          dispatch(reciveFetchClients(json.data))
        }
      });
  };
}

