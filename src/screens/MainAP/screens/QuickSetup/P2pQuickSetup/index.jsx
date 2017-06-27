import React from 'react'; import PropTypes from 'prop-types';
import { fromJS, Map } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';
import utils from 'shared/utils';
import {
  FormGroup, FormInput, Button, Modal, Table,
  WizardContainer,
} from 'shared/components';
import { actions as appActions } from 'shared/containers/app';
import { actions as settingActions } from 'shared/containers/settings';
import * as selfActions from './actions';
import reducer from './reducer';
import countryMap from './country';
import './index.scss';

const propTypes = {
  app: PropTypes.instanceOf(Map),
  fetch: PropTypes.func,
  save: PropTypes.func,
  selfState: PropTypes.instanceOf(Map),
  fetchSettings: PropTypes.func,
  changeDeviceMode: PropTypes.func,
  validateAll: PropTypes.func,
  product: PropTypes.instanceOf(Map),

  store: PropTypes.instanceOf(Map),
  updateItemSettings: PropTypes.func,
  saveCountrySelectModal: PropTypes.func,
  changeAgreeProtocol: PropTypes.func,
  changeCountryCode: PropTypes.func,
  changeCtyModal: PropTypes.func,
  resetVaildateMsg: PropTypes.func,
  changeShowScanResultStatus: PropTypes.func,
  changeScanStatus: PropTypes.func,
  changeSelectedResult: PropTypes.func,
  closeCountrySelectModal: PropTypes.func,
  receiveCountryInfo: PropTypes.func,
  validateOption: PropTypes.object,
  // saveSettings: PropTypes.func,
  restoreSelfState: PropTypes.func,
  changeReinitAt: PropTypes.func,
  changeCurrRadioConfig: PropTypes.func,
};

const defaultState = {
  security: {
    mode: 'none',
  },
};

const channelWidthOptions = [
  { value: 'HT20', label: 'HT20' },
  { value: 'HT40-', label: 'HT40-' },
  { value: 'HT40+', label: 'HT40+' },
  { value: 'HT80', label: 'HT80' },
];

const staAndApSecurityOptions = [
  { value: 'none', label: 'None' },
  { value: 'wpa', label: 'WPA-PSK' },
  { value: 'wpa2', label: 'WPA2-PSK' },
  { value: 'wpa-mixed', label: 'WPA-PSK/WPA2-PSK' },
  { value: 'wep', label: 'WEP' },
];

const repeaterSecurityOptions = [
  { value: 'none', label: 'None' },
  { value: 'wep', label: 'WEP' },
];

const wepAuthenOptions = [
  { value: 'open', label: 'Open' },
  { value: 'shared', label: 'Shared' },
];

// const wepKeyLengthOptions = [
//   { value: '64', label: '64bit' },
//   { value: '128', label: '128bit' },
// ];

const keyIndexOptions = [
  { value: '1', label: 'key 1' },
  { value: '2', label: 'key 2' },
  { value: '3', label: 'key 3' },
  { value: '4', label: 'key 4' },
];

const keyTypeOptions = [
  { value: 'Hex', label: 'Hex' },
  { value: 'ASCII', label: 'ASCII' },
];

const validOptions = Map({
  lanIp: validator({
    rules: 'ip',
  }),
  lanMask: validator({
    rules: 'mask',
  }),
  validSsid: validator({
    rules: 'remarkTxt:["\'\\\\"]|len:[1, 32]',
  }),
  validDistance: validator({
    rules: 'num:[1, 10]',
  }),
  validPassword: validator({
    rules: 'pwd|len:[8, 32]',
  }),
  apmac2: validator({
    rules: 'mac',
  }),
  apmac3: validator({
    rules: 'mac',
  }),
  Hex: validator({
    rules: 'hex|len:[10, 10]',
  }),
  ASCII: validator({
    rules: 'ascii|len:[5, 5]',
  }),
  staApmac: validator({
    rules: 'mac',
  }),
  validDistance: validator({
    rules: 'num:[1, 10]',
  }),
});

// countryMap为Object
function makeCountryOptions(map) {
  const countryList = [];
  for (const key of Object.keys(map)) {
    const entry = {
      label: __(key),
      value: map[key],
    };
    countryList.push(entry);
  }
  return countryList;
}

function getCountryNameFromCode(code, map) {
  for (const name of Object.keys(map)) {
    if (map[name] === code) {
      return __(name);
    }
  }
  return '';
}

export default class QuickSetup extends React.Component {
  constructor(props) {
    super(props);

    utils.binds(this, [
      'onScanBtnClick',
      'onStopScanClick',
      'onSelectScanResultItem',
      'onModalCloseBtnClick',
      'onModalOkBtnClick',
      'onCloseCountrySelectModal',
      'renderOperationMode',
      'renderStepTwo',
      'renderStepThree',
      'renderStepFour',
      'onCompleted',
      'onBeforeStep',
      'firstInAndRefresh',
      'onChangeRadio',
      'onChangeWirelessMode',
      'updateItemInRadioList',
      'handleWrongSecurMode',
      'getChannelListAndPowerRange',
    ]);
  }

  componentWillMount() {
    this.firstInAndRefresh();
  }

  componentDidUpdate(prevProps) {
    // const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
    if (this.props.app.get('refreshAt') !== prevProps.app.get('refreshAt')) {
      const asyncStep = Promise.resolve(this.props.restoreSelfState());
      asyncStep.then(() => {
        this.firstInAndRefresh();
        this.props.changeReinitAt();
      });
    }
    // const security = this.props.store.getIn(['curData', 'radioList', radioId, 'security']);
    // if (!security) {
    //   this.updateItemInRadioList('security', fromJS({ mode: 'none' }));
    // }
    // if (security && security.get('mode') !== 'wep' &&
    //     this.props.store.getIn(['curData', 'radioList', radioId, 'wirelessMode']) === 'repeater') {
    //   this.updateItemInRadioList('security', fromJS({ mode: 'none' }));
    // }
  }

  componentWillUnmount() {
    this.props.resetVaildateMsg();
  }

  onScanBtnClick() {
    this.props.changeScanStatus(true);
    this.props.fetch('goform/get_site_survey')
        .then((json) => {
          if (json.state && json.state.code === 2000) {
            this.props.updateItemSettings({
              scanResult: fromJS(json.data),
            });
            if (this.props.selfState.get('scaning') === true) {
              this.props.changeShowScanResultStatus(true);
            }
            this.props.changeScanStatus(false);
          }
        });
  }

  onSelectScanResultItem(item) {
    const { ssid, mac, security, frequency, channelWidth } = item.toJS();
    const result = fromJS({}).set('ssid', ssid).set('mac', mac)
                  .set('frequency', frequency)
                  .set('channelWidth', channelWidth)
                  .set('security', security);
    this.props.changeSelectedResult(result);
  }

  onStopScanClick() {
    this.props.changeScanStatus(false);
    this.props.changeShowScanResultStatus(false);
  }

  onModalCloseBtnClick() {
    this.props.changeShowScanResultStatus(false);
    this.props.changeSelectedResult(fromJS({}));
  }

  onCloseCountrySelectModal() {
    const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
    const code = this.props.store.getIn(['curData', 'radioList', radioId, 'countryCode']);
    this.props.closeCountrySelectModal(code);
  }

  onModalOkBtnClick() {
    const {
      mac, ssid, security, frequency, channelWidth,
    } = this.props.selfState.get('selectedResult').toJS();
    const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
    let peers = this.props.store.getIn(['curData', 'radioList', radioId, 'peers']);
    if (!this.props.selfState.get('selectedResult').isEmpty()) {
      if (this.props.store.getIn(['curData', 'radioList', radioId, 'wirelessMode']) === 'repeater') {
        peers = peers.set(0, mac);
      }
      const saveData = this.props.store.getIn(['curData', 'radioList', radioId]).merge(fromJS({
        apMac: mac,
        peers,
        ssid,
        security: fromJS(security).set('key', ''),
        frequency,
        channelWidth,
      }));
      const radioList = this.props.store.getIn(['curData', 'radioList']).set(radioId, saveData);
      this.props.updateItemSettings({
        radioList,
        scanResult: fromJS({}),
      });
      this.props.changeShowScanResultStatus(false);
      this.props.changeSelectedResult(fromJS({}));
    }
  }

  // 当准备改变步骤时
  onBeforeStep(data) {
    // 下一页
    if (data.currStep === 1 && data.targetStep === 2) {
      const { ip, mask } = this.props.store.get('curData').toJS();
      const msg = validator.combine.noBroadcastIp(ip, mask);
      // console.log('ip&mask', ip + ',' + mask);
      if (msg) {
        return msg;
      }
    }

    if (data.currStep < data.targetStep) {
      return this.props.validateAll()
        .then((msg) => {
          if (!msg.isEmpty()) {
            return ' ';
          }
        });
    }
  }

  // 当点完成时处理函数
  onCompleted() {
    const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
    const { ip, mask } = this.props.store.getIn(['curData']).toJS();
    const saveData = this.props.store.getIn(['curData', 'radioList', radioId])
                      .set('ip', ip).set('mask', mask);
    this.props.save('goform/set_quicksetup', saveData);
  }

  onChangeRadio(data) { // 注意参数实际是data的value属性，这里表示radio序号
    const radioType = this.props.product.getIn(['deviceRadioList', data.value, 'radioType']);
    const config = fromJS({
      radioId: data.value,
      radioType,
    });
    this.props.changeCurrRadioConfig(config);
  }

  onChangeWirelessMode(data) {
    this.props.fetchSettings().then(() => {
      this.props.changeDeviceMode(data.value);
      const radioList = this.props.store.getIn(['curData', 'radioList'])
                        .map(item => item.set('wirelessMode', data.value));
      this.props.updateItemSettings({ radioList });
    }).then(() => {
      this.handleWrongSecurMode();
    });
  }

  makeChannelOptions() {
    const channelList = this.props.selfState.get('channels');
    // const channelOptions = [{ value: 'auto', label: 'auto' }];

    const channelOptions = channelList.map(val => ({
      value: parseInt(val, 10).toString(),
      label: val,
    }))
    .unshift({ value: 'auto', label: 'auto' })
    .toJS();
    return channelOptions;
  }

  firstInAndRefresh() {
    const props = this.props;
    props.initSettings({
      settingId: props.route.id,
      fetchUrl: props.route.fetchUrl,
      saveUrl: props.route.saveUrl,
      defaultData: defaultState,
    });
    this.onChangeRadio({ value: '0' });
    props.changeAgreeProtocol(false);
    props.fetchSettings()
      .then(() => {
        const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
        const wirelessMode = this.props.store.getIn(['curData', 'radioList', radioId, 'wirelessMode']);
        // const security = this.props.store.getIn(['curData', 'radioList', radioId, 'security']);
        this.props.changeDeviceMode(wirelessMode);
        this.getChannelListAndPowerRange(radioId);
        // const requestInfo = {
        //   radio: this.props.selfState.getIn(['currRadioConfig', 'radioType']),
        //   country: this.props.store.getIn(['curData', 'radioList', radioId, 'countryCode']),
        //   channelWidth: this.props.store.getIn(['curData', 'radioList', radioId, 'channelWidth']),
        // };
        // props.fetch('goform/get_country_info', requestInfo).then((json) => {
        //   if (json.state && json.state.code === 2000) {
        //     this.props.receiveCountryInfo(json.data);
        //   }
        // });
        this.handleWrongSecurMode();
        // const security = props.store.getIn(['curData', 'radioList', radioId, 'security']);
        // if (!security) {
        //   this.updateItemInRadioList('security', fromJS({ mode: 'none' }));
        // }
      });
    props.resetVaildateMsg();
  }

  getChannelListAndPowerRange(radioId) {
    const radioType = this.props.selfState.getIn(['currRadioConfig', 'radioType']);
    const radiomode = this.props.store.getIn(['curData', 'radioList', radioId, 'radioMode']);
    const country = this.props.store.getIn(['curData', 'radioList', radioId, 'countryCode']);
    let channelwidth = this.props.store.getIn(['curData', 'radioList', radioId, 'channelWidth']);
    const frequency = this.props.store.getIn(['curData', 'radioList', radioId, 'frequency']); // 当前信道
    if ((radioType === '2.4G' && radiomode !== '11ng') || (radioType === '5G' && radiomode === '11a')) {
      channelwidth = '';
    }
    const saveInfo = { radioId, country, channelwidth, radiomode };
    this.props.fetch('goform/get_country_info', saveInfo).then((json2) => {
      if (json2.state && json2.state.code === 2000) {
        this.props.receiveCountryInfo(json2.data);
        // 如果返回的信道列表没有当前信道，则将信道置为auto
        if (json2.data.channels.indexOf(frequency) === -1) {
          const radioList = this.props.store.getIn(['curData', 'radioList']).setIn([radioId, 'frequency'], 'auto');
          this.props.updateItemSettings({ radioList });
        }
      }
    });
  }

  updateItemInRadioList(name, value) {
    const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
    const radioList = this.props.store.getIn(['curData', 'radioList'])
                          .setIn([radioId, name], value);
    this.props.updateItemSettings({ radioList });
  }

  handleWrongSecurMode() {
    const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
    const wirelessMode = this.props.store.getIn(['curData', 'radioList', radioId, 'wirelessMode']);
    const security = this.props.store.getIn(['curData', 'radioList', radioId, 'security']);
    if (!security) {
      this.updateItemInRadioList('security', fromJS({ mode: 'none' }));
    }
    if (security && security.get('mode') !== 'wep' && wirelessMode === 'repeater') {
      this.updateItemInRadioList('security', fromJS({ mode: 'none' }));
    }
  }

  renderOperationMode() {
    return (
      <div className="firstScreen" style={{ minWidth: '866px' }}>
        <div className="clearfix">
          <div
            className="cols"
            style={{
              width: '80%',
              marginTop: '15px',
            }}
          >
            <div
              className="cols cols-5"
              style={{
                marginRight: '65px',
              }}
            >
              <FormGroup
                type="radio"
                text="AP"
                value="ap"
                checked={this.props.selfState.get('deviceMode') === 'ap'}
                name="modeSelect"
                onChange={data => this.onChangeWirelessMode(data)}
              />
            </div>
            <div
              className="cols col-7"
            >
              {__('This device connected to a router on ethernet port and allow other devices to connect to it wirelessly.')}
            </div>
          </div>
        </div>
        <div
          className="clearfix"
        >
          <div
            className="cols"
            style={{
              width: '80%',
              marginTop: '20px',
            }}
          >
            <div
              className="cols cols-5"
              style={{
                marginRight: '40px',
              }}
            >
              <FormGroup
                type="radio"
                value="sta"
                text="Station"
                name="modeSelect"
                checked={this.props.selfState.get('deviceMode') === 'sta'}
                onChange={data => this.onChangeWirelessMode(data)}
              />
            </div>
            <div
              className="cols col-7"
            >
              {__('This device is wirelessly connected to a AP or a wireless router, and allows another device  to connect to it via wire.')}
            </div>
          </div>
        </div>
        <div
          className="clearfix"
        >
          <div
            className="cols"
            style={{
              width: '80%',
              marginTop: '20px',
            }}
          >
            <div
              className="cols cols-5"
              style={{
                marginRight: '28px',
              }}
            >
              <FormGroup
                type="radio"
                value="repeater"
                text="Repeater"
                name="modeSelect"
                checked={this.props.selfState.get('deviceMode') === 'repeater'}
                onChange={data => this.onChangeWirelessMode(data)}
              />
            </div>
            <div
              className="cols col-7"
            >
              {__('This device is wirelessly connected to  AP or a wireless router, and allows other wireless clients to connect to it. It extends the reach of your wireless network.')}
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderStepTwo() {
    const store = this.props.store;
    // const { deviceMode } = this.props.selfState.toJS();
    const { ip, mask } = store.get('curData').toJS();
    const { lanIp, lanMask } = this.props.validateOption;

    return (
      <div className="secondScreen">
        <FormGroup
          label={__('IP Address')}
          type="text"
          value={ip}
          onChange={data => this.props.updateItemSettings({
            ip: data.value,
          })}
          {...lanIp}
          required
        />
        <FormGroup
          label={__('Subnet Mask')}
          type="text"
          value={mask}
          onChange={data => this.props.updateItemSettings({
            mask: data.value,
          })}
          {...lanMask}
          required
        />
      </div>
    );
  }

  renderStepThree() {
    const modalOptions = fromJS([
      {
        id: 'operate',
        text: __('Select'),
        render: function (val, item) {
          return (
            <FormInput
              type="radio"
              name="selectScanItem"
              onChange={() => this.onSelectScanResultItem(item)}
            />
          );
        }.bind(this),
      },
      {
        id: 'mac',
        text: __('MAC'),
      },
      {
        id: 'ssid',
        text: __('SSID'),
      },
      {
        id: 'security',
        text: __('Security Mode'),
        render(val) {
          const mode = val.get('mode');
          if (mode === 'wpa') return 'WPA-PSK';
          else if (mode === 'wpa2') return 'WPA2-PSK';
          else if (mode === 'wpa-mixed') return 'WPA/WPA2-PSK';
          else if (mode === 'wep') return 'WEP';
          return mode;
        },
      },
      {
        id: 'signal',
        text: __('Signal'),
      },
      {
        id: 'noise',
        text: __('Noise'),
      },
      {
        id: 'protocol',
        text: __('Protocol'),
      },
      {
        id: 'frequency',
        text: __('Channel'),
      },
      {
        id: 'channelWidth',
        text: __('Channel Width'),
      },
    ]);
    const store = this.props.store;
    const { deviceMode } = this.props.selfState.toJS();
    const { radioId } = this.props.selfState.get('currRadioConfig').toJS();
    const {
      ssid, frequency, channelWidth, distance, autoAdjust, radioMode,
    } = store.getIn(['curData', 'radioList', radioId]).toJS();
    const mode = store.getIn(['curData', 'radioList', radioId, 'security', 'mode']);
    const key = store.getIn(['curData', 'radioList', radioId, 'security', 'key']);
    const Authentication = store.getIn(['curData', 'radioList', radioId, 'security', 'Authentication']);
    const keyLength = store.getIn(['curData', 'radioList', radioId, 'security', 'keyLength']);
    const keyType = store.getIn(['curData', 'radioList', radioId, 'security', 'keyType']);
    const keyIndex = store.getIn(['curData', 'radioList', radioId, 'security', 'keyIndex']);
    // const cipher = store.getIn(['curData', 'radioList', radioId, 'security', 'cipher']);
    const { validSsid, validPassword, apmac3, staApmac, validDistance } = this.props.validateOption;

    return (
      <div className="thirdScreen">
        {
          deviceMode === 'ap' ? (
            <div className="thirdForAp">
              <FormGroup
                type="text"
                label={__('SSID')}
                value={ssid}
                onChange={data => this.updateItemInRadioList('ssid', data.value)}
                required
                {...validSsid}
              />
              <FormGroup
                label={__('Country')}
              >
                <FormInput
                  type="text"
                  value={getCountryNameFromCode(
                    store.getIn(['curData', 'radioList', radioId, 'countryCode']),
                    countryMap,
                  )}
                  disabled
                  style={{
                    width: '127px',
                  }}
                />
                <Button
                  text={__('Change')}
                  style={{
                    marginLeft: '-1px',
                    width: '70px',
                  }}
                  onClick={() => { this.props.changeCtyModal(true); }}
                />
              </FormGroup>
              <Modal
                title={__('Country')}
                onClose={this.onCloseCountrySelectModal}
                onOk={this.props.saveCountrySelectModal}
                isShow={this.props.selfState.get('showCtyModal')}
                draggable
              >
                <h3>{__('User Protocol')}</h3>
                <span>
                  {__('The initial Wi-Fi setup requires you to specify the country code for the country in which the AP operates. Configuring a country code ensures the radio’s frequency bands, channels, and transmit power levels are compliant with country-specific regulations.')}
                </span>
                <FormGroup
                  type="radio"
                  text={__('I have read and agree')}
                  checked={this.props.selfState.get('agreeProtocol')}
                  onClick={() => { this.props.changeAgreeProtocol(true); }}
                />
                <FormGroup
                  label={__('Country')}
                  type="select"
                  options={makeCountryOptions(countryMap)}
                  value={this.props.selfState.get('selectedCountry') ||
                        store.getIn(['curData', 'radioList', radioId, 'countryCode'])}
                  onChange={data => this.props.changeCountryCode(data.value)}
                  disabled={!this.props.selfState.get('agreeProtocol')}
                />
              </Modal>
              {
                radioMode === '11na' ? (
                  <FormGroup
                    type="switch"
                    label={__('Channel Width')}
                    minWidth="66px"
                    options={channelWidthOptions.slice(0, 3)}
                    value={channelWidth}
                    onChange={(data) => {
                      Promise.resolve().then(() => {
                        this.updateItemInRadioList('channelWidth', data.value);
                      }).then(() => {
                        this.getChannelListAndPowerRange(radioId);
                      });
                    }}
                  />
                ) : null
              }
              {
                radioMode === '11ac' ? (
                  <FormGroup
                    type="switch"
                    label={__('Channel Width')}
                    minWidth="50px"
                    options={channelWidthOptions}
                    value={channelWidth}
                    onChange={(data) => {
                      Promise.resolve().then(() => {
                        this.updateItemInRadioList('channelWidth', data.value);
                      }).then(() => {
                        this.getChannelListAndPowerRange(radioId);
                      });
                    }}
                  />
                ) : null
              }
              <FormGroup
                type="select"
                label={__('Channel')}
                options={this.makeChannelOptions()}
                value={frequency}
                onChange={data => this.updateItemInRadioList('frequency', data.value)}
              />
              <FormGroup
                type="select"
                label={__('Security')}
                options={staAndApSecurityOptions}
                value={mode}
                onChange={(data) => {
                  const security = fromJS({
                    mode: data.value,
                    cipher: store.getIn(['curData', 'radioList', radioId, 'security', 'cipher']) || 'aes',
                    Authentication: store.getIn(['curData', 'radioList', radioId, 'security', 'Authentication']) || 'open',
                    keyIndex: store.getIn(['curData', 'radioList', radioId, 'security', 'keyIndex']) || '1',
                    keyLength: store.getIn(['curData', 'radioList', radioId, 'security', 'keyLength']) || '64',
                    keyType: store.getIn(['curData', 'radioList', radioId, 'security', 'keyType']) || 'Hex',
                    key: '',
                  });
                  this.updateItemInRadioList('security', security);
                }}
              />
              {
                /wpa/.test(store.getIn(['curData', 'radioList', radioId, 'security', 'mode'])) ? (
                  <div>
                    <FormGroup
                      label={__('Encryption')}
                      minWidth="66px"
                      type="switch"
                      value={store.getIn(['curData', 'radioList', radioId, 'security', 'cipher'])}
                      onChange={(data) => {
                        const security = fromJS({
                          mode,
                          key,
                          cipher: data.value,
                        });
                        this.updateItemInRadioList('security', security);
                      }}
                      options={[
                        { label: 'AES', value: 'aes' },
                        { label: 'TKIP', value: 'tkip' },
                        { label: 'MIXED', value: 'aes&tkip' },
                      ]}
                    />
                    <FormGroup
                      type="password"
                      label={__('Password')}
                      value={key}
                      onChange={(data) => {
                        const security = fromJS({
                          mode,
                          key: data.value,
                          cipher: store.getIn(['curData', 'radioList', radioId, 'security', 'cipher']) || 'aes',
                        });
                        this.updateItemInRadioList('security', security);
                      }}
                      required
                      {...validPassword}
                    />
                  </div>
                ) : null
              }
              {
                  (store.getIn(['curData', 'radioList', radioId, 'security', 'mode']) === 'wep') ? (
                    <div>
                      <FormGroup
                        label={__('Authentication Type')}
                        type="switch"
                        options={wepAuthenOptions}
                        value={store.getIn(['curData', 'radioList', radioId, 'security', 'Authentication'])}
                        onChange={(data) => {
                          const security = store.getIn(['curData', 'radioList', radioId, 'security'])
                                                .set('Authentication', data.value);
                          this.updateItemInRadioList('security', security);
                        }}
                        minWidth="65px"
                      />
                      {/*
                        <FormGroup
                          label={__('Key Length')}
                          type="select"
                          options={wepKeyLengthOptions}
                          value={curData.getIn(['vapList', '0', 'security', 'keyLength'])}
                          onChange={(data) => {
                            const security = curData.getIn(['vapList', '0', 'security'])
                                            .set('keyLength', data.value);
                            const vapList = curData.get('vapList')
                                            .setIn(['0', 'security'], security);
                            this.props.updateItemSettings({ vapList });
                          }}
                        />
                      */}
                      <FormGroup
                        label={__('Key Format')}
                        type="switch"
                        options={keyTypeOptions}
                        value={store.getIn(['curData', 'radioList', radioId, 'security', 'keyType'])}
                        onChange={(data) => {
                          const security = store.getIn(['curData', 'radioList', radioId, 'security'])
                                                  .set('keyType', data.value);
                          this.updateItemInRadioList('security', security);
                        }}
                        minWidth="65px"
                      />
                      <FormGroup
                        label={__('Key Index')}
                        type="select"
                        options={keyIndexOptions}
                        value={store.getIn(['curData', 'radioList', radioId, 'security', 'keyIndex'])}
                        onChange={(data) => {
                          const security = store.getIn(['curData', 'radioList', radioId, 'security'])
                                          .set('keyIndex', data.value);
                          this.updateItemInRadioList('security', security);
                        }}
                      />
                      <FormGroup
                        type="password"
                        required
                        label={__('Password')}
                        value={store.getIn(['curData', 'radioList', radioId, 'security', 'key'])}
                        onChange={(data) => {
                          const security = store.getIn(['curData', 'radioList', radioId, 'security'])
                                                  .set('key', data.value);
                          this.updateItemInRadioList('security', security);
                        }}
                        {...this.props.validateOption[store.getIn(['curData', 'radioList', radioId, 'security', 'keyType'])]}
                      />
                    </div>
                  ) : null
              }
              <div className="clearfix">
                <FormGroup
                  type="number"
                  className="fl"
                  label={__('Distance')}
                  value={distance}
                  min="1"
                  max="10"
                  step="0.1"
                  hasTextInput
                  help="km"
                  disabled={autoAdjust === '1'}
                  onChange={(data) => {
                    this.updateItemInRadioList('distance', data.value);
                  }}
                  required
                  {...validDistance}
                />
                <span
                  className="fl"
                  style={{
                    marginTop: '12px',
                    marginLeft: '4px',
                  }}
                >
                  <label htmlFor="distance">
                    <input
                      id="distance"
                      type="checkbox"
                      checked={autoAdjust === '1'}
                      onClick={() => { this.updateItemInRadioList('autoAdjust', autoAdjust === '1' ? '0' : '1'); }}
                      style={{ marginRight: '3px' }}
                    />
                    {__('auto')}
                  </label>
                </span>
              </div>
            </div>
          ) : null
        }

        {
          deviceMode === 'sta' ? (
            <div className="thirdForSta">
              <div className="clearfix">
                <div className="clearfix">
                  <div
                    style={{
                      width: '205px',
                    }}
                  >
                    <FormGroup
                      label="SSID"
                      className="fl"
                      type="text"
                      required
                      value={ssid}
                      onChange={data => this.updateItemInRadioList('ssid', data.value)}
                      {...validSsid}
                    />
                  </div>
                  <span className="fl">
                    <span>
                      {
                        this.props.selfState.get('scaning') ? (
                          <Button
                            text={__('Stop')}
                            onClick={this.onStopScanClick}
                            loading
                          />
                        ) : (
                          <Button
                            text={__('Scan')}
                            onClick={this.onScanBtnClick}
                          />
                        )
                      }
                    </span>
                    <Modal
                      isShow={this.props.selfState.get('showScanResult')}
                      onOk={this.onModalOkBtnClick}
                      onClose={this.onModalCloseBtnClick}
                      okText={__('Select')}
                      cancelText={__('Cancel')}
                      size="lg"
                      okButton
                      cancelButton
                      draggable
                    >
                      <Table
                        className="table"
                        options={modalOptions}
                        list={store.getIn(['curData', 'scanResult', 'siteList'])}
                      />
                    </Modal>
                  </span>
                </div>
              </div>
              <FormGroup
                label={__('Lock To AP')}
                type="checkbox"
                checked={store.getIn(['curData', 'radioList', radioId, 'apMacEnable']) === '1'}
                onChange={data => this.updateItemInRadioList('apMacEnable', data.value)}
              />
              {
                store.getIn(['curData', 'radioList', radioId, 'apMacEnable']) === '1' ? (
                  <FormGroup
                    label={__('Peer Mac')}
                    value={store.getIn(['curData', 'radioList', radioId, 'apMac'])}
                    onChange={data => this.updateItemInRadioList('apMac', data.value)}
                    {...staApmac}
                  />
                ) : null
              }
              <FormGroup
                label={__('Country')}
              >
                <FormInput
                  type="text"
                  value={getCountryNameFromCode(
                    store.getIn(['curData', 'radioList', radioId, 'countryCode']),
                    countryMap,
                  )}
                  disabled
                  style={{
                    width: '127px',
                    marginTop: '-3px',
                  }}
                />
                <Button
                  text={__('Change')}
                  style={{
                    marginLeft: '-1px',
                    width: '70px',
                  }}
                  onClick={() => { this.props.changeCtyModal(true); }}
                />
              </FormGroup>
              <Modal
                title={__('Country')}
                onClose={this.onCloseCountrySelectModal}
                onOk={this.props.saveCountrySelectModal}
                isShow={this.props.selfState.get('showCtyModal')}
                draggable
              >
                <h3>{__('User Protocol')}</h3>
                <span>
                  {__('The initial Wi-Fi setup requires you to specify the country code for the country in which the AP operates. Configuring a country code ensures the radio’s frequency bands, channels, and transmit power levels are compliant with country-specific regulations.')}
                </span>
                <FormGroup
                  type="radio"
                  text={__('I have read and agree')}
                  checked={this.props.selfState.get('agreeProtocol')}
                  onClick={() => { this.props.changeAgreeProtocol(true); }}
                />
                <FormGroup
                  label={__('Country')}
                  type="select"
                  options={makeCountryOptions(countryMap)}
                  value={this.props.selfState.get('selectedCountry')}
                  onChange={data => this.props.changeCountryCode(data.value)}
                  disabled={!this.props.selfState.get('agreeProtocol')}
                />
              </Modal>
              {
                radioMode === '11na' ? (
                  <FormGroup
                    type="switch"
                    label={__('Channel Width')}
                    minWidth="66px"
                    options={channelWidthOptions.slice(0, 3)}
                    value={channelWidth}
                    onChange={(data) => {
                      Promise.resolve().then(() => {
                        this.updateItemInRadioList('channelWidth', data.value);
                      }).then(() => {
                        this.getChannelListAndPowerRange(radioId);
                      });
                    }}
                  />
                ) : null
              }
              {
                radioMode === '11ac' ? (
                  <FormGroup
                    type="switch"
                    label={__('Channel Width')}
                    minWidth="50px"
                    options={channelWidthOptions}
                    value={channelWidth}
                    onChange={(data) => {
                      Promise.resolve().then(() => {
                        this.updateItemInRadioList('channelWidth', data.value);
                      }).then(() => {
                        this.getChannelListAndPowerRange(radioId);
                      });
                    }}
                  />
                ) : null
              }
              <FormGroup
                type="select"
                label={__('Channel')}
                options={this.makeChannelOptions()}
                value={frequency}
                onChange={data => this.updateItemInRadioList('frequency', data.value)}
              />
              <FormGroup
                type="select"
                label={__('Security')}
                options={staAndApSecurityOptions}
                value={mode}
                onChange={(data) => {
                  const security = fromJS({
                    mode: data.value,
                    cipher: store.getIn(['curData', 'radioList', radioId, 'security', 'cipher']) || 'aes',
                    Authentication: store.getIn(['curData', 'radioList', radioId, 'security', 'Authentication']) || 'open',
                    keyIndex: store.getIn(['curData', 'radioList', radioId, 'security', 'keyIndex']) || '1',
                    keyLength: store.getIn(['curData', 'radioList', radioId, 'security', 'keyLength']) || '64',
                    keyType: store.getIn(['curData', 'radioList', radioId, 'security', 'keyType']) || 'Hex',
                    key: '',
                  });
                  this.updateItemInRadioList('security', security);
                }}
              />
              {
                /wpa/.test(store.getIn(['curData', 'radioList', radioId, 'security', 'mode'])) ? (
                  <div>
                    <FormGroup
                      label={__('Encryption')}
                      minWidth="66px"
                      type="switch"
                      value={store.getIn(['curData', 'radioList', radioId, 'security', 'cipher'])}
                      onChange={(data) => {
                        const security = fromJS({
                          mode,
                          key,
                          cipher: data.value,
                        });
                        this.updateItemInRadioList('security', security);
                      }}
                      options={[
                        { label: 'AES', value: 'aes' },
                        { label: 'TKIP', value: 'tkip' },
                        { label: 'MIXED', value: 'aes&tkip' },
                      ]}
                    />
                    <FormGroup
                      type="password"
                      label={__('Password')}
                      value={key}
                      onChange={(data) => {
                        const security = fromJS({
                          mode,
                          key: data.value,
                          cipher: store.getIn(['curData', 'radioList', radioId, 'security', 'cipher']) || 'aes',
                        });
                        this.updateItemInRadioList('security', security);
                      }}
                      required
                      {...validPassword}
                    />
                  </div>
                ) : null
              }
              {
                (store.getIn(['curData', 'security', 'mode']) === 'wep') ? (
                  <div>
                    <FormGroup
                      label={__('Authentication Type')}
                      type="switch"
                      options={wepAuthenOptions}
                      value={store.getIn(['curData', 'radioList', radioId, 'security', 'Authentication'])}
                      onChange={(data) => {
                        const security = store.getIn(['curData', 'radioList', radioId, 'security'])
                                        .set('Authentication', data.value);
                        this.updateItemInRadioList('security', security);
                      }}
                      minWidth="65px"
                    />
                    {/*
                      <FormGroup
                        label={__('Key Length')}
                        type="select"
                        options={wepKeyLengthOptions}
                        value={curData.getIn(['vapList', '0', 'security', 'keyLength'])}
                        onChange={(data) => {
                          const security = curData.getIn(['vapList', '0', 'security'])
                                          .set('keyLength', data.value);
                          const vapList = curData.get('vapList')
                                          .setIn(['0', 'security'], security);
                          this.props.updateItemSettings({ vapList });
                        }}
                      />
                    */}
                    <FormGroup
                      label={__('Key Format')}
                      type="switch"
                      options={keyTypeOptions}
                      value={store.getIn(['curData', 'radioList', radioId, 'security', 'keyType'])}
                      onChange={(data) => {
                        const security = store.getIn(['curData', 'radioList', radioId, 'security'])
                                                .set('keyType', data.value);
                        this.updateItemInRadioList('security', security);
                      }}
                      minWidth="65px"
                    />
                    <FormGroup
                      label={__('Key Index')}
                      type="select"
                      options={keyIndexOptions}
                      value={store.getIn(['curData', 'radioList', radioId, 'security', 'keyIndex'])}
                      onChange={(data) => {
                        const security = store.getIn(['curData', 'radioList', radioId, 'security'])
                                        .set('keyIndex', data.value);
                        this.updateItemInRadioList('security', security);
                      }}
                    />
                    <FormGroup
                      type="password"
                      required
                      label={__('Password')}
                      value={store.getIn(['curData', 'radioList', radioId, 'security', 'key'])}
                      onChange={(data) => {
                        const security = store.getIn(['curData', 'radioList', radioId, 'security'])
                                                .set('key', data.value);
                        this.updateItemInRadioList('security', security);
                      }}
                      {...this.props.validateOption[store.getIn(['curData', 'radioList', radioId, 'security', 'keyType'])]}
                    />
                  </div>
                ) : null
              }
              <div className="clearfix">
                <FormGroup
                  type="number"
                  className="fl"
                  label={__('Distance')}
                  value={distance}
                  min="1"
                  max="10"
                  step="0.1"
                  help="km"
                  disabled={autoAdjust === '1'}
                  onChange={(data) => {
                    this.updateItemInRadioList('distance', data.value);
                  }}
                />
                <span
                  className="fl"
                  style={{
                    marginTop: '12px',
                    marginLeft: '4px',
                  }}
                >
                  <label htmlFor="distance">
                    <input
                      id="distance"
                      type="checkbox"
                      checked={autoAdjust === '1'}
                      onClick={() => this.updateItemInRadioList('autoAdjust', autoAdjust === '1' ? '0' : '1')}
                      style={{ marginRight: '3px' }}
                    />
                    {__('auto')}
                  </label>
                </span>
              </div>
            </div>
          ) : null
        }

        {
          deviceMode === 'repeater' ? (
            <div className="thirdForRepeater">
              <div className="clearfix">
                <div className="clearfix">
                  <div
                    style={{
                      width: '205px',
                    }}
                  >
                    <FormGroup
                      label="SSID"
                      className="fl"
                      type="text"
                      required
                      value={ssid}
                      onChange={data => this.updateItemInRadioList('ssid', data.value)}
                      {...validSsid}
                    />
                  </div>
                  <span className="fl">
                    <span>
                      {
                        this.props.selfState.get('scaning') ? (
                          <Button
                            text={__('Stop')}
                            onClick={this.onStopScanClick}
                            loading
                          />
                        ) : (
                          <Button
                            text={__('Scan')}
                            onClick={this.onScanBtnClick}
                          />
                        )
                      }
                    </span>
                    <Modal
                      isShow={this.props.selfState.get('showScanResult')}
                      onOk={this.onModalOkBtnClick}
                      onClose={this.onModalCloseBtnClick}
                      okText={__('Select')}
                      cancelText={__('Cancel')}
                      size="lg"
                      okButton
                      cancelButton
                      draggable
                    >
                      <Table
                        className="table"
                        options={modalOptions}
                        list={store.getIn(['curData', 'scanResult', 'siteList'])}
                      />
                    </Modal>
                  </span>
                </div>
              </div>

              <FormGroup
                label={__('Peer MAC')}
                type="text"
                required
                value={store.getIn(['curData', 'radioList', radioId, 'peers', 0])}
                onChange={(data) => {
                  const peers = store.getIn(['curData', 'radioList', radioId, 'peers']).set(0, data.value);
                  this.updateItemInRadioList('peers', peers);
                }}
                {...apmac3}
              />
              <FormGroup
                label={__('Country')}
              >
                <FormInput
                  type="text"
                  value={getCountryNameFromCode(
                    store.getIn(['curData', 'radioList', radioId, 'countryCode']),
                    countryMap,
                  )}
                  disabled
                  style={{
                    width: '127px',
                    marginTop: '-3px',
                  }}
                />
                <Button
                  text={__('Change')}
                  style={{
                    marginLeft: '3px',
                    width: '70px',
                  }}
                  onClick={() => { this.props.changeCtyModal(true); }}
                />
              </FormGroup>
              <Modal
                title={__('Country')}
                onClose={this.onCloseCountrySelectModal}
                onOk={this.props.saveCountrySelectModal}
                isShow={this.props.selfState.get('showCtyModal')}
                draggable
              >
                <h3>{__('User Protocol')}</h3>
                <span>
                  {__('The initial Wi-Fi setup requires you to specify the country code for the country in which the AP operates. Configuring a country code ensures the radio’s frequency bands, channels, and transmit power levels are compliant with country-specific regulations.')}
                </span>
                <FormGroup
                  type="radio"
                  text={__('I have read and agree')}
                  checked={this.props.selfState.get('agreeProtocol')}
                  onClick={() => { this.props.changeAgreeProtocol(true); }}
                />
                <FormGroup
                  label={__('Country')}
                  type="select"
                  options={makeCountryOptions(countryMap)}
                  value={this.props.selfState.get('selectedCountry')}
                  onChange={data => this.props.changeCountryCode(data.value)}
                  disabled={!this.props.selfState.get('agreeProtocol')}
                />
              </Modal>
              {
                radioMode === '11na' ? (
                  <FormGroup
                    type="switch"
                    label={__('Channel Width')}
                    minWidth="66px"
                    options={channelWidthOptions.slice(0, 3)}
                    value={channelWidth}
                    onChange={(data) => {
                      Promise.resolve().then(() => {
                        this.updateItemInRadioList('channelWidth', data.value);
                      }).then(() => {
                        this.getChannelListAndPowerRange(radioId);
                      });
                    }}
                  />
                ) : null
              }
              {
                radioMode === '11ac' ? (
                  <FormGroup
                    type="switch"
                    label={__('Channel Width')}
                    minWidth="50px"
                    options={channelWidthOptions}
                    value={channelWidth}
                    onChange={(data) => {
                      Promise.resolve().then(() => {
                        this.updateItemInRadioList('channelWidth', data.value);
                      }).then(() => {
                        this.getChannelListAndPowerRange(radioId);
                      });
                    }}
                  />
                ) : null
              }
              <FormGroup
                type="select"
                label={__('Channel')}
                options={this.makeChannelOptions()}
                value={frequency}
                onChange={data => this.updateItemInRadioList('frequency', data.value)}
              />
              <FormGroup
                type="select"
                label={__('Security')}
                value={mode}
                options={repeaterSecurityOptions}
                onChange={(data) => {
                  const security = fromJS({
                    mode: data.value,
                    Authentication: store.getIn(['curData', 'radioList', radioId, 'security', 'Authentication']) || 'open',
                    keyLength: store.getIn(['curData', 'radioList', radioId, 'security', 'keyLength']) || '64',
                    keyIndex: store.getIn(['curData', 'radioList', radioId, 'security', 'keyIndex']) || '1',
                    keyType: store.getIn(['curData', 'radioList', radioId, 'security', 'keyType']) || 'Hex',
                    key: '',
                  });
                  this.updateItemInRadioList('security', security);
                }}
              />
              {
                store.getIn(['curData', 'radioList', radioId, 'security', 'mode']) === 'none' ? null : (
                  <div>
                    <FormGroup
                      label={__('Authentication Type')}
                      type="switch"
                      options={wepAuthenOptions}
                      value={Authentication}
                      onChange={(data) => {
                        const security = fromJS({
                          mode,
                          Authentication: data.value,
                          keyLength,
                          keyType,
                          key,
                          keyIndex,
                        });
                        this.updateItemInRadioList('security', security);
                      }}
                      minWidth="65px"
                    />
                    {/*
                      <FormGroup
                        label={__('WEP Key Length')}
                        type="switch"
                        options={wepKeyLengthOptions}
                        value={keyLength}
                        onChange={(data) => this.props.updateItemSettings({
                          security: {
                            mode,
                            Authentication,
                            keyLength: data.value,
                            keyType,
                            key,
                            keyIndex,
                          },
                        })}
                        minWidth="65px"
                      />
                    */}

                    <FormGroup
                      label={__('Key Format')}
                      type="switch"
                      options={keyTypeOptions}
                      value={keyType}
                      onChange={(data) => {
                        const security = fromJS({
                          mode,
                          Authentication,
                          keyLength,
                          keyType: data.value,
                          key,
                          keyIndex,
                        });
                        this.updateItemInRadioList('security', security);
                      }}
                      minWidth="65px"
                    />
                    <FormGroup
                      label={__('Key Index')}
                      type="select"
                      options={keyIndexOptions}
                      value={keyIndex}
                      onChange={(data) => {
                        const security = fromJS({
                          mode,
                          Authentication,
                          keyLength,
                          keyType,
                          key,
                          keyIndex: data.value,
                        });
                        this.updateItemInRadioList('security', security);
                      }}
                    />
                    <FormGroup
                      type="password"
                      label={__('Password')}
                      value={key || ''}
                      required
                      onChange={(data) => {
                        const security = fromJS({
                          mode,
                          Authentication,
                          keyLength,
                          keyType,
                          key: data.value,
                          keyIndex,
                        });
                        this.updateItemInRadioList('security', security);
                      }}
                      {...this.props.validateOption[keyType]}
                    />
                  </div>
                )
              }
              <div className="clearfix">
                <FormGroup
                  type="number"
                  className="fl"
                  label={__('Distance')}
                  value={distance}
                  min="1"
                  max="10"
                  step="0.1"
                  help="km"
                  disabled={autoAdjust === '1'}
                  onChange={(data) => {
                    this.updateItemInRadioList('distance', data.value);
                  }}
                />
                <span
                  className="fl"
                  style={{
                    marginTop: '12px',
                    marginLeft: '4px',
                  }}
                >
                  <label htmlFor="distance">
                    <input
                      id="distance"
                      type="checkbox"
                      checked={autoAdjust === '1'}
                      onClick={() => this.updateItemInRadioList('autoAdjust', autoAdjust === '1' ? '0' : '1')}
                      style={{ marginRight: '3px' }}
                    />
                    {__('auto')}
                  </label>
                </span>
              </div>
            </div>
          ) : null
        }
      </div>
    );
  }

  renderStepFour() {
    const store = this.props.store;
    const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
    const { deviceMode } = this.props.selfState.toJS();
    const { ip, mask } = this.props.store.get('curData').toJS();
    const { ssid, countryCode, frequency, channelWidth, distance } = store.getIn(['curData', 'radioList', radioId]).toJS();
    const mode = store.getIn(['curData', 'radioList', radioId, 'security', 'mode']);
    const cipher = store.getIn(['curData', 'radioList', radioId, 'security', 'cipher']);

    return (
      <div className="fourthScreen">
        {
          deviceMode === 'ap' ? (
            <div className="fourthForAp row">
              <div className="cols col-5">
                <FormGroup
                  type="plain-text"
                  label={__('Current Mode')}
                  value="AP"
                />
                <FormGroup
                  type="plain-text"
                  label={__('LAN IP')}
                  value={ip}
                />
                <FormGroup
                  type="plain-text"
                  label={__('Subnet Mask')}
                  value={mask}
                />

                <FormGroup
                  type="plain-text"
                  label={__('SSID')}
                  value={ssid}
                />
                <FormGroup
                  type="plain-text"
                  label={__('Country')}
                  value={getCountryNameFromCode(countryCode, countryMap)}
                />
              </div>
              <div className="cols col-7">
                <FormGroup
                  type="plain-text"
                  label={__('Channel Width')}
                  value={(() => {
                    if (channelWidth) {
                      return channelWidth.slice(2).concat('MHz');
                    }
                    return '';
                  })()
                  }
                />
                <FormGroup
                  type="plain-text"
                  label={__('Channel')}
                  value={frequency}
                />
                <FormGroup
                  type="plain-text"
                  label={__('Security')}
                  value={(() => {
                    if (mode !== undefined) {
                      if (mode === 'none') return mode;
                      return mode.concat('/').concat(cipher);
                    }
                    return '';
                  })()
                  }
                />
                <FormGroup
                  type="plain-text"
                  label={__('Distance')}
                  value={distance}
                />
              </div>
            </div>
          ) : null
        }

        {
          deviceMode === 'sta' ? (
            <div className="fourthForSta clearfix">
              <div className="cols col-5">
                <FormGroup
                  type="plain-text"
                  label={__('Current Mode')}
                  value="Station"
                />

                <FormGroup
                  type="plain-text"
                  label={__('LAN IP')}
                  value={ip}
                />
                <FormGroup
                  type="plain-text"
                  label={__('Subnet Mask')}
                  value={mask}
                />
                <FormGroup
                  type="plain-text"
                  label={__('SSID')}
                  value={ssid}
                />
                <FormGroup
                  type="plain-text"
                  label={__('Country')}
                  value={getCountryNameFromCode(countryCode, countryMap)}
                />
              </div>
              <div className="cols col-7">
                <FormGroup
                  type="plain-text"
                  label={__('Peer MAC')}
                  value={store.getIn(['curData', 'radioList', radioId, 'apMac'])}
                />
                <FormGroup
                  type="plain-text"
                  label={__('Channel Width')}
                  value={(() => {
                    if (channelWidth) {
                      return channelWidth.slice(2).concat('MHz');
                    }
                    return '';
                  })()
                  }
                />
                <FormGroup
                  type="plain-text"
                  label={__('Channel')}
                  value={frequency}
                />
                <FormGroup
                  type="plain-text"
                  label={__('Security')}
                  value={(() => {
                    if (mode !== undefined) {
                      if (mode === 'none') return mode;
                      return mode.concat('/').concat(cipher);
                    }
                    return '';
                  })()
                  }
                />
                <FormGroup
                  type="plain-text"
                  label={__('Distance')}
                  value={distance}
                />
              </div>
            </div>
          ) : null
        }

        {
          deviceMode === 'repeater' ? (
            <div className="fourthForRepeater clearfix">
              <div className="cols col-5">
                <FormGroup
                  type="plain-text"
                  label={__('Current Mode')}
                  value="Repeater"
                />
                <FormGroup
                  type="plain-text"
                  label={__('LAN IP')}
                  value={ip}
                />
                <FormGroup
                  type="plain-text"
                  label={__('Subnet Mask')}
                  value={mask}
                />

                <FormGroup
                  type="plain-text"
                  label={__('SSID')}
                  value={ssid}
                />
                <FormGroup
                  type="plain-text"
                  label={__('Country')}
                  value={getCountryNameFromCode(countryCode, countryMap)}
                />
              </div>
              <div className="cols col-7">
                <FormGroup
                  type="plain-text"
                  label={__('Channel Width')}
                  value={(() => {
                    if (channelWidth) {
                      return channelWidth.slice(2).concat('MHz');
                    }
                    return '';
                  })()
                  }
                />
                <FormGroup
                  type="plain-text"
                  label={__('Channel')}
                  value={frequency}
                />
                <FormGroup
                  type="plain-text"
                  label={__('Security')}
                  value={(() => {
                    if (mode !== undefined) {
                      if (mode === 'none' || mode === 'wep') return mode;
                      return mode.concat('/').concat(cipher);
                    }
                    return 'none';
                  })()
                  }
                />
                <FormGroup
                  type="plain-text"
                  label={__('Distance')}
                  value={distance}
                />
              </div>
            </div>
          ) : null
        }
      </div>
    );
  }

  render() {
    // const store = this.props.store;
    const { deviceMode } = this.props.selfState.toJS();
    let wizardOptions = fromJS([
      {
        title: __('Operation Mode'),
        render: this.renderOperationMode,
      }, {
        title: __('LAN Settings'),
        render: this.renderStepTwo,
      }, {
        title: __('Wireless Settings'),
        render: this.renderStepThree,
      }, {
        title: __('Confirm Settings'),
        render: this.renderStepFour,
      },
    ]);
    const titleMap = {
      ap: __('Scene: AP'),
      sta: __('Scene: Station'),
      repeater: __('Scene: Repeater'),
    };
    if (deviceMode) {
      wizardOptions = wizardOptions.setIn(
        [0, 'title'],
        titleMap[deviceMode],
      );
    }

    return (
      <div className="wrapall">
        <WizardContainer
          size="sm"
          title={__('Quick Setup')}
          options={wizardOptions}
          onBeforeStep={this.onBeforeStep}
          onCompleted={this.onCompleted}
          reinitAt={this.props.selfState.get('reinitAt')}
          saving={this.props.app.get('saving')}
        />
      </div>
    );
  }
}

QuickSetup.propTypes = propTypes;
QuickSetup.defaultState = defaultState;

function mapStateToProps(state) {
  return {
    app: state.app,
    store: state.settings,
    selfState: state.quicksetup,
    product: state.product,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    utils.extend({}, appActions, settingActions, selfActions),
    dispatch,
  );
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
  validator.mergeProps(validOptions),
)(QuickSetup);

export const quicksetup = reducer;
