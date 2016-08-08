import {List, Map, fromJS} from 'immutable';
import chai, {expect} from 'chai';

import reducer from '../reducer';
import * as actions from '../actions';

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
            "groupname": "研发",
            "remarks": "只有开通网络权限"
          }, {
            "groupname": "测试",
            "remarks": "只有开通网络权限"
          }
        ]
      }
    };
    const nextState = reducer(initialState, action);

    nextState.should.equal(fromJS({
      fetching: false,
      data: {
        list: [
          {
            "groupname": "研发",
            "remarks": "只有开通网络权限"
          }, {
            "groupname": "测试",
            "remarks": "只有开通网络权限"
          }
        ]
      }
    }));
  });

  it('handle RECEIVE_GROUP_DEVICES', () => {
    const initialState = fromJS({
      devices: {
        list: []
      }
    });

    const action  = actions.receiveGroupDevices({
        "page": {
            "start": 2,
            "size": 2,
            "currPage": 2,
            "totalPage": 2,
            "total": 4,
            "nextPage": -1,
            "lastPage": 4
        },
        "list": [
            {
                "devicename": "12:33:44:55:66:78/ap1",
                "ip": "192.168.5.53",
                "status": "online/offline",
                "groupname": "xxx"
            },
            {
                "devicename": "12:33:44:55:66:78/ap2",
                "ip": "192.168.5.53",
                "status": "online/offline",
                "groupname": "xxxxxx"
            }
        ]
      });
    const nextState = reducer(initialState, action);

    nextState.should.equal(fromJS({
      fetching: false,
      devices: {
        "page": {
            "start": 2,
            "size": 2,
            "currPage": 2,
            "totalPage": 2,
            "total": 4,
            "nextPage": -1,
            "lastPage": 4
        },
        "list": [
            {
                "devicename": "12:33:44:55:66:78/ap1",
                "ip": "192.168.5.53",
                "status": "online/offline",
                "groupname": "xxx"
            },
            {
                "devicename": "12:33:44:55:66:78/ap2",
                "ip": "192.168.5.53",
                "status": "online/offline",
                "groupname": "xxxxxx"
            }
        ]
      }
    }));
  });

  it('handle ADD_GROUP', () => {
    const initialState = fromJS({
      data: {}
    });
    let action = actions.addDeviceGroup()
    let nextState = reducer(initialState, action)
    nextState.should.equal(fromJS({
      data: {},
      actionType: 'add',
      edit: {
        devices: []
      }
    }));

  });

  it('handle EDIT_GROUP', () => {
    const initialState = fromJS({
      data: {
        list: [
          {
            "groupname": "研发",
            "remarks": "只有开通网络权限"
          }, {
            "groupname": "测试",
            "remarks": "只有开通网络权限"
          }
        ]
      },
      devices: {
        "page": {
            "start": 2,
            "size": 2,
            "currPage": 2,
            "totalPage": 2,
            "total": 4,
            "nextPage": -1,
            "lastPage": 4
        },
        "list": [
            {
                "devicename": "12:33:44:55:66:78/ap1",
                "ip": "192.168.5.53",
                "mac": "12:33:44:55:66:78",
                "status": "online/offline",
                "groupname": "研发"
            },
            {
                "devicename": "12:33:44:55:66:76/ap2",
                "ip": "192.168.5.53",
                "mac": "12:33:44:55:66:76",
                "status": "online/offline",
                "groupname": "xxxxxx"
            }
        ]
      }
    });
    let action = actions.editDeviceGroup("研发");
    let nextState = reducer(initialState, action);

    const expectMap = fromJS({
      data: {
        list: [
          {
            "groupname": "研发",
            "remarks": "只有开通网络权限"
          }, {
            "groupname": "测试",
            "remarks": "只有开通网络权限"
          }
        ],
      },
      devices: {
        "page": {
            "start": 2,
            "size": 2,
            "currPage": 2,
            "totalPage": 2,
            "total": 4,
            "nextPage": -1,
            "lastPage": 4
        },
        "list": [
            {
                "devicename": "12:33:44:55:66:78/ap1",
                "ip": "192.168.5.53",
                "mac": "12:33:44:55:66:78",
                "status": "online/offline",
                "groupname": "研发"
            },
            {
                "devicename": "12:33:44:55:66:76/ap2",
                "ip": "192.168.5.53",
                "mac": "12:33:44:55:66:76",
                "status": "online/offline",
                "groupname": "xxxxxx"
            }
        ]
      },
      edit: {
        "orignName": "研发",
        "groupname": "研发",
        "remarks": "只有开通网络权限",
        "devices": [
          "12:33:44:55:66:78"
        ]
      },
      actionType: 'edit',
    });

    nextState.should.equal(expectMap);
  });

  it('handle SELECT_DEVICES when edit or add group', () => {
    const initialState = fromJS({
      edit: {
        groupname: "研发",
        remark: "只有开通网络权限",
        devices: ['12:23:44:55:66:78']
      }
    });

    let action = actions.selectDevice("12:23:44:55:66:78");
    let nextState = reducer(initialState, action);
    let expectMap = fromJS({
        "groupname": "研发",
        "remark": "只有开通网络权限",
        devices: [
          "12:23:44:55:66:78"
        ]
    });

    expect(nextState.get('edit')).to.be.equal(expectMap);


    action = actions.selectDevice("12:33:44:55:66:78");

    nextState = reducer(nextState, action);

    expectMap = fromJS({
        "groupname": "研发",
        "remark": "只有开通网络权限",
        devices: [
          "12:23:44:55:66:78",
          "12:33:44:55:66:78"
        ]
    });
    expect(nextState.get('edit')).to.be.equal(expectMap);
  });

  it('handle UNSELECT_DEVICES when edit or add group', () => {
    const initialState = fromJS({
      edit: {
        groupname: "研发",
        remark: "只有开通网络权限",
        devices: [
          '12:23:44:55:66:78',
          '12:33:44:55:66:78'
        ]
      }
    });

    let action = actions.selectDevice("12:23:44:55:66:78", true);
    let nextState = reducer(initialState, action);
    let expectMap = fromJS({
        "groupname": "研发",
        "remark": "只有开通网络权限",
        devices: [
          "12:33:44:55:66:78"
        ]
    });

    expect(nextState.get('edit')).to.be.equal(expectMap);


    action = actions.selectDevice("12:33:44:55:66:78", true);

    nextState = reducer(nextState, action);

    expectMap = fromJS({
        "groupname": "研发",
        "remark": "只有开通网络权限",
        devices: []
    });
    expect(nextState.get('edit')).to.be.equal(expectMap);
  });

  it('handle CHANGE_EDIT_GROUP when edit or add group', () => {
    const initialState = fromJS({
      edit: {
        groupname: "研发",
        remark: "只有开通网络权限",
        devices: [
          '12:23:44:55:66:78',
          '12:33:44:55:66:78'
        ]
      }
    });

    let action = actions.changeEditGroup({
      groupname: "测试吧"
    });
    let nextState = reducer(initialState, action);
    let expectMap = fromJS({
        "groupname": "测试吧",
        "remark": "只有开通网络权限",
        devices: [
          '12:23:44:55:66:78',
          '12:33:44:55:66:78'
        ]
    });

    expect(nextState.get('edit')).to.be.equal(expectMap);

    action = actions.changeEditGroup({
      remark: "ok"
    });

    nextState = reducer(nextState, action);

    expectMap = fromJS({
        "groupname": "测试吧",
        "remark": "ok",
        devices: [
          '12:23:44:55:66:78',
          '12:33:44:55:66:78'
        ]
    });
    expect(nextState.get('edit')).to.be.equal(expectMap);
  });

  it('should checks data after edit to SAVE_DEVICE_GROUP', () => {

  });

});
