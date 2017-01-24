import { fromJS } from 'immutable';

import reducer from '../reducer';
import * as actions from '../actions';

describe('Wireless Rudex', () => {
  it('should change data.curr when CHANGE_WIFI_GROUP', () => {
    const initialState = fromJS({
      data: {
        list: [{
          groupname: 'group231',
          downstream: '128',
          upstream: '64',
        },
        {
          groupname: 'group33333',
          downstream: '128',
          upstream: '64',
        },
        {
          groupname: 'group33547',
          downstream: '128',
          upstream: '64',
        },
        ],

        curr: {
          groupname: 'group231',
          downstream: '128',
          upstream: '64',
        },
      },
    });

    const action = actions.changeWifiGroup('group33547');

    const nextState = reducer(initialState, action);
    const expectMap = fromJS({
      data: {
        list: [{
          groupname: 'group231',
          downstream: '128',
          upstream: '64',
        },
        {
          groupname: 'group33333',
          downstream: '128',
          upstream: '64',
        },
        {
          groupname: 'group33547',
          downstream: '128',
          upstream: '64',
        },
        ],
        curr: {
          channelsBandwidth: '20',
          channelsBandwidth5g: '20',
          downstream: '128',
          channel: '6',
          channel5g: '6',
          encryption: 'none',
          vlanenable: '0',
          groupname: 'group33547',
          country: 'US',
          upstream: '64',
          ssid: '',
          vlanid: '',
        },
      },
    });

    expect(nextState).toEqual(expectMap);
  });

  it('should updata data.curr when CHANGE_QOS_SETTINGS', () => {
    const initialState = fromJS({
      data: {
        curr: {
          groupname: 'group231',
          downstream: '128',
          upstream: '64',
        },
      },
    });

    const action = actions.changeWifiSettings({
      downstream: '12',
      upstream: '33',
    });

    const nextState = reducer(initialState, action);

    expect(nextState).toEqual(fromJS({
      data: {
        curr: {
          groupname: 'group231',
          downstream: '12',
          upstream: '33',
        },
      },
    }));
  });
});
