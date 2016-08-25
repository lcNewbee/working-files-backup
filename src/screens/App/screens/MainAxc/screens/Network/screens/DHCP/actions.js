import utils from 'shared/utils';
import * as appActions from 'shared/actions/app';
import urls from 'shared/config/urls_axc';

let refreshTimeout = null;

export function closeDhcpAddressPoolEdit() {
  return {
    type: 'CLOSE_DHCP_ADDRESS_POOL_EDIT'
  }
}

export function addDhcpAddressPool() {
  return {
    type: 'ADD_DHCP_ADDRESS_POOL'
  };
}

export function editDhcpAddressPool(id) {
  return {
    type: 'EDIT_DHCP_ADDRESS_POOL',
    id
  }
}

export function updateDhcpAddressPoolEdit(data) {
  return {
    type: 'UPDATE_DHCP_ADDRESS_POOL_EDIT',
    data
  };
}

export function selectDhcpAddressPool(data) {
  return {
    type: 'SELECT_DHCP_ADDRESS_POOL',
    data
  };
}

export function rqFetchDhcpAddressPoolList(data) {
  return {
    type: 'RQ_FETCH_DHCP_ADDRESS_POOL_LIST',
    data
  }
}
export function rcFetchDhcpAddressPoolList(data) {
  return {
    type: 'RC_FETCH_DHCP_ADDRESS_POOL_LIST',
    data
  }
}

export function fetchDhcpAddressPoolList() {
  return (dispatch, getState) => {
    const refreshTime = getState().app.get('rateInterval');
    const query = getState().dhcpAdressPool.get('query').toJS();

    window.clearTimeout(refreshTimeout);
    dispatch(rqFetchDhcpAddressPoolList());

    dispatch(appActions.fetch(urls.fetchDhcpAddressPoolList, query))
      .then(function(json) {
        if(json.state && json.state.code === 2000) {
          dispatch(rcFetchDhcpAddressPoolList(json.data))
        }

        if(refreshTime && refreshTime > 0) {
          refreshTimeout = window.setTimeout(function() {
            //dispatch(fetchDhcpAddressPoolList())
          }, refreshTime)
        }
      });
  };
}
