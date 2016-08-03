import { fromJS } from 'immutable';

const defaultState = fromJS({
  edit: {},
  actionType: 'add',
  query: {
    size: 20,
    page: 1
  },
  data: {
    page: {

    },
    list: []
  }
});

function selectedListItem(list, data) {
  let ret = list;

  if(data.index !== -1) {
    ret = ret.setIn([data.index, 'selected'], data.selected);
  } else {
    ret = ret.map(function(item) {
      return item.set('selected', data.selected);
    });
  }

  return ret;
}

export default function (state = defaultState, action) {
  switch (action.type) {
    case 'RQ_FETCH_DHCP_ADDRESS_POOL_LIST':
      return state.set('fetching', true);

    case 'RC_FETCH_DHCP_ADDRESS_POOL_LIST':
      return state.set('fetching', false)
        .set('updateAt', action.updateAt)
        .mergeIn(['data'], action.data);

    case 'CLOSE_DHCP_ADDRESS_POOL_EDIT':
      return state.set('edit', fromJS({}));

    case 'ADD_DHCP_ADDRESS_POOL':
      return state.set('edit', fromJS({
        type: 'ipv4',
      }));

    case 'EDIT_DHCP_ADDRESS_POOL':
      return state.set('edit', state.getIn(['data', 'list']).find(function(item) {
        return item.get('name') === action.id
      }) || fromJS({}));

    case 'UPDATE_DHCP_ADDRESS_POOL_EDIT':
      return state.mergeIn(['edit'], action.data);

    case 'SELECT_DHCP_ADDRESS_POOL':
      return state.setIn(['data', 'list'],
          selectedListItem(state.getIn(['data', 'list']), action.data));

    default:
  }
  return state;
}
