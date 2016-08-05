import { fromJS } from 'immutable';

const defaultState = fromJS({
  list: [
    {
      id: 1,
      status: 'on',
      arpProxy: 'off',
      mainIp: '192.168.0.1',
      mainMask: '192.168.0.1',
      secondIp: '192.168.0.1',
      secondMask: '192.168.0.1',
      ipv6: '1',
      ipv6Mask: '2',
      description: 'dsdsd',
    }
  ],
  edit: {}
});

export default function (state = defaultState, action) {
  switch (action.type) {
    case 'CLOSE_INTERFACES_EDIT':
      return state.set('edit', fromJS({}));

    case 'ADD_INTERFACE':
      return state.set('edit', fromJS({
        id: 2,
        status: 'on'
      }));

    case 'EDIT_INTERFACE':
      return state.set('edit', state.get('list').find(function(item) {
        return item.get('id') === action.id
      }));

    case 'UPDATE_INTERFACE_EDIT':
      return state.mergeIn(['edit'], action.data);

    default:
  }
  return state;
}
