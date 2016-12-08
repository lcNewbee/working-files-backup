import { updateItemSettings } from 'shared/actions/settings';
import { fetch } from 'shared/actions/app';

export function changeDeviceMode(data) {
  return {
    type: 'CHANGE_DEVICE_MODE',
    data,
  };
}

export function leaveScreen() {
  return {
    type: 'LEAVE_SCREEN',
  };
}

export function changeCtyModal(data) {
  return {
    type: 'CHANGE_CTY_MODAL',
    data,
  };
}

export function changeAgreeProtocol(data) {
  return {
    type: 'CHANGE_AGREE_PROTOCOL',
    data,
  };
}

export function changeCountryCode(data) {
  return {
    type: 'CHANGE_COUNTRY_CODE',
    data,
  };
}

export function closeCountrySelectModal(data) {
  return {
    type: 'CLOSE_COUNTRY_SELECT_MODAL',
    data,
  };
}

export function receiveCountryInfo(data) {
  return {
    type: 'RECEIVE_COUNTRY_INFO',
    data,
  };
}

export function saveCountrySelectModal() {
  return (dispatch, getState) => {
    const radioId = getState().quicksetup.getIn(['currRadioConfig', 'radioId']);
    const selectedCode = getState().quicksetup.get('selectedCountry');
    const radioList = getState().settings.getIn(['curData', 'radioList'])
                                .setIn([radioId, 'countryCode'], selectedCode);
    dispatch(updateItemSettings({ radioList }));
    const channelWidth = getState().settings.getIn(['curData', 'radioList', radioId, 'channelWidth']);
    const saveInfo = {
      radio: getState().quicksetup.getIn(['currRadioConfig', 'radioType']),
      country: selectedCode,
      channelWidth,
    };
    dispatch(fetch('goform/get_country_info', saveInfo))
            .then((json) => {
              if (json.state && json.state.code === 2000) {
                dispatch(receiveCountryInfo(json.data));
              }
            });
    dispatch(changeCtyModal(false));
  };
}


export function changeScanStatus(data) {
  return {
    type: 'CHANGE_SCAN_STATUS',
    data,
  };
}

export function changeShowScanResultStatus(data) {
  return {
    type: 'CHANGE_SHOW_SCAN_RESULT_STATUS',
    data,
  };
}

export function changeSelectedResult(data) {
  return {
    type: 'CHANGE_SELECTED_RESULT',
    data,
  };
}

export function restoreSelfState() {
  return {
    type: 'RESTORE_SELF_STATE',
  };
}

export function changeReinitAt() {
  return {
    type: 'CHANGE_REINIT_AT',
  };
}

export function changeCurrRadioConfig(data) {
  return {
    type: 'CHANGE_CURR_RADIO_CONFIG',
    data,
  };
}

export function changeRadioSelectedArr(data) {
  return {
    type: 'CHANGE_RADIO_SELECTED_ARR',
    data,
  };
}

export function changeSsidInfo(data) {
  return {
    type: 'CHANGE_SSID_INFO',
    data,
  };
}
