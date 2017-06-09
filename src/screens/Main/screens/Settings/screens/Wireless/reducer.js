import Immutable, { Map, List, fromJS } from 'immutable';
import channels from 'shared/config/country.json';

const channelsList = List(channels);

function getCountry(country) {
  let initLang = country;
  let ret = '';
  let navigator = window.navigator;

  if (!initLang) {
    initLang = (navigator.language || navigator.userLanguage ||
      navigator.browserLanguage || navigator.systemLanguage ||
      'CN').substr(-2).toUpperCase();
  }

  channelsList.find(function (item) {
    if (item.country === initLang) {
      ret = item.country;
    }
  });

  return ret || 'CN';
}

const defaultSettings = Map({
  encryption: 'none',
  vlanenable: '0',
  upstream: '0',
  downstream: '0',
  country: getCountry(),
  channel: '6',
  channelsBandwidth: '20',
  channel5g: '6',
  channelsBandwidth5g: '20',
  ssid: '',
  vlanid: '',
});

const defaultState = fromJS({
  data: {
    list: [],
    curr: {},
  },
});

function transformCountryData(settingData, frequencyValue) {
  let ret;
  let frequencyValuePath;
  if (frequencyValue === '2.4G') {
    frequencyValuePath = 'radio2.4G';
  } else {
    frequencyValuePath = 'radio5.8G';
  }
  console.log('frequencyValuePath', frequencyValuePath);
  ret = settingData.mergeDeepIn([frequencyValuePath, 'country'], getCountry(settingData.getIn([frequencyValuePath, 'country'])));
  channelsList.forEach((item) => {
    if (item.country === ret.getIn([frequencyValuePath, 'country'])) {
      if (parseInt(ret.getIn([frequencyValuePath, 'channel']), 10) > parseInt(item['2.4g'].substr(-2), 10)) {
        ret = ret.setIn([frequencyValuePath, 'channel'], '0');
      }
    }
  });
  return ret;
}

function receiveSettings(state, settingData, frequencyValue) {
  const ret = state.update('data', data => data.merge(settingData));
  const currData = state.getIn(['data', 'curr']) || Map({});
  let listCurr;
  if (!currData.isEmpty()) {
    listCurr = currData.merge(ret.getIn(['data', 'list']).find(function (item) {
      return currData.get('groupname') === item.get('groupname');
    }));
  } else {
    listCurr = currData.merge(ret.getIn(['data', 'list', 0]));
  }
  listCurr = transformCountryData(listCurr, frequencyValue);
  return ret.setIn(['data', 'curr'], listCurr)
    .set('fetching', false);
}

function changeGroup(state, groupname, frequencyValue) {
  const ret = state.mergeIn(['data', 'curr', 'radio2.4G'], defaultSettings).mergeIn(['data', 'curr', 'radio5.8G'], defaultSettings);
  let selectGroup = state.getIn(['data', 'list'])
    .find(item => item.get('groupname') === groupname);
  selectGroup = transformCountryData(selectGroup, frequencyValue);
  return ret.mergeIn(['data', 'curr'], selectGroup);
}

function changeFrequency(state, frequencyValue) {
  return state;
}
export default function (state = defaultState, action) {
  switch (action.type) {
    case 'REQEUST_FETCH_WIFI':
      return state.set('fetching', true);

    case 'RECEIVE_WIFI':
      return receiveSettings(state, action.data, action.frequencyValue);

    case 'CHANGE_WIFI_GROUP':
      return changeGroup(state, action.name, action.frequencyValue);

    case 'CHANGE_WIFI_SETTINGS':
      return state.mergeDeepIn(['data', 'curr'], action.data);

    case 'CHANGE_FREQUENCY':
      return changeFrequency(state, action.frequencyValue);
    default:

  }
  return state;
}
