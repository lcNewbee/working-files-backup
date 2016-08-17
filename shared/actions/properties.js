import * as appActions from 'shared/actions/app';

export function reqeustFetchProperty() {
  return {
    type: 'REQEUST_FETCH_PROPERTY',
  };
}

export function reciveFetchProperty(data) {
  return {
    type: 'RECIVE_FETCH_PROPERTY',
    updateAt: Date.now(),
    data,
  };
}

export function changePropertyQuery(query) {
  return {
    type: 'CHANGE_PROPERTY_QUERY',
    query,
  };
}
export function togglePropertyPanel() {
  return {
    type: 'TOGGLE_PROPERTY_PANEL',
  };
}
export function changePropertyActionQuery(query) {
  return {
    type: 'CHANGE_PROPERTY_ACTION_QUERY',
    query,
  };
}
export function updateProperty(data) {
  return {
    type: 'UPDATE_PROPERTY',
    data,
  };
}

export function addProperty(option) {
  return {
    type: 'ADD_TO_PROPERTY_PANEL',
    option,
  };
}
export function removeProperty(option) {
  return {
    type: 'REMOVE_FROM_PROPERTY_PANEL',
    option,
  };
}

export function fetchProperty() {
  return (dispatch, getState) => {
    const globalState = getState();
    const name = globalState.properties.get('curSettingId');
    const query = globalState.properties.getIn(['curQuery']).toJS();
    const formUrl = globalState.properties.getIn([name, 'formUrl']);

    dispatch(reqeustFetchProperty());

    return dispatch(appActions.fetch(formUrl, query))
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          dispatch(reciveFetchProperty(json.data));
        }
      });
  };
}

export function saveProperty() {
  return (dispatch, getState) => {
    const globalState = getState();
    const name = globalState.properties.get('curSettingId');
    const curData = globalState.properties.getIn(['curData']);
    const oriData = globalState.properties.getIn([name, 'data']);
    const formUrl = globalState.properties.getIn([name, 'formUrl']);

    if (!curData.equals(oriData)) {
      console.log('hasChange');
    }

    return dispatch(appActions.save(formUrl, curData.toJS()))
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          dispatch(fetchProperty(formUrl));
        }
      });
  };
}
