import {Map, List, fromJS} from 'immutable';

let defaultState = fromJS({
    fetching:false,
    query:{
        "aptype":"station"
    },
    wirelessmode:"station",
    hidessid:false,
    ssid:"axilspot",
    ctycode:"US",
    channelwidth:"40MHz",
})

export default function(state = defaultState,action){

    //。。。

    return state;
}
