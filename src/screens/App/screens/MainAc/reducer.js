import { fromJS } from 'immutable';

const defaultState = fromJS({
  topMenu: false,
  asiderLeft: false,
  vlan: {
    selected: '2',
    list: [
      {
        id: '1',
        remark: '测试'
      }, {
        id: '2',
        remark: '研发'
      }
    ]
  },
  group: {
    selected: '2',
    list: [
      {
        id: '1',
        groupName: '测试',
        remark: '测试',
        devices: [
          {
            name: "23",
            ip: "32",
          }
        ]
      }, {
        id: '2',
        groupName: '测试',
        remark: '研发',
        devices: [
          {
            name: "23",
            ip: "32",
          }
        ]
      }
    ]
  }

});

export default function (state = defaultState, action) {
  switch (action.type) {
    case 'ON_TOGGLE_TOP_MENU':
      return state.set('topMenu', !state.get('topMenu'));

    case 'ON_TOGGLE_ASIDER_LEFT':
      return state.set('asiderLeft', !state.get('asiderLeft'));

    case 'ON_SELECT_VLAN':
      return state.setIn(['vlan', 'selected'], action.id);

    default:
  }
  return state;
}
