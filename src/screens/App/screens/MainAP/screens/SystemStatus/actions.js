import * as appActions from 'shared/actions/app';
import urls from 'shared/config/urls';


export function changeFirstRefresh(data) {
  return {
    type: 'CHANGE_FIRST_REFRESH',
    data,
  };
}

export function changeCurrRadioConfig(data) {
  return {
    type: 'CHANGE_CURR_RADIO_CONFIG',
    data,
  };
}

export function changeServerData(data) {
  return {
    type: 'CHANGE_SERVER_DATA',
    data,
  };
}

export function changeCustomSettingsForChart(data) {
  return {
    type: 'CHANGE_CUSTOM_SETTINGS_FOR_CHART',
    data,
  };
}




