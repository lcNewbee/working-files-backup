import {Map, List, fromJS} from 'immutable';


const defaultState = fromJS({
    rts:{
      "switch":false,
      value:100
    },
    distance:{
      adjustmode:"auto",
      vaule:100
    },
    clientisolation:false,
    sensitivity:{
      "switch":false,
      value:-96
    },
    led:[-94,-80,-73,-65]
})

export default function(state=defaultState,action){

  switch(action.type){
    case 'TOGGLE_RTS_SWITCH':
      return state.setIn([rts,"switch"],data.switch)
                  .setIn([rts,value],data.value);
  }

  return state;
}
