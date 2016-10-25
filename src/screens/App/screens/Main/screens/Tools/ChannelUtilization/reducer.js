import { fromJS } from 'immutable';

const defaultState = fromJS({
  channelUtiOptions: [],
  channelUtiList: [],
});

export default function (state = defaultState, action) {
  switch (action.type) {
    case 'CHANGE_CHANNEL_UTI_OPTIONS':
      return state.set('channelUtiOptions', action.data);
    case 'CHANGE_CHANNEL_UTI_LIST':
      return state.set('channelUtiList', action.data);
    default:
  }
  return state;
}
