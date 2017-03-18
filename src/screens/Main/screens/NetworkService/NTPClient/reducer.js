import {Map, List, fromJS} from 'immutable';



let defaultState = fromJS({
  fetching:false,
  ntpswitch:"off"
})


export default function(state = defaultState, action){
  return state;
}
