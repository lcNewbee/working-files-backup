import urls from 'shared/config/urls_axc';
import * as appActions from 'shared/actions/app';

let refreshTimeout = null;

export function reqeustFetchClients() {
  return {
    type: 'REQEUST_FETCH_CLIENT',
  };
}

export function reciveFetchClients(data) {
  return {
    type: 'RECIVE_FETCH_CLIENTS',
    updateAt: Date.now(),
    data,
  };
}

export function changeClientsQuery(query) {
  return {
    type: 'CHANGE_CLIENTS_QUERY',
    query,
  };
}

export function changeClientActionQuery(actionQuery) {
  return {
    type: 'CHANGE_CLIENT_ACTION_QUERY',
    actionQuery,
  };
}

export function leaveClientsScreen() {
  window.clearTimeout(refreshTimeout);

  return {
    type: 'LEAVE_CLIENTS_SCREEN',
  };
}

export function fetchClients() {
  return (dispatch, getState) => {
    const refreshTime = getState().app.get('rateInterval');
    const query = getState().users.get('query').toJS();

    window.clearTimeout(refreshTimeout);
    dispatch(reqeustFetchClients());

    dispatch(appActions.fetch(urls.fetchClientInfo, query))
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          dispatch(reciveFetchClients(json.data));
        }

        if (refreshTime && refreshTime > 0) {
          refreshTimeout = window.setTimeout(() => {
            dispatch(fetchClients());
          }, refreshTime);
        }
      });
  };
}

export function saveClientsAction() {
  return (dispatch, getState) => {
    const query = getState().users.get('actionQuery').toJS();

    dispatch(reqeustFetchClients());
    query.type = getState().users.getIn(['query', 'type']);

    dispatch(appActions.save(urls.setClientAction, query))
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          dispatch(fetchClients(5000));
        }
      });
  };
}

