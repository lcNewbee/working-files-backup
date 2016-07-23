import {List, Map, fromJS} from 'immutable';
import chai, {expect} from 'chai';
import * as actions from '../actions';
import reducer from '../reducer';

const should = chai.should();

const reciveData = {
    "state": {
        "code": 2000,
        "msg": "ok"
    },
    "data": {
        "page": {
            "start": 2,
            "size": 2,
            "currPage": 2,
            "totalPage": 4,
            "total": 4,
            "nextPage": 3,
            "lastPage": 4
        },
        "list": [
            {
                "devicename": "神器",
                "mac": "12:33:44:55:66:78",
                "model": "V2.2",
                "softversion": "V1.1",
                "channel": "auto"
            }
        ]
    }
}


describe('Stats redux', () => {

    it('should update offlineAp data when dispatch REVEVICE_FETCH_OFFLINE_AP', () => {
        const initialState = fromJS({
            data: {
                username: '',
                password: ''
            },
            offlineAp: {
                query: {
                    size: 30,
                    page: 1
                }
            }
        });
        const action = actions.reveviceFetchOfflineAp(reciveData.data);

        const nextState = reducer(initialState, action);

        nextState.should.equal(fromJS({
            data: {
                username: '',
                password: ''
            },
            offlineAp: {
                query: {
                    size: 30,
                    page: 1
                },
                "page": {
                    "start": 2,
                    "size": 2,
                    "currPage": 2,
                    "totalPage": 4,
                    "total": 4,
                    "nextPage": 3,
                    "lastPage": 4
                },
                "list": [
                    {
                        "devicename": "神器",
                        "mac": "12:33:44:55:66:78",
                        "model": "V2.2",
                        "softversion": "V1.1",
                        "channel": "auto"
                    }
                ]
            }
        }));
    });

    it('should update offlineAp query when dispatch CHANGE_OFFLINE_AP_QUERY', () => {
        const initialState = fromJS({
            data: {
                username: '',
                password: ''
            },
            offlineAp: {
                test: 12,
                query: {
                    size: 30,
                    page: 1
                }
            }
        });
        
        const action = actions.changeOfflineApQuery({
            size: 50
        });

        const nextState = reducer(initialState, action);
        
        nextState.should.equal(fromJS({
            data: {
                username: '',
                password: ''
            },
            offlineAp: {
                test: 12,
                query: {
                    size: 50,
                    page: 1
                }
            }
        }));
    });
});