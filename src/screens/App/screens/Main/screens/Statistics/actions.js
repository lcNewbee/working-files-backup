import utils from 'shared/utils';
import urls from 'shared/config/urls';
import * as appActions from 'shared/actions/app';


export function createReport() {
  return (dispatch, getState) => {
    const query = getState().statistics.get('query').toJS();

    dispatch(reqeustFetchReportInfo());

    dispatch(appActions.fetch(urls.createReport, query))
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          console.log('json ok');
          dispatch(fetchReportInfo());
        }
      });
  };
}

export function emailReport(num) {
  return (dispatch, getState) => {
    const id = { id: num };

    dispatch(appActions.fetch(urls.emailReport, id))
            .then((json) => {
              if (json.state && json.state.code === 2000) {
                console.log('email report ok');
              }
            });
  };
}

export function downloadReport(num) {
  return (dispatch, getState) => {
    const id = { id: num };

    dispatch(appActions.fetch(urls.fetchReport, id))
            .then((json) => {
              if (json.state && json.state.code === 2000) {
                console.log('download report');
              }
            });
  };
}

export function deleteReport(num) {
  return (dispatch, getState) => {
    const id = { id: num };

    dispatch(appActions.fetch(urls.deleteReport, id))
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          console.log('json ok');
          dispatch(fetchReportInfo());
        }
      });
  };
}

export function reqeustFetchReportInfo() {
  return {
    type: 'REQEUST_FETCH_REPORT_INFO',
  };
}

export function reciveFetchReportInfo(data) {
  return {
    type: 'RECIVE_FETCH_REPORT_INFO',
    data,
  };
}

export function changeTimeRangeInfo(timeType) {
  return {
    type: 'CHANGE_TIME_RANGE_INFO',
    timeType,
  };
}


export function fetchReportInfo() {
  return (dispatch, getState) => {
    dispatch(reqeustFetchReportInfo());

    dispatch(appActions.fetch(urls.fetchReportList))
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          console.log('fetch');
          dispatch(reciveFetchReportInfo(json.data));
        }
      });
  };
}

