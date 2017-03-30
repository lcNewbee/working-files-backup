import { fromJS } from 'immutable';
import ACTION_TYPES from './actionTypes';

const emptyMap = fromJS({});
const defaultItem = fromJS({
  data: {},
  query: {},
  actionQuery: {},
  defaultData: {},
});
const defaultState = fromJS({
  curSettingId: 'base',
  curQuery: {},
  curSaveQuery: {},
  curData: {},
  base: defaultItem,
});

function initSettingsItem(state, action) {
  let ret = state;
  const settingId = action.option.settingId;
  const curQuery = action.option.query;
  const curSaveQuery = action.option.saveQuery;
  const myItem = defaultItem.merge(action.option);

  if (!state.get(settingId) || state.get(settingId).isEmpty()) {
    ret = state.mergeIn([settingId], myItem);
  }

  return ret.set('curSettingId', settingId)
      .set('curQuery', emptyMap.merge(curQuery))
      .set('curSaveQuery', emptyMap.merge(curSaveQuery))
      .set('curData', emptyMap.merge(action.option.defaultData));
}

export default function (state = defaultState, action) {
  const curSettingName = action.name || state.get('curSettingId');

  switch (action.type) {
    case ACTION_TYPES.INIT:
      return initSettingsItem(state, action);

    case ACTION_TYPES.REQEUST_FETCH:
      return state.setIn([curSettingName, 'fetching'], true);

    case ACTION_TYPES.RECIVE_FETCH:

      return state.setIn([action.name, 'fetching'], false)
        .setIn([action.name, 'updateAt'], action.updateAt)
        .mergeIn([action.name, 'data'], action.data)
        .mergeIn(['curData'], fromJS(action.data));

    case ACTION_TYPES.CHANGE_QUERY:
      return state.mergeIn(['curQuery'], action.query);

    case ACTION_TYPES.CHANGE_ACTION_QUERY:
      return state.mergeIn(['curSaveQuery'], action.query);

    case ACTION_TYPES.UPDATE_SETTINGS:
      return state.mergeIn(['curData'], action.data);

    case ACTION_TYPES.LEAVE_SCREEN:
      return state.setIn(['curQuery'], fromJS({}))
        .set('curSaveQuery', fromJS({}))
        .set('curData', fromJS({}));

    default:
  }
  return state;
}
