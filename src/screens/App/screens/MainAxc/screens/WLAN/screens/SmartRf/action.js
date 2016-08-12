import * as appActions from 'shared/actions/app';

export function reqeustFetchSettings() {
  return {
    type: 'REQEUST_FETCH_SETTINGS',
  };
}

export function reciveFetchSettings(data) {
  return {
    type: 'RECIVE_FETCH_SETTINGS',
    updateAt: Date.now(),
    data,
  };
}

export function changeSettingsQuery(query) {
  return {
    type: 'CHANGE_SETTINGS_QUERY',
    query,
  };
}
export function changeSettingsActionQuery(query) {
  return {
    type: 'CHANGE_SETTINGS_ACTION_QUERY',
    query,
  };
}
export function updateItemSettings(data) {
  return {
    type: 'UPDATE_ITEM_SETTINGS',
    data,
  };
}

export function leaveSettingsScreen() {
  return {
    type: 'LEAVE_SETTINGS_SCREEN',
  };
}

export function initSettings(option) {
  return {
    type: 'INIT_SETTINGS',
    option,
  };
}

export function fetchSettings() {
  return (dispatch, getState) => {
    const globalState = getState();
    const name = globalState.settings.get('curSettingId');
    const query = globalState.settings.getIn(['curQuery']).toJS();
    const formUrl = globalState.settings.getIn([name, 'formUrl']);

    dispatch(reqeustFetchSettings());
    dispatch(appActions.fetch(formUrl, query))
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          dispatch(reciveFetchSettings(json.data));
        }
      });
  };
}

export function saveSettings() {
  return (dispatch, getState) => {
    const globalState = getState();
    const name = globalState.settings.get('curSettingId');
    const curData = globalState.settings.getIn(['curData']);
    const oriData = globalState.settings.getIn([name, 'data']);
    const formUrl = globalState.settings.getIn([name, 'formUrl']);

    if (!curData.equals(oriData)) {
      console.log('hasChange');
    }

    dispatch(appActions.save(formUrl, curData.toJS()))
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          dispatch(fetchSettings(formUrl));
        }
      });
  };
}
