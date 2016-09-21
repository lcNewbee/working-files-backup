import React, { PropTypes } from 'react';
import { fromJS, Map } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import validator from 'shared/utils/lib/validator';
import utils from 'shared/utils';
import { FormGroup, FormInput, SaveButton, Button, Modal, Table } from 'shared/components';
import * as appActions from 'shared/actions/app';
import * as settingActions from 'shared/actions/settings';
import * as selfActions from './actions.js';
import reducer from './reducer.js';
import countryMap from './country.js';

const propTypes = {
  app: PropTypes.instanceOf(Map),
  fetch: PropTypes.func,
  selfState: PropTypes.instanceOf(Map),
  changePage: PropTypes.func,
  fetchSettings: PropTypes.func,
  changeDeviceMode: PropTypes.func,
  validateAll: PropTypes.func,

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
  saveSettings: PropTypes.func,
};

const defaultState = {
  security: {
    mode: 'none',
  },
};

const channelWidthOptions = [
  { value: 'HT20', label: '20MHz' },
  { value: 'HT40', label: '40MHz' },
  { value: 'HT80', label: '80MHz' },
];

const staAndApSecurityOptions = [
  { value: 'none', label: 'None' },
  { value: 'wpa', label: 'WPA-PSK' },
  { value: 'wpa2', label: 'WPA2-PSK' },
  { value: 'wpa-mixed', label: 'WPA-PSK/WPA2-PSK' },
];

const repeaterSecurityOptions = [
  { value: 'none', label: 'None' },
  { value: 'wep', label: 'WEP' },
];

const wepAuthenOptions = [
  { value: 'open', label: 'Open' },
  { value: 'shared', label: 'Shared' },
];

const wepKeyLengthOptions = [
  { value: '64', label: '64bit' },
  { value: '128', label: '128bit' },
];

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
    rules: 'remarkTxt:["\'\\\\"]|len:[1, 31]',
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
});

export default class QuickSetup extends React.Component {
  constructor(props) {
    super(props);
    this.makeCountryOptions = this.makeCountryOptions.bind(this);
    this.getCountryNameFromCode = this.getCountryNameFromCode.bind(this);
    this.onScanBtnClick = this.onScanBtnClick.bind(this);
    this.onStopScanClick = this.onStopScanClick.bind(this);
    this.onSelectScanResultItem = this.onSelectScanResultItem.bind(this);
    this.onModalCloseBtnClick = this.onModalCloseBtnClick.bind(this);
    this.onModalOkBtnClick = this.onModalOkBtnClick.bind(this);
    this.onCloseCountrySelectModal = this.onCloseCountrySelectModal.bind(this);
  }

  componentWillMount() {
    const props = this.props;
    props.initSettings({
      settingId: props.route.id,
      fetchUrl: props.route.fetchUrl,
      saveUrl: props.route.saveUrl,
      defaultData: defaultState,
    });
    props.changePage('1');
    props.changeAgreeProtocol(false);
    props.fetchSettings();
    window.setTimeout(() => {
      const country = this.props.store.getIn(['curData', 'countryCode']);
      const channelWidth = this.props.store.getIn(['curData', 'channelWidth']);
      const requestInfo = {
        radio: '5G',
        country,
        channelWidth,
      };
      utils.fetch('goform/get_country_info', requestInfo)
            .then((json) => {
              if (json.state && json.state.code === 2000) {
                this.props.receiveCountryInfo(json.data);
              }
            });
    }, 0);
    props.resetVaildateMsg();
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
                  this.props.changeShowScanResultStatus(true);
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
    const code = this.props.store.getIn(['curData', 'countryCode']);
    console.log(code);
    this.props.closeCountrySelectModal(code);
  }

  onModalOkBtnClick() {
    const {
      mac, ssid, security, frequency, channelWidth,
    } = this.props.selfState.get('selectedResult').toJS();
    if (!this.props.selfState.get('selectedResult').isEmpty()) {
      this.props.updateItemSettings({
        apMac: mac,
        ssid,
        security,
        frequency,
        channelWidth,
        scanResult: fromJS({}),
      });
      this.props.changeShowScanResultStatus(false);
      this.props.changeSelectedResult(fromJS({}));
    }
  }

  getCountryNameFromCode(code, map) {
    for (const name of Object.keys(map)) {
      if (map[name] === code) {
        return name;
      }
    }
    return '';
  }

  noErrorThisPage(...args) {
    const errorMsg = this.props.app.get('invalid');
    let flag = true;
    if (errorMsg.isEmpty()) {
      return true;
    }
    for (const name of args) {
      if (errorMsg.has(name)) {
        flag = false;
      }
    }
    return flag;
  }

  // countryMap为Object
  makeCountryOptions(map) {
    console.log(map);
    const countryList = [];
    for (const key of Object.keys(map)) {
      const entry = {
        label: _(key),
        value: map[key],
      };
      countryList.push(entry);
    }
    return countryList;
  }

  makeChannelOptions() {
    const channelList = this.props.selfState.get('channels');
    // const channelOptions = [{ value: 'auto', label: 'auto' }];

    const channelOptions = channelList.map((val) => {
      return {
        value: val,
        label: val,
      };
    })
    .unshift({ value: 'auto', label: 'auto' })
    .toJS();
    return channelOptions;
  }

  render() {
    const modalOptions = fromJS([
      {
        id: 'operate',
        text: _('Select'),
        transform: function (val, item) {
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
        text: _('MAC'),
      },
      {
        id: 'ssid',
        text: _('SSID'),
      },
      {
        id: 'security',
        text: _('Security Mode'),
        transform: function (val) {
          return val.get('mode');
        }.bind(this),
      },
      {
        id: 'signal',
        text: _('Signal'),
      },
      {
        id: 'noise',
        text: _('Noise'),
      },
      {
        id: 'protocol',
        text: _('Protocol'),
      },
      {
        id: 'frequency',
        text: _('Channel'),
      },
      {
        id: 'channelWidth',
        text: _('Channel Width'),
      },
    ]);
    const store = this.props.store;
    const { page, deviceMode } = this.props.selfState.toJS();
    const { ip, mask, ssid, countryCode, frequency, channelWidth, distance, wirelessMode } = store.get('curData').toJS();
    const mode = store.getIn(['curData', 'security', 'mode']);
    const key = store.getIn(['curData', 'security', 'key']);
    const auth = store.getIn(['curData', 'security', 'auth']);
    const keyLength = store.getIn(['curData', 'security', 'keyLength']);
    const keyType = store.getIn(['curData', 'security', 'keyType']);
    const keyIndex = store.getIn(['curData', 'security', 'keyIndex']);
    const cipher = store.getIn(['curData', 'security', 'cipher']);
    const { lanIp, lanMask, validSsid, validDistance, validPassword } = this.props.validateOption;
    return (
      <div className="wrapall">
        {
          page === '1' ? (
            <div className="firstScreen">
              <h3>{_('Operation Mode')}</h3>
              <div
                className="clearfix"
                style={{
                  paddingTop: '10px',
                }}
              >
                <div className="cols">
                  <FormGroup
                    className="cols col-4"
                    type="radio"
                    text="AP"
                    value="ap"
                    checked={this.props.selfState.get('deviceMode') === 'ap'}
                    name="modeSelect"
                    onChange={(data) => {
                      this.props.changeDeviceMode(data.value);
                      this.props.updateItemSettings({
                        wirelessMode: data.value,
                      });
                      this.props.resetVaildateMsg();
                      this.props.fetchSettings();
                    }}
                  />
                  <div
                    className="cols col-7"
                    style={{
                      marginLeft: '-60px',
                    }}
                  >
                    type="plain-text"value="tthis is the info of stationthis is the info of stationthis is the info of stationthis is the in fo of stationthis is the info of stationthis is the info of stationthis is the info o
                  </div>
                </div>
              </div>
              <div
                className="clearfix"
                style={{
                  paddingTop: '10px',
                }}
              >
                <div className="cols">
                  <FormGroup
                    className="cols col-4"
                    type="radio"
                    value="sta"
                    text="Station"
                    name="modeSelect"
                    checked={this.props.selfState.get('deviceMode') === 'sta'}
                    onChange={(data) => {
                      this.props.changeDeviceMode(data.value);
                      this.props.updateItemSettings({
                        wirelessMode: data.value,
                      });
                      this.props.resetVaildateMsg();
                      this.props.fetchSettings();
                    }}
                  />
                  <div
                    className="cols col-7"
                    style={{
                      marginLeft: '-60px',
                    }}
                  >
                    type="plain-text"value="tthis is the info of stationthis is the infoof stationthis is the info of stationthis is the info of stationthis is the info of stationthis is the
                  </div>
                </div>
              </div>
              <div
                className="clearfix"
                style={{
                  paddingTop: '10px',
                }}
              >
                <div className="cols">
                  <FormGroup
                    className="cols col-4"
                    type="radio"
                    value="repeater"
                    text="Repeater"
                    name="modeSelect"
                    checked={this.props.selfState.get('deviceMode') === 'repeater'}
                    onChange={(data) => {
                      this.props.changeDeviceMode(data.value);
                      this.props.updateItemSettings({
                        wirelessMode: data.value,
                      });
                      this.props.resetVaildateMsg();
                      this.props.fetchSettings();
                    }}
                  />
                  <div
                    className="cols col-7"
                    style={{
                      marginLeft: '-60px',
                    }}
                  >
                    type="plain-text" value="tthis is the info of stationthis is the info of stationthis is the info of stationthis is the in fo of stationthis is the info of stationthis is the
                  </div>
                </div>
              </div>
              <FormGroup>
                <Button
                  theme="primary"
                  text={_('Next ->')}
                  onClick={() => { this.props.changePage('2'); }}
                />
              </FormGroup>
            </div>
          ) : null
        }

        {
          page === '2' ? (
            <div className="secondScreen">
            {
              deviceMode === 'ap' ? (
                <h2>{_('Scene: Access Point')}</h2>
              ) : null
            }

            {
              deviceMode === 'station' ? (
                <h2>{_('Scene: Station')}</h2>
              ) : null
            }

            {
              deviceMode === 'repeater' ? (
                <h2>{_('Scene: Repeater')}</h2>
              ) : null
            }
              <h3>{_('LAN Settings')}</h3>
              <FormGroup
                label={_('IP Address')}
                type="text"
                value={ip}
                onChange={(data) => this.props.updateItemSettings({
                  ip: data.value,
                })}
                {...lanIp}
                required
              />
              <FormGroup
                label={_('Subnet Mask')}
                type="text"
                value={mask}
                onChange={(data) => this.props.updateItemSettings({
                  mask: data.value,
                })}
                {...lanMask}
                required
              />
              <FormGroup>
                <Button
                  text={_('<- Back')}
                  onClick={() => {
                    this.props.changePage('1');
                  }}
                />&nbsp;&nbsp;&nbsp;
                <Button
                  theme="primary"
                  text={_('Next ->')}
                  onClick={() => {
                    this.props.validateAll()
                        .then((msg) => {
                          if (msg.isEmpty()) {
                            this.props.changePage('3');
                          }
                        });
                  }}
                />
              </FormGroup>
            </div>
          ) : null
        }

        {
          page === '3' ? (
            <div className="thirdScreen">
            {
              deviceMode === 'ap' ? (
                <div className="thirdForAp">
                  <h2>{_('Scene: Access Point')}</h2>
                  <h3>{_('Wireless Settings')}</h3>
                  <FormGroup
                    type="text"
                    label={_('SSID')}
                    value={ssid}
                    onChange={(data) => this.props.updateItemSettings({
                      ssid: data.value,
                    })}
                    required
                    {...validSsid}
                  />
                  <FormGroup
                    label={_('Country Code')}
                  >
                    <FormInput
                      type="text"
                      value={this.getCountryNameFromCode(
                        store.getIn(['curData', 'countryCode']),
                        countryMap
                      )}
                      disabled
                      style={{
                        width: '127px',
                        marginTop: '-3px',
                      }}
                    />
                    <Button
                      text={_('Change')}
                      style={{
                        marginLeft: '3px',
                        width: '70px',
                      }}
                      onClick={() => { this.props.changeCtyModal(true); }}
                    />
                  </FormGroup>
                  {
                  this.props.selfState.get('showCtyModal') ? (
                    <Modal
                      title={_('Country Code')}
                      onClose={this.onCloseCountrySelectModal}
                      onOk={this.props.saveCountrySelectModal}
                      isShow
                    >
                      <h3>{_('User Protocol')}</h3>
                      <span>
                        使用本设备之前，请务必选择正确的国家代码以满足当地法规对于可用信道、信道带宽、输出功率、自动频宽选择和自动发射功率控制等的要求。安装方或本设备拥有方是保证依照法规规定正确使用本设备的完全责任人。设备提供商/分销商对于违规使用无线设备的行为和后果不承担任何责任。
                      </span>
                      <FormGroup
                        type="radio"
                        text={_('I have read and agree')}
                        checked={this.props.selfState.get('agreeProtocol')}
                        onClick={() => { this.props.changeAgreeProtocol(true); }}
                      />
                      <FormGroup
                        label={_('Country')}
                        type="select"
                        options={this.makeCountryOptions(countryMap)}
                        value={this.props.selfState.get('selectedCountry') ||
                              store.getIn(['curData', 'countryCode'])}
                        onChange={(data) => this.props.changeCountryCode(data.value)}
                        disabled={!this.props.selfState.get('agreeProtocol')}
                      />
                    </Modal>
                  ) : null
                }
                  <FormGroup
                    type="switch"
                    label={_('Channel Width')}
                    options={channelWidthOptions}
                    value={channelWidth}
                    onChange={(data) => this.props.updateItemSettings({
                      channelWidth: data.value,
                    })}
                  />
                  <FormGroup
                    type="select"
                    label={_('Channel')}
                    options={this.makeChannelOptions()}
                    value={frequency}
                    onChange={(data) => this.props.updateItemSettings({
                      frequency: data.value,
                    })}
                  />
                  <FormGroup
                    type="select"
                    label={_('Security')}
                    options={staAndApSecurityOptions}
                    value={mode || 'none'}
                    onChange={(data) => this.props.updateItemSettings({
                      security: {
                        mode: data.value,
                        cipher: store.getIn(['curData', 'security', 'cipher']) || 'aes',
                        key: '',
                      },
                    })}
                  />
                  {
                    store.getIn(['curData', 'security', 'mode']) === 'none' ? null : (
                      <div>
                        <FormGroup
                          label={_('Algorithm')}
                          type="switch"
                          value={store.getIn(['curData', 'security', 'cipher'])}
                          onChange={(data) => this.props.updateItemSettings({
                            security: {
                              mode,
                              key,
                              cipher: data.value,
                            },
                          })}
                          options={[
                            { label: 'AES', value: 'aes' },
                            { label: 'TKIP', value: 'tkip' },
                            { label: 'AES/TKIP', value: 'aes&tkip' },
                          ]}
                          minWidth="60px"
                        />
                        <FormGroup
                          type="password"
                          label={_('Password')}
                          value={key}
                          onChange={(data) => this.props.updateItemSettings({
                            security: {
                              mode,
                              key: data.value,
                              cipher: store.getIn(['curData', 'security', 'cipher']) || 'aes',
                            },
                          })}
                          required
                          {...validPassword}
                        />
                      </div>
                    )
                  }
                  <FormGroup
                    type="range"
                    label={_('Distance')}
                    value={distance}
                    min="0"
                    max="10"
                    step="0.1"
                    hasTextInput
                    help="km"
                    onChange={(data) => this.props.updateItemSettings({
                      distance: data.value,
                    })}
                  />

                  <FormGroup>
                    <Button
                      text={_('<- Back')}
                      onClick={() => {
                        this.props.changePage('2');
                      }}
                    />&nbsp;&nbsp;&nbsp;
                    <Button
                      text={_('Next ->')}
                      theme="primary"
                      onClick={() => {
                        this.props.validateAll()
                        .then((msg) => {
                          if (msg.isEmpty()) {
                            this.props.changePage('4');
                          }
                        });
                      }}
                    />
                  </FormGroup>
                </div>
              ) : null
            }

            {
              deviceMode === 'sta' ? (
                <div className="thirdForSta">
                  <h2>{_('Scene: Station')}</h2>
                  <h3>{_('Wireless Settings')}</h3>
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
                          onChange={(data) => this.props.updateItemSettings({
                            ssid: data.value,
                          })}
                          {...validSsid}
                        />
                      </div>
                      <span className="fl">
                        <span
                          style={{
                            paddingTop: '2px',
                          }}
                        >&nbsp;&nbsp;
                        {
                          this.props.selfState.get('scaning') ? (
                            <Button
                              text={_('Stop Scan')}
                              onClick={this.onStopScanClick}
                              loading
                            />
                          ) : (
                            <Button
                              text={_('Scan')}
                              onClick={this.onScanBtnClick}
                            />
                          )
                        }
                        </span>
                        <Modal
                          isShow={this.props.selfState.get('showScanResult')}
                          onOk={this.onModalOkBtnClick}
                          onClose={this.onModalCloseBtnClick}
                          okText={_('Select')}
                          cancelText={_('Cancel')}
                          size="lg"
                          okButton
                          cancelButton
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
                    label={_('Peer')}
                    type="text"
                    value={store.getIn(['curData', 'apMac'])}
                    onChange={(data) => this.props.updateItemSettings({
                      apMac: data.value,
                    })}
                  />
                  <FormGroup
                    label={_('Country Code')}
                  >
                    <FormInput
                      type="text"
                      value={this.getCountryNameFromCode(
                        store.getIn(['curData', 'countryCode']),
                        countryMap
                      )}
                      disabled
                      style={{
                        width: '127px',
                        marginTop: '-3px',
                      }}
                    />
                    <Button
                      text={_('Change')}
                      style={{
                        marginLeft: '3px',
                        width: '70px',
                      }}
                      onClick={() => { this.props.changeCtyModal(true); }}
                    />
                  </FormGroup>
                  {
                  this.props.selfState.get('showCtyModal') ? (
                    <Modal
                      title={_('Country Code')}
                      onClose={this.onCloseCountrySelectModal}
                      onOk={this.props.saveCountrySelectModal}
                      isShow
                    >
                      <h3>{_('User Protocol')}</h3>
                      <span>
                        使用本设备之前，请务必选择正确的国家代码以满足当地法规对于可用信道、信道带宽、输出功率、自动频宽选择和自动发射功率控制等的要求。安装方或本设备拥有方是保证依照法规规定正确使用本设备的完全责任人。设备提供商/分销商对于违规使用无线设备的行为和后果不承担任何责任。
                      </span>
                      <FormGroup
                        type="radio"
                        text={_('I have read and agree')}
                        checked={this.props.selfState.get('agreeProtocol')}
                        onClick={() => { this.props.changeAgreeProtocol(true); }}
                      />
                      <FormGroup
                        label={_('Country')}
                        type="select"
                        options={this.makeCountryOptions(countryMap)}
                        value={this.props.selfState.get('selectedCountry')}
                        onChange={(data) => this.props.changeCountryCode(data.value)}
                        disabled={!this.props.selfState.get('agreeProtocol')}
                      />
                    </Modal>
                  ) : null
                }
                  <FormGroup
                    type="switch"
                    label={_('Channel Width')}
                    options={channelWidthOptions}
                    value={channelWidth}
                    onChange={(data) => this.props.updateItemSettings({
                      channelWidth: data.value,
                    })}
                  />
                  <FormGroup
                    type="select"
                    label={_('Channel')}
                    options={this.makeChannelOptions()}
                    value={frequency}
                    onChange={(data) => this.props.updateItemSettings({
                      frequency: data.value,
                    })}
                  />
                  <FormGroup
                    type="select"
                    label={_('Security')}
                    options={staAndApSecurityOptions}
                    value={mode || 'none'}
                    onChange={(data) => this.props.updateItemSettings({
                      security: {
                        mode: data.value || 'none',
                        cipher: store.getIn(['curData', 'security', 'cipher']) || 'aes',
                        key: '',
                      },
                    })}
                  />
                  {
                    store.getIn(['curData', 'security', 'mode']) === 'none' ? null : (
                      <div>
                        <FormGroup
                          label={_('Algorithm')}
                          type="switch"
                          value={store.getIn(['curData', 'security', 'cipher'])}
                          onChange={(data) => this.props.updateItemSettings({
                            security: {
                              mode,
                              key,
                              cipher: data.value,
                            },
                          })}
                          options={[
                            { label: 'AES', value: 'aes' },
                            { label: 'TKIP', value: 'tkip' },
                            { label: 'AES/TKIP', value: 'aes&tkip' },
                          ]}
                        />
                        <FormGroup
                          type="password"
                          label={_('Password')}
                          value={key}
                          onChange={(data) => this.props.updateItemSettings({
                            security: {
                              mode,
                              key: data.value,
                              cipher: store.getIn(['curData', 'security', 'cipher']) || 'aes',
                            },
                          })}
                          required
                          {...validPassword}
                        />
                      </div>
                    )
                  }

                  <FormGroup
                    type="range"
                    label={_('Distance')}
                    value={distance}
                    min="1"
                    max="10"
                    step="0.1"
                    hasTextInput
                    help="km"
                    onChange={(data) => this.props.updateItemSettings({
                      distance: data.value,
                    })}
                  />
                  <FormGroup>
                    <Button
                      text={_('<- Back')}
                      onClick={() => {
                        this.props.changePage('2');
                      }}
                    />&nbsp;&nbsp;&nbsp;
                    <Button
                      text={_('Next ->')}
                      theme="primary"
                      onClick={() => {
                        this.props.validateAll()
                        .then((msg) => {
                          if (msg.isEmpty()) {
                            this.props.changePage('4');
                          }
                        });
                      }}
                    />
                  </FormGroup>
                </div>
              ) : null
            }


            {
              deviceMode === 'repeater' ? (
                <div className="thirdForRepeater">
                  <h2>{_('Scene: Repeater')}</h2>
                  <h3>{_('Wireless Settings')}</h3>
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
                          onChange={(data) => this.props.updateItemSettings({
                            ssid: data.value,
                          })}
                          {...validSsid}
                        />
                      </div>
                      <span className="fl">
                        <span
                          style={{
                            paddingTop: '2px',
                          }}
                        >&nbsp;&nbsp;
                        {
                          this.props.selfState.get('scaning') ? (
                            <Button
                              text={_('Stop Scan')}
                              onClick={this.onStopScanClick}
                              loading
                            />
                          ) : (
                            <Button
                              text={_('Scan')}
                              onClick={this.onScanBtnClick}
                            />
                          )
                        }
                        </span>
                        <Modal
                          isShow={this.props.selfState.get('showScanResult')}
                          onOk={this.onModalOkBtnClick}
                          onClose={this.onModalCloseBtnClick}
                          okText={_('Select')}
                          cancelText={_('Cancel')}
                          okButton
                          cancelButton
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
                    label={_('Lock To AP')}
                    type="text"
                    placeholder="非必填项"
                  />
                  <FormGroup
                    label={_('Country Code')}
                  >
                    <FormInput
                      type="text"
                      value={this.getCountryNameFromCode(
                        store.getIn(['curData', 'countryCode']),
                        countryMap
                      )}
                      disabled
                      style={{
                        width: '127px',
                        marginTop: '-3px',
                      }}
                    />
                    <Button
                      text={_('Change')}
                      style={{
                        marginLeft: '3px',
                        width: '70px',
                      }}
                      onClick={() => { this.props.changeCtyModal(true); }}
                    />
                  </FormGroup>
                  {
                  this.props.selfState.get('showCtyModal') ? (
                    <Modal
                      title={_('Country Code')}
                      onClose={this.onCloseCountrySelectModal}
                      onOk={this.props.saveCountrySelectModal}
                      isShow
                    >
                      <h3>{_('User Protocol')}</h3>
                      <span>
                        使用本设备之前，请务必选择正确的国家代码以满足当地法规对于可用信道、信道带宽、输出功率、自动频宽选择和自动发射功率控制等的要求。安装方或本设备拥有方是保证依照法规规定正确使用本设备的完全责任人。设备提供商/分销商对于违规使用无线设备的行为和后果不承担任何责任。
                      </span>
                      <FormGroup
                        type="radio"
                        text={_('I have read and agree')}
                        checked={this.props.selfState.get('agreeProtocol')}
                        onClick={() => { this.props.changeAgreeProtocol(true); }}
                      />
                      <FormGroup
                        label={_('Country')}
                        type="select"
                        options={this.makeCountryOptions(countryMap)}
                        value={this.props.selfState.get('selectedCountry')}
                        onChange={(data) => this.props.changeCountryCode(data.value)}
                        disabled={!this.props.selfState.get('agreeProtocol')}
                      />
                    </Modal>
                  ) : null
                }
                  <FormGroup
                    type="switch"
                    label={_('Channel Width')}
                    options={channelWidthOptions}
                    value={channelWidth}
                    onChange={(data) => this.props.updateItemSettings({
                      channelWidth: data.value,
                    })}
                  />
                  <FormGroup
                    type="select"
                    label={_('Channel')}
                    options={this.makeChannelOptions()}
                    value={frequency}
                    onChange={(data) => this.props.updateItemSettings({
                      frequency: data.value,
                    })}
                  />
                  <FormGroup
                    type="select"
                    label={_('Security')}
                    value={
                      mode === 'wep' ? mode : 'none'
                    }
                    options={repeaterSecurityOptions}
                    onChange={(data) => this.props.updateItemSettings({
                      security: {
                        mode: data.value,
                        auth: store.getIn(['curData', 'security', 'auth']) || 'open',
                        keyLength: store.getIn(['curData', 'security', 'keyLength']) || '64',
                        keyIndex: store.getIn(['curData', 'security', 'keyIndex']) || '1',
                        keyType: store.getIn(['curData', 'security', 'keyType']) || 'Hex',
                        key: '',
                      },
                    })}
                  />
                  {
                    store.getIn(['curData', 'security', 'mode']) === 'none' ? null : (
                      <div>
                        <FormGroup
                          label={_('Authentication Type')}
                          type="switch"
                          name="authenticationType"
                          options={wepAuthenOptions}
                          value={auth}
                          onChange={(data) => this.props.updateItemSettings({
                            security: {
                              mode,
                              auth: data.value,
                              keyLength,
                              keyType,
                              key,
                              keyIndex,
                            },
                          })}
                          minWidth="65px"
                        />
                        {/*
                          <FormGroup
                            label={_('WEP Key Length')}
                            type="switch"
                            name="wepKeyLength"
                            options={wepKeyLengthOptions}
                            value={keyLength}
                            onChange={(data) => this.props.updateItemSettings({
                              security: {
                                mode,
                                auth,
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
                          label={_('Key Type')}
                          type="switch"
                          name="keyType"
                          options={keyTypeOptions}
                          value={keyType}
                          onChange={(data) => this.props.updateItemSettings({
                            security: {
                              mode,
                              auth,
                              keyLength,
                              keyType: data.value,
                              key,
                              keyIndex,
                            },
                          })}
                          minWidth="65px"
                        />
                        <FormGroup
                          label={_('Key Index')}
                          type="select"
                          name="keyIndex"
                          options={keyIndexOptions}
                          value={keyIndex}
                          onChange={(data) => this.props.updateItemSettings({
                            security: {
                              mode,
                              auth,
                              keyLength,
                              keyType,
                              key,
                              keyIndex: data.value,
                            },
                          })}
                        />
                        <FormGroup
                          type="password"
                          label={_('Password')}
                          value={key || ''}
                          onChange={(data) => this.props.updateItemSettings({
                            security: {
                              mode,
                              auth,
                              keyLength,
                              keyType,
                              key: data.value,
                              keyIndex,
                            },
                          })}
                        />
                      </div>
                    )
                  }

                  <FormGroup
                    type="range"
                    label={_('Distance')}
                    value={distance}
                    min="1"
                    max="10"
                    step="0.1"
                    hasTextInput
                    help="km"
                    onChange={(data) => this.props.updateItemSettings({
                      distance: data.value,
                    })}
                  />
                  <FormGroup>
                    <Button
                      text={_('<- Back')}
                      onClick={() => {
                        this.props.changePage('2');
                      }}
                    />&nbsp;&nbsp;&nbsp;
                    <Button
                      text={_('Next ->')}
                      theme="primary"
                      onClick={() => {
                        this.props.validateAll()
                        .then((msg) => {
                          if (msg.isEmpty()) {
                            this.props.changePage('4');
                          }
                        });
                      }}
                    />
                  </FormGroup>
                </div>
              ) : null
            }
            </div>
          ) : null
        }

        {
          page === '4' ? (
            <div className="fourthScreen">
            {
              deviceMode === 'ap' ? (
                <div className="fourthForAp">
                  <h2>{_('Scene: Access Point')}</h2>
                  <h3>{_('Current Settings')}</h3>

                  <FormGroup
                    type="plain-text"
                    label={_('Current Mode')}
                    value="AP"
                  /><br />
                  <FormGroup
                    type="plain-text"
                    label={_('LAN IP')}
                    value={ip}
                  />
                  <FormGroup
                    type="plain-text"
                    label={_('Subnet Mask')}
                    value={mask}
                  /><br />

                  <FormGroup
                    type="plain-text"
                    label={_('SSID')}
                    value={ssid}
                  />
                  <FormGroup
                    type="plain-text"
                    label={_('Country')}
                    value={this.getCountryNameFromCode(countryCode, countryMap)}
                  />
                  <FormGroup
                    type="plain-text"
                    label={_('Channel Width')}
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
                    label={_('Channel')}
                    value={frequency}
                  />
                  <FormGroup
                    type="plain-text"
                    label={_('Security')}
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
                    label={_('Distance')}
                    value={distance}
                  />
                  <FormGroup>
                    <Button
                      text={_('<- Back')}
                      onClick={() => {
                        this.props.changePage('3');
                      }}
                    />&nbsp;&nbsp;&nbsp;
                    <SaveButton
                      text={_('Save')}
                      loading={this.props.app.get('saving')}
                      onClick={() => this.props.saveSettings('goform/set_quicksetup')}
                    />
                  </FormGroup>
                </div>
              ) : null
            }

            {
              deviceMode === 'sta' ? (
                <div className="fourthForSta">
                  <h2>{_('Scene: Station')}</h2>
                  <h3>{_('Current Settings')}</h3>

                  <FormGroup
                    type="plain-text"
                    label={_('Current Mode')}
                    value="Station"
                  /><br />

                  <FormGroup
                    type="plain-text"
                    label={_('LAN IP')}
                    value={ip}
                  />
                  <FormGroup
                    type="plain-text"
                    label={_('Subnet Mask')}
                    value={mask}
                  /><br />
                  <FormGroup
                    type="plain-text"
                    label={_('SSID')}
                    value={ssid}
                  />
                  <FormGroup
                    type="plain-text"
                    label={_('Country')}
                    value={this.getCountryNameFromCode(countryCode, countryMap)}
                  />
                  <FormGroup
                    type="plain-text"
                    label={_('Peer')}
                    value={store.getIn(['curData', 'apMac'])}
                  />
                  <FormGroup
                    type="plain-text"
                    label={_('Channel Width')}
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
                    label={_('Channel')}
                    value={frequency}
                  />
                  <FormGroup
                    type="plain-text"
                    label={_('Security')}
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
                    label={_('Distance')}
                    value={distance}
                  />

                  <FormGroup>
                    <Button
                      text={_('<- Back')}
                      onClick={() => {
                        this.props.changePage('3');
                      }}
                    />&nbsp;&nbsp;&nbsp;
                    <SaveButton
                      text={_('Save')}
                      loading={this.props.app.get('saving')}
                      onClick={() => this.props.saveSettings('goform/set_quicksetup')}
                    />
                  </FormGroup>
                </div>
              ) : null
            }

            {
              deviceMode === 'repeater' ? (
                <div className="fourthForRepeater">
                  <h2>{_('Scene: Repeater')}</h2>
                  <h3>{_('Current Settings')}</h3>
                  <FormGroup
                    type="plain-text"
                    label={_('Current Mode')}
                    value="Repeater"
                  /><br />
                  <FormGroup
                    type="plain-text"
                    label={_('LAN IP')}
                    value={ip}
                  />
                  <FormGroup
                    type="plain-text"
                    label={_('Subnet Mask')}
                    value={mask}
                  /><br />

                  <FormGroup
                    type="plain-text"
                    label={_('SSID')}
                    value={ssid}
                  />
                  <FormGroup
                    type="plain-text"
                    label={_('Country')}
                    value={this.getCountryNameFromCode(countryCode, countryMap)}
                  />
                  <FormGroup
                    type="plain-text"
                    label={_('Channel Width')}
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
                    label={_('Channel')}
                    value={frequency}
                  />
                  <FormGroup
                    type="plain-text"
                    label={_('Security')}
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
                    label={_('Distance')}
                    value={distance}
                  />

                  <FormGroup>
                    <Button
                      text={_('<- Back')}
                      onClick={() => {
                        this.props.changePage('3');
                      }}
                    />&nbsp;&nbsp;&nbsp;
                    <SaveButton
                      text={_('Save')}
                      loading={this.props.app.get('saving')}
                      onClick={() => this.props.saveSettings('goform/set_quicksetup')}
                    />
                  </FormGroup>
                </div>
              ) : null
            }
            </div>
          ) : null
        }
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
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    utils.extend({}, appActions, settingActions, selfActions),
    dispatch
  );
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
  validator.mergeProps(validOptions)
)(QuickSetup);

export const quicksetup = reducer;
