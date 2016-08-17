import { fromJS } from 'immutable';

const emptyMap = fromJS({});
const defaultItem = fromJS({
  details: [
    {
      sectionKey: 'overview',
      mac: '44:d9:e4:33:33:22',
      model: 'AP512',
      version: '3.7.344',
    },
  ],
  configuration: [
    {
      nameKey: 'general',
      alias: 'dsd',
    }, {
      nameKey: 'radios',
      alias: 'dsd',
    }, {
      nameKey: 'system',
      apRelateNum: 122,
    },
  ],
});
const defaultState = fromJS({
  isShowPanel: false,
  activeIndex: -1,
  list: [

  ],
});

function initPROPERTYItem(state, action) {
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
  const curSettingName = state.get('curSettingId');
  switch (action.type) {
    case 'INIT_PROPERTY':
      return initPROPERTYItem(state, action);

    case 'REQEUST_FETCH_PROPERTY':
      return state.setIn([curSettingName, 'fetching'], true);

    case 'RECIVE_FETCH_PROPERTY':
      return state.setIn([curSettingName, 'fetching'], false)
        .setIn([curSettingName, 'updateAt'], action.updateAt)
        .mergeIn([curSettingName, 'data'], action.data)
        .mergeIn(['curData'], fromJS(action.data));

    case 'CHANGE_PROPERTY_QUERY':
      return state.mergeIn(['curQuery'], action.query);

    case 'CHANGE_PROPERTY_ACTION_QUERY':
      return state.mergeIn(['curSaveQuery'], action.query);

    case 'UPDATE_ITEM_PROPERTY':
      return state.mergeIn(['curData'], action.data);

    case 'TOGGLE_PROPERTY_PANEL':
      return state.update('isShowPanel', val => !val);

    case 'LEAVE_PROPERTY_SCREEN':
      return state.setIn(['curQuery'], fromJS({}))
        .set('curSaveQuery', fromJS({}))
        .set('curData', fromJS({}));

    default:
  }
  return state;
}
