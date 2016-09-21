import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { Map, fromJS } from 'immutable';
import validator from 'shared/utils/lib/validator';
import { bindActionCreators } from 'redux';
import { FormGroup, FormInput, Modal, Table, SaveButton } from 'shared/components';
import { Button } from 'shared/components/Button';
import * as appActions from 'shared/actions/app';
import * as actions from 'shared/actions/settings';
import * as selfActions from './actions';
import reducer from './reducer.js';
import countryMap from './country.js';

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
  selfState: PropTypes.instanceOf(Map),
  validateAll: PropTypes.func,

  route: PropTypes.object,
  initSettings: PropTypes.func,
  fetchSettings: PropTypes.func,
  fetch: PropTypes.func,
  saveSettings: PropTypes.func,
  updateItemSettings: PropTypes.func,
  leaveSettingsScreen: PropTypes.func,
  validateOption: PropTypes.object,

  changeScanStatus: PropTypes.func,
  changeShowScanResultStatus: PropTypes.func,
  changeSelectedResult: PropTypes.func,
  leaveScreen: PropTypes.func,

  changeCtyModal: PropTypes.func,
  changeAgreeProtocol: PropTypes.func,
  changeCountryCode: PropTypes.func,
  closeCountrySelectModal: PropTypes.func,
  saveCountrySelectModal: PropTypes.func,
  receiveCountryInfo: PropTypes.func,
  resetVaildateMsg: PropTypes.func,
};

const defaultProps = {};

const devicemodeOptions = [
  { value: 'ap', label: _('AP') },
  { value: 'sta', label: _('Station') },
  { value: 'repeater', label: _('Repeater') },
];

const rateOptions = [
  { value: '0', label: 'MSC0' },
  { value: '1', label: 'MSC1' },
  { value: '2', label: 'MCS2' },
  { value: '3', label: 'MCS3' },
  { value: '4', label: 'MCS4' },
  { value: '5', label: 'MCS5' },
  { value: '6', label: 'MCS6' },
  { value: '7', label: 'MCS7' },
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

const ieeeModeOptions = [
  { value: '11AC', label: '11AC' },
];

const channelWidthOptions = [
  { value: 'HT20', label: '20MHz' },
  { value: 'HT40', label: '40MHz' },
  { value: 'HT80', label: '80MHz' },
];

const validOptions = Map({
  validSsid: validator({
    rules: 'remarkTxt:["\'\\\\"]|len:[1, 31]',
  }),
  staApmac: validator({
    rules: 'mac',
  }),
  apmac1: validator({
    rules: 'mac',
  }),
  apmac2: validator({
    rules: 'mac',
  }),
  apmac3: validator({
    rules: 'mac',
  }),
  validPwd: validator({
    rules: 'pwd|len:[8, 32]',
  }),
});

export default class Basic extends React.Component {

  constructor(props) {
    super(props);
    this.onSave = this.onSave.bind(this);
    this.onHideSsidboxClick = this.onHideSsidboxClick.bind(this);
    this.onAutoRepeatBoxClick = this.onAutoRepeatBoxClick.bind(this);
    this.onStopScanClick = this.onStopScanClick.bind(this);
    this.onScanBtnClick = this.onScanBtnClick.bind(this);
    this.onModalOkBtnClick = this.onModalOkBtnClick.bind(this);
    this.onModalCloseBtnClick = this.onModalCloseBtnClick.bind(this);
    this.onSelectScanResultItem = this.onSelectScanResultItem.bind(this);
    this.onChengeWirelessMode = this.onChengeWirelessMode.bind(this);
    this.noErrorThisPage = this.noErrorThisPage.bind(this);
    this.makeCountryOptions = this.makeCountryOptions.bind(this);
    this.getCountryNameFromCode = this.getCountryNameFromCode.bind(this);
    this.onCloseCountrySelectModal = this.onCloseCountrySelectModal.bind(this);
    this.makeChannelOptions = this.makeChannelOptions.bind(this);
  }

  componentWillMount() {
    const props = this.props;
    const groupId = props.groupId || -1;

    props.initSettings({
      settingId: props.route.id,
      formUrl: props.route.formUrl,
      saveUrl: props.route.saveUrl,
      query: {
        groupId,
      },
      saveQuery: {},
      defaultData: {

      },
    });
    props.fetchSettings();
    props.changeShowScanResultStatus(false);
    props.changeScanStatus(false);
    utils.fetch(this.props.route.formUrl)
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          const country = json.data.countryCode;
          this.props.changeCountryCode(country);
          const channelWidth = json.data.channelWidth;
          const saveInfo = {
            radio: '5G',
            country,
            channelWidth,
          };
          utils.fetch('goform/get_country_info', saveInfo)
              .then((json2) => {
                console.log('json2', json2.data);
                if (json2.state && json2.state.code === 2000) {
                  this.props.receiveCountryInfo(json2.data);
                }
              });
        }
      });
  }

  componentWillUnmount() {
    this.props.leaveSettingsScreen();
    this.props.leaveScreen();
    this.props.resetVaildateMsg();
  }

  onSave() {
    this.props.validateAll()
      .then(msg => {
        if (msg.isEmpty()) {
          this.props.saveSettings();
        }
      });
  }

  onHideSsidboxClick() {
    const val = (this.props.store.getIn(['curData', 'hideSsid']) === '1') ? '0' : '1';
    this.props.updateItemSettings({
      hideSsid: val,
    });
  }
  onAutoRepeatBoxClick() {
    const val = (this.props.store.getIn(['curData', 'autoRepeat']) === '1') ? '0' : '1';
    this.props.updateItemSettings({
      autoRepeat: val,
    });
  }

  onStopScanClick() {
    this.props.changeScanStatus(false);
    this.props.changeShowScanResultStatus(false);
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
  onModalOkBtnClick() {
    const {
      mac, ssid, security, frequency, channelWidth,
    } = this.props.selfState.get('selectedResult').toJS();
    if (!this.props.selfState.get('selectedResult').isEmpty()) {
      this.props.updateItemSettings({
        apMac: mac,
        peers: [mac],
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
  onModalCloseBtnClick() {
    this.props.changeShowScanResultStatus(false);
    this.props.changeSelectedResult(fromJS({}));
  }
  onSelectScanResultItem(item) {
    const { ssid, mac, security, frequency, channelWidth } = item.toJS();
    const result = fromJS({}).set('ssid', ssid).set('mac', mac)
                             .set('frequency', frequency)
                             .set('channelWidth', channelWidth)
                             .set('security', security);
    this.props.changeSelectedResult(result);
  }
  onChengeWirelessMode(data) {
    this.props.fetch('goform/get_wl_info')
        .then((json) => {
          // 首先更新curData中的数据，防止之前修改模式但未保存时加密方式发生变化，目的是切换回去后显示原来的数据
          this.props.updateItemSettings({ ...json.data });
          if (json.state && json.state.code === 2000) {
            const curMode = json.data.wirelessMode;
            if (data.value !== curMode) {
              this.props.updateItemSettings({
                wirelessMode: data.value,
              });
              if (data.value === 'repeater' || curMode === 'repeater') {
                this.props.updateItemSettings({
                  security: {
                    mode: 'none',
                  },
                });
              }
            }
          }
        });
  }
  onCloseCountrySelectModal() {
    const code = this.props.store.getIn(['curData', 'countryCode']);
    console.log(code);
    this.props.closeCountrySelectModal(code);
  }

  getCountryNameFromCode(code, map) {
    for (const name of Object.keys(map)) {
      if (map[name] === code) {
        return name;
      }
    }
    return '';
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

  noErrorThisPage() {
    const errorMsg = this.props.app.get('invalid');
    if (errorMsg.isEmpty()) {
      return true;
    }
    return false;
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

    // for (const elem of channelList.toJS().values()) {
    //   const item = {
    //     value: elem,
    //     label: elem,
    //   };
    //   channelOptions.push(item);
    // }
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
          return val.toJS().mode;
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
        id: 'channel',
        text: _('Channel'),
      },
      {
        id: 'channelWidth',
        text: _('Channel Width'),
      },
    ]);
    const {
      wirelessMode, ssid, apMac, countryCode, radioMode, channelWidth,
      hideSsid, txPower, frequency, maxTxRate, peers, autoRepeat,
    } = this.props.store.get('curData').toJS();
    const { staApmac, apmac1, apmac2, apmac3, validSsid, validPwd } = this.props.validateOption;
    const mode = this.props.store.getIn(['curData', 'security', 'mode']);
    const key = this.props.store.getIn(['curData', 'security', 'key']);
    const auth = this.props.store.getIn(['curData', 'security', 'auth']);
    const keyLength = this.props.store.getIn(['curData', 'security', 'keyLength']);
    const keyType = this.props.store.getIn(['curData', 'security', 'keyType']);
    const keyIndex = this.props.store.getIn(['curData', 'security', 'keyIndex']);
    const cipher = this.props.store.getIn(['curData', 'security', 'cipher']);
    let peer1 = '';
    let peer2 = '';
    let peer3 = '';
    if (peers !== undefined) {
      if (peers.length >= 3) {
        peer1 = peers[0] || '';
        peer2 = peers[1] || '';
        peer3 = peers[2] || '';
      } else if (peers.length === 2) {
        peer1 = peers[0] || '';
        peer2 = peers[1] || '';
      } else if (peers.length === 1) {
        peer1 = peers[0] || '';
      }
    }
    // const peers = this.props.stosre.getIn(['curData', 'security', 'peers']);
    // console.log('dd=', this.props.store.toJS())

    if (this.props.store.get('curSettingId') === 'base') {
      return null;
    }

    return (
      <div>
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
            list={this.props.store.getIn(['curData', 'scanResult', 'siteList'])}
          />
        </Modal>
        <div>
          <h3>{_('Basic Wireless Settings')}</h3>
          <div className="clearfix">
            <FormGroup
              className="fl"
              type="select"
              options={devicemodeOptions}
              value={wirelessMode}
              onChange={(data) => this.onChengeWirelessMode(data)}
              label={_('Wireless Mode')}
            />
            <span className="fl">
              {
                (wirelessMode === 'repeater') ? (
                  <span
                    style={{
                      display: 'inline-block',
                      marginTop: '11px',
                    }}
                  >&nbsp;&nbsp;
                    <input
                      style={{
                        paddingBottom: '-2px',
                      }}
                      type="checkbox"
                      checked={autoRepeat === '1'}
                      onClick={this.onAutoRepeatBoxClick}
                    />&nbsp;
                    {_('Auto')}
                  </span>
                ) : null
              }
            </span>
          </div>

          <div className="clearfix">
            <div
              style={{
                width: '127px',
              }}
            >
              <FormGroup
                label="SSID"
                className="fl"
                type="text"
                value={ssid}
                onChange={(data) => this.props.updateItemSettings({
                  ssid: data.value,
                })}
                required
                {...validSsid}
              />
            </div>
            <span className="fl">
              {
                (wirelessMode === 'sta') ? (
                  <div>
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
                  </div>
                ) : (
                  <div>
                  {
                     wirelessMode === 'repeater' ? (
                       <Button
                         text={_('Scan')}
                         style={{
                           marginLeft: '3px',
                         }}
                         onClick={this.onScanBtnClick}
                       />
                     ) : null
                  }
                    <span
                      style={{
                        display: 'inline-block',
                        marginTop: '11px',
                      }}
                    >&nbsp;&nbsp;
                      <input
                        style={{
                          paddingBottom: '-2px',
                        }}
                        type="checkbox"
                        checked={hideSsid === '1'}
                        onClick={this.onHideSsidboxClick}
                      />&nbsp;
                      {_('Hide SSID')}
                    </span>
                  </div>
                )
              }
            </span>
          </div>
          {
              (wirelessMode === 'repeater') ? (
                <div>
                  <FormGroup
                    label="WDS Peers"
                    type="text"
                    value={peer1}
                    onChange={(data) => this.props.updateItemSettings({
                      peers: [
                        data.value, peer2, peer3,
                      ],
                    })}
                    {...apmac1}
                  />
                  <FormGroup
                    type="text"
                    value={peer2}
                    onChange={(data) => this.props.updateItemSettings({
                      peers: [
                        peer1, data.value, peer3,
                      ],
                    })}
                    {... apmac2}
                  />
                  <FormGroup
                    type="text"
                    value={peer3}
                    onChange={(data) => this.props.updateItemSettings({
                      peers: [
                        peer1, peer2, data.value,
                      ],
                    })}
                    {... apmac3}
                  />
                </div>
              ) : null
          }
          {
            (wirelessMode === 'sta') ? (
              <FormGroup
                label={_('Lock To AP')}
                value={apMac}
                onChange={(data) => this.props.updateItemSettings({
                  apMac: data.value,
                })}
                placeholder={_('not necessary')}
                {...staApmac}
              />
            ) : null
          }
          <FormGroup
            label={_('Country')}
          >
            <FormInput
              type="text"
              value={this.getCountryNameFromCode(
                  this.props.selfState.get('selectedCountry'),
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
            label={_('Channel')}
            type="select"
            options={this.makeChannelOptions()}
            value={this.props.store.getIn(['curData', 'frequency']) || 'auto'}
            onChange={(data) => this.props.updateItemSettings({
              frequency: data.value || 'auto',
            })}
          />
          <FormGroup
            label={_('Channel Bandwidth')}
            type="switch"
            options={channelWidthOptions}
            value={channelWidth}
            onChange={(data) => this.props.updateItemSettings({
              channelWidth: data.value,
            })}
          />
          <FormGroup
            label={_('Output Power')}
            type="range"
            min="-4"
            max={this.props.selfState.get('maxTxpower')}
            help={txPower}
            value={txPower}
            onChange={(data) => this.props.updateItemSettings({
              txPower: data.value,
            })}
          />
          <FormGroup
            label={_('Max TX Rate')}
            type="select"
            value={maxTxRate}
            options={rateOptions}
            onChange={(data) => this.props.updateItemSettings({
              maxTxRate: data.value,
            })}
          />
        </div>
        <div>
          <h3>{_('Wireless Security')}</h3>
          {
            (wirelessMode === 'sta' || wirelessMode === 'ap') ? (
              <div>
                <FormGroup
                  label={_('Security')}
                  type="select"
                  options={staAndApSecurityOptions}
                  value={mode}
                  onChange={(data) => this.props.updateItemSettings({
                    security: {
                      cipher: cipher || 'aes',
                      mode: data.value,
                    },
                  })}
                />

                {
                  (mode === 'none') ? null : (
                    <div>
                      <FormGroup
                        label={_('Algorithm')}
                        type="switch"
                        value={this.props.store.getIn(['curData', 'security', 'cipher'])}
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
                        label={_('Keys')}
                        type="password"
                        value={key}
                        onChange={(data) => this.props.updateItemSettings({
                          security: {
                            mode,
                            key: data.value,
                            cipher,
                          },
                        })}
                        required
                        {...validPwd}
                      />
                    </div>
                  )
                }
              </div>
            ) : null
          }
          {
            (wirelessMode === 'repeater') ? (
              <div>
                <FormGroup
                  label={_('Security')}
                  type="select"
                  options={repeaterSecurityOptions}
                  value={mode}
                  onChange={(data) => this.props.updateItemSettings({
                    security: {
                      mode: data.value,
                      auth: auth || 'shared',
                      keyLength: keyLength || '128',
                      keyType: keyType || 'Hex',
                      key,
                      keyIndex: keyIndex || '1',
                    },
                  })}
                />
                {
                  (mode === 'none') ? null : (
                    <div>
                      <FormGroup
                        label={_('Authentication Type')}
                        type="select"
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
                      />
                      <FormGroup
                        label={_('WEP Key Length')}
                        type="select"
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
                        label={_('Key Type')}
                        type="select"
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
                      />
                      <FormGroup
                        type="password"
                        label={_('Password')}
                        value={key}
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
              </div>
            ) : null

          }

        </div>
        <div className="form-group form-group--save">
          <div className="form-control">
            <SaveButton
              type="button"
              loading={this.props.app.get('saving')}
              onClick={this.onSave}
            />
          </div>
        </div>
      </div>
    );
  }
}

Basic.propTypes = propTypes;
Basic.defaultProps = defaultProps;

function mapStateToProps(state) {
  // console.log('state.basic', state.basic);
  return {
    app: state.app,
    store: state.settings,
    selfState: state.basic,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    actions,
    selfActions,
  ), dispatch);
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
  validator.mergeProps(validOptions)
)(Basic);

export const basic = reducer;
