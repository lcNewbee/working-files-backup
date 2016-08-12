import { fromJS } from 'immutable';

const defaultItem = fromJS({
  updateAt: 11122,
  savedAt: 222,
  data: {},
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
      .set('curQuery', fromJS(curQuery))
      .set('curSaveQuery', fromJS(curSaveQuery));
}

export default function (state = defaultState, action) {
  const curSettingName = state.get('curSettingId');
  switch (action.type) {
    case 'INIT_SETTINGS':
      return initSettingsItem(state, action);

    case 'REQEUST_FETCH_SETTINGS':
      return state.setIn([curSettingName, 'fetching'], true);

    case 'RECIVE_FETCH_SETTINGS':
      return state.setIn([curSettingName, 'fetching'], false)
        .setIn([curSettingName, 'updateAt'], action.updateAt)
        .mergeIn([curSettingName, 'data'], action.data)
        .set('curData', fromJS(action.data));

    case 'CHANGE_SETTINGS_QUERY':
      return state.mergeIn(['curQuery'], action.query);

    case 'CHANGE_SETTINGS_ACTION_QUERY':
      return state.mergeIn(['curSaveQuery'], action.query);

    case 'UPDATE_ITEM_SETTINGS':
      return state.mergeIn(['curData'], action.data);

    case 'LEAVE_LIST_SCREEN':
      return state.mergeIn([curSettingName, 'query'], {
        search: '',
      });

    default:

  }
  return state;
}
