import * as appActions from 'shared/actions/app';
import urls from 'shared/config/urls_axc';

let refreshTimeout = null;

export function reqeustFetchAlarmEvents() {
  return {
    type: 'REQEUST_FETCH_ALARM_EVENTS',
  };
}

export function reciveFetchAlarmEvents(data) {
  return {
    type: 'RECIVE_FETCH_ALARM_EVENTS',
    updateAt: Date.now(),
    data,
  };
}

export function changeAlarmEventsQuery(query) {
  return {
    type: 'CHANGE_ALARM_EVENTS_QUERY',
    query,
  };
}


export function leaveAlarmEventsScreen() {
  window.clearTimeout(refreshTimeout);

  return {
    type: 'LEAVE_ALARM_EVENTS_SCREEN',
  };
}

export function fetchAlarmEvents() {
  return (dispatch, getState) => {
    const refreshTime = getState().app.get('rateInterval');
    const query = getState().events.get('query').toJS();

    window.clearTimeout(refreshTimeout);
    dispatch(reqeustFetchAlarmEvents());

    dispatch(appActions.fetch(urls.getAlarmEvents, query))
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          dispatch(reciveFetchAlarmEvents(json.data));
        }

        if (refreshTime && refreshTime > 0) {
          refreshTimeout = window.setTimeout(() => {
            dispatch(fetchAlarmEvents());
          }, refreshTime);
        }
      });
  };
}

