import { actions as appActions } from '../app';
import ACTION_TYPES from './actionTypes';

export function reqeustFetchSettings() {
  return {
    type: ACTION_TYPES.REQEUST_FETCH,
  };
}

export function reciveFetchSettings(data, name) {
  return {
    type: ACTION_TYPES.RECEIVE_FETCH,
    updateAt: Date.now(),
    data,
    name,
  };
}

export function changeSettingsQuery(query) {
  return {
    type: ACTION_TYPES.CHANGE_QUERY,
    query,
  };
}
export function changeSettingsActionQuery(query) {
  return {
    type: ACTION_TYPES.CHANGE_ACTION_QUERY,
    query,
  };
}
export function updateItemSettings(data) {
  return {
    type: ACTION_TYPES.UPDATE_SETTINGS,
    data,
  };
}

export function leaveSettingsScreen() {
  return {
    type: ACTION_TYPES.LEAVE_SCREEN,
  };
}

export function initSettings(option) {
  return {
    type: ACTION_TYPES.INIT,
    option,
  };
}

export function fetchSettings(url) {
  return (dispatch, getState) => {
    const globalState = getState();
    const name = globalState.settings.get('curSettingId');
    const query = globalState.settings.getIn(['curQuery']).toJS();
    const formUrl = globalState.settings.getIn([name, 'formUrl']);
    const fetchUrl = globalState.settings.getIn([name, 'fetchUrl']) || formUrl;
    dispatch(reqeustFetchSettings());

    return dispatch(appActions.fetch(url || fetchUrl, query))
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          dispatch(reciveFetchSettings(json.data, name));
        }
      });
  };
}

export function saveSettings(url) {
  return (dispatch, getState) => {
    const globalState = getState();
    const name = globalState.settings.get('curSettingId');
    const curData = globalState.settings.getIn(['curData']);
    const oriData = globalState.settings.getIn([name, 'data']);
    const formUrl = globalState.settings.getIn([name, 'formUrl']);
    const fetchUrl = globalState.settings.getIn([name, 'fetchUrl']) || formUrl;
    const saveUrl = globalState.settings.getIn([name, 'saveUrl']) || formUrl;

    if (!curData.equals(oriData)) {
      //console.log('hasChange');
    }

    return dispatch(appActions.save(url || saveUrl, curData.toJS()))
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          dispatch(fetchSettings(fetchUrl));
        }
      });
  };
}
