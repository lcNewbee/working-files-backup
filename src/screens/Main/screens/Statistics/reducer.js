import {Map, List, fromJS} from 'immutable';

let defaultState = fromJS({//组件本身所需的数据
  fetching: false,
  query: {
    timeType: '0'
  },
  reports: [
    
  ]
});


function reciveData(state, action) {
  var tmp = fromJS({
    reports:action.data
  });
  return state.delete("reports").merge(tmp);
}

export default function(state = defaultState, action) {//根据action修改本身的state数据，reducer
  switch (action.type) {
    case 'REQEUST_FETCH_REPORT_INFO':
      return state.set('fetching', true);
    
    case 'RECIVE_FETCH_REPORT_INFO':
      return reciveData(state, action);

    case 'CHANGE_TIME_RANGE_INFO':
      return state.setIn(['query', 'timeType'], action.timeType);
  }
  return state;
};