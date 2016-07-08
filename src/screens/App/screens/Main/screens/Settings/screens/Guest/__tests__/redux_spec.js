import {List, Map, fromJS} from 'immutable';
import chai, {expect} from 'chai';
import reducer from '../reducer';
import * as actions from '../actions';

const defaultSettings = Map({
  enable: '0',
  encryption: 'none',
  vlanenable: '0',
  upstream: '0',
  downstream: '0',
  portalenable: '0',
  guestssid: ''
});

describe('Guest Rudex', () => {

  it('should change data.curr when CHANGE_GUEST_GROUP', () => {
    const initialState = fromJS({
      data: {
        "list": [
          {
            "groupname": "group231",
            "downstream": "128",
            "upstream": "64"
          },
          {
            "groupname": "group33333",
            "downstream": "128",
            "upstream": "64"
          },
          {
            "groupname": "group33547",
            "downstream": "128",
            "upstream": "64"
          }
        ],

        curr: {
          "groupname": "group231",
          "downstream": "128",
          "upstream": "64"
        }
      }
    });

    let action = actions.changeGuestGroup("group33547");

    let nextState = reducer(initialState, action);
    let expectMap = fromJS({
      data: {
        "list": [
          {
            "groupname": "group231",
            "downstream": "128",
            "upstream": "64"
          },
          {
            "groupname": "group33333",
            "downstream": "128",
            "upstream": "64"
          },
          {
            "groupname": "group33547",
            "downstream": "128",
            "upstream": "64"
          }
        ],

        curr: {
          "groupname": "group33547",
          "downstream": "128",
          "upstream": "64",
          "enable": "0",
          "encryption": "none",
          "vlanenable": "0",
          "portalenable": "0",
          "guestssid": ""
        }
      }
    });

    expect(nextState).to.be.equal(expectMap);
  });

  it('should updata data.curr when CHANGE_GUEST_SETTINGS', () => {
    const initialState = fromJS({
      data: {
        curr: {
          "groupname": "group231",
          "downstream": "128",
          "upstream": "64"
        }
      }
    });

    let action = actions.changeGuestSettings({
      "downstream": "12",
      "upstream": "33"
    });

    let nextState = reducer(initialState, action);

    expect(nextState).to.be.equal(fromJS({
      data: {
        curr: {
          "groupname": "group231",
          "downstream": "12",
          "upstream": "33"
        }
      }
    }));
  })

});
