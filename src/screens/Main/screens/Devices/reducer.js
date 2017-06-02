import { fromJS, Map } from 'immutable';
import immutableUtils from 'shared/utils/lib/immutable';

const defaultState = fromJS({
  fetching: false,
  data: {
    list: [],
  },
  query: {
    devicetype: '0',
    size: 20,
    page: 1,
  },
  actionQuery: {
    selectedList: [],
  },
});

function getEditObjByMac(state, mac) {
  return state.getIn(['data', 'list']).find(function(item) {
    return item.get('mac') == mac;
  }).set('devices', devices)
}
function selectRow(state, action) {
  const selectObject = immutableUtils.selectList(
    state.getIn(['data', 'list']),
    action.payload,
    state.getIn(['actionQuery', 'selectedList']),
  );

  return state.setIn(['data', 'list'], selectObject.$$list)
    .setIn(['actionQuery', 'selectedList'], selectObject.selectedList);
}

export default function (state = defaultState, action) {
  switch (action.type) {
    case 'CHANGE_DEVICES_QUERY':
      return state.mergeIn(['query'], action.query);

    case 'REQEUST_FETCH_DEVICE':
      return state.set('fetching', true);

    case 'SELECT_ROW':
      return selectRow(state, action);

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
        .mergeIn(['edit'], action.data)
        .mergeIn(['oriEdit'], action.data);

    case 'CLOSE_DEVICE_EDIT':
      return state.delete('edit');

    case 'CHANGE_DEVICE_NETWORK':
      return state.mergeIn(['edit'], action.data);

    case 'LEAVE_DEVICES_SCREEN':
      return state.mergeIn(['query'], {
        search: ''
      });

    default:

  }
  return state;
}
