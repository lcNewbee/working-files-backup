import {List, Map, fromJS} from 'immutable';
import chai, {expect} from 'chai';

import reducer from '../../../../src/pages/GroupSettings/reducer';
import * as actions from '../../../../src/pages/GroupSettings/actions';

describe('Group Settings Rudex', () => {

  it('handles RECEIVE_DEVICE_GROUPS', () => {
    const initialState = fromJS({
      data: {
        list: []
      }
    });
    
    const action = {
      type: 'RECEIVE_DEVICE_GROUPS',
      data: {
        list: [
          {
                "id": 1232,
                "name": "研发",
                "remarks": "只有开通网络权限",
                "devices": "设备1,设备1,设备1"
            }, {
                "id": 1233,
                "name": "研发",
                "remarks": "只有开通网络权限",
                "devices": "设备1,设备1,设备1"
            }
        ]
      }
    };
    const nextState = reducer(initialState, action);

    nextState.should.equal(fromJS({
      data: {
        list: [
          {
            "id": 1232,
            "name": "研发",
            "remarks": "只有开通网络权限",
            "devices": "设备1,设备1,设备1"
          }, {
            "id": 1233,
            "name": "研发",
            "remarks": "只有开通网络权限",
            "devices": "设备1,设备1,设备1"
          }
        ]
      }
    }));
  });

  it('handles EDIT_GROUP', () => {
    const initialState = fromJS({
      data: {
        list: [{
            "id": 1232,
            "name": "研发",
            "remarks": "只有开通网络权限",
            "devices": "设备1,设备1,设备1"
          }, {
            "id": 1233,
            "name": "研发",
            "remarks": "只有开通网络权限",
            "devices": "设备1,设备1,设备1"
          }]
      }
    });
    let action = actions.editDeviceGroups(1232);
    let nextState = reducer(initialState, action);

    nextState.should.equal(fromJS({
      data: {
        list: [
          {
            "id": 1232,
            "name": "研发",
            "remarks": "只有开通网络权限",
            "devices": "设备1,设备1,设备1"
          }, {
            "id": 1233,
            "name": "研发",
            "remarks": "只有开通网络权限",
            "devices": "设备1,设备1,设备1"
          }
        ],
        edit: {
          "id": 1232,
          "name": "研发",
          "remarks": "只有开通网络权限",
          "devices": "设备1,设备1,设备1"
        }
      }
    }));

    action = actions.addDeviceGroups()
    nextState = reducer(initialState, action)
    nextState.should.equal(fromJS({
      data: {
        list: [
          {
            "id": 1232,
            "name": "研发",
            "remarks": "只有开通网络权限",
            "devices": "设备1,设备1,设备1"
          }, {
            "id": 1233,
            "name": "研发",
            "remarks": "只有开通网络权限",
            "devices": "设备1,设备1,设备1"
          }
        ],
        edit: {}
      }
    }));
  });

});
