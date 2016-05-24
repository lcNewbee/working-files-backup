import { fromJS, Map } from 'immutable';

const defaultState = fromJS({
  fetching: false,
  data: {
    list: [],
  },
  query: {
    devicetype: '0',
    size: 20,
    page: 1
  },
});

function getEditObjByMac(state, mac) {
  return state.getIn(['data', 'list']).find(function(item) {
    return item.get('mac') == groupname;
  }).set('devices', devices)
}

export default function (state = defaultState, action) {
  switch (action.type) {
    case 'CHANGE_DEVICES_QUERY':
      return state.mergeIn(['query'], action.query);
      
    case 'REQEUST_FETCH_DEVICE':
      return state.set('fetching', true);

    case 'RECIVE_FETCH_DEVICES':
      return state.set('fetching', false)
        .set('updateAt', action.updateAt)
        .mergeIn(['data'], action.data);
        
    case 'REQEUST_FETCH_DEVICE_NETWORK':
      return state.set('edit', Map({
        mac: action.mac
      })).set('fetching', true);
      
    case 'RECIVE_FETCH_DEVICE_NETWORK':
      return state.set('fetching', false)
        .set('updateAt', action.updateAt)
        .mergeIn(['edit'], action.data);
        
    case 'CLOSE_DEVICE_EDIT':
      return state.delete('edit');
    
    case 'CHANGE_DEVICE_NETWORK':
      return state.mergeIn(['edit'], action.data);
      
    default:

  }
  return state;
}
