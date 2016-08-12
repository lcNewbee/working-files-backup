import { fromJS } from 'immutable';

const defaultState = fromJS({
  fetching: false,
  data: {
    WirelessMode: 'station',
    SSID: 'test',
    CountryCode: 'CN',
    '80211Mode': 'A/N mixed',
    ChannelWidth: '40',
    Frequency: 'auto',
    TxPower: '14',
    MaxTxRate: '15',
    security: {
      Mode: 'WPA-AES', // None,WPA-AES,WPA2-AES
      Key: '12345678', // WPA
    },
  },
});

export default function (state = defaultState, action) {
  return state;
}
