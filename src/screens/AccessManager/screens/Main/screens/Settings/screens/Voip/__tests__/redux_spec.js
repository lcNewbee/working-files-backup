import {List, Map, fromJS} from 'immutable';
import chai, {expect} from 'chai';
import reducer from '../reducer';
import * as actions from '../actions';

const defaultSettings = Map({
  enable: '0'
});

describe('Voip Rudex', () => {

  it('should change data.curr when CHANGE_VOIP_GROUP', () => {
    const initialState = fromJS({
      data: {
        "list": [
          {
            "groupname": "group231",
            "enable": "1"
          },
          {
            "groupname": "group33333",
            "enable": "1"
          },
          {
            "groupname": "group33547",
            "enable": "1"
          }
        ],

        curr: {
          "groupname": "group231",
          "enable": "1"
        }
      }
    });

    let action = actions.changeVoipGroup("group33547");

    let nextState = reducer(initialState, action);
    let expectMap = fromJS({
      data: {
        "list": [
          {
            "groupname": "group231",
            "enable": "1"
          },
          {
            "groupname": "group33333",
            "enable": "1"
          },
          {
            "groupname": "group33547",
            "enable": "1"
          }
        ],

        curr: {
          "groupname": "group33547",
          "enable": "1"
        }
      }
    });

    expect(nextState).to.be.equal(expectMap);
  });

  it('should updata data.curr when CHANGE_VOIP_SETTINGS', () => {
    const initialState = fromJS({
      data: {
        curr: {
          "groupname": "group231",
          "downstream": "128",
          "upstream": "64"
        }
      }
    });

    let action = actions.changeVoipSettings({
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
