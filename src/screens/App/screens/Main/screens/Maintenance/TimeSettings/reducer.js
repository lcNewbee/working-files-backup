import { fromJS } from 'immutable';

const defaultState = fromJS({
  zoneName: '',
  timeZone: '',
});

export default function (state = defaultState, action) {
  switch (action.type) {
    case 'CHANGE_TIME_ZONE':
      return state.set('zoneName', action.data.zoneName)
                  .set('timeZone', action.data.timeZone);
    case 'RESTORE_SELF_STATE':
      return defaultState;
    default:
  }
  return state;
}
