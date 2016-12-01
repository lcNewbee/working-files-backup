import React, { PropTypes } from 'react';
import { fromJS, Map } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import validator from 'shared/utils/lib/validator';
import utils from 'shared/utils';
import {
  FormGroup, FormInput, Button, Modal, Table,
  WizardContainer,
} from 'shared/components';
import * as appActions from 'shared/actions/app';
import * as settingActions from 'shared/actions/settings';
import * as selfActions from './actions';
import reducer from './reducer';
import countryMap from './country';
import './index';

const propTypes = {
  app: PropTypes.instanceOf(Map),
  fetch: PropTypes.func,
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
  saveSettings: PropTypes.func,
  restoreSelfState: PropTypes.func,
  changeReinitAt: PropTypes.func,
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
  Hex: validator({
    rules: 'hex|len:[10, 10]',
  }),
  ASCII: validator({
    rules: 'ascii|len:[5, 5]',
  }),
  staApmac: validator({
    rules: 'mac',
  }),
});

export default class QuickSetup extends React.Component {
  constructor(props) {
    super(props);

    utils.binds(this, [
      'makeCountryOptions',
      'getCountryNameFromCode',
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
    ]);
  }

  componentWillMount() {
    this.firstInAndRefresh();
  }

  componentDidUpdate(prevProps) {
    const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
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
    // console.log(code);
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
      const msg = validator.combineValid.noBroadcastIp(ip, mask);
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

  getCountryNameFromCode(code, map) {
    for (const name of Object.keys(map)) {
      if (map[name] === code) {
        return _(name);
      }
    }
    return '';
  }

  onChangeRadio(data) { // 注意参数实际是data的value属性，这里表示radio序号
    const radioType = this.props.product.getIn(['deviceRadioList', data.value, 'radioType']);
    const config = fromJS({
      radioId: data.value,
      radioType,
    });
    this.props.changeCurrRadioConfig(config);
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
        const requestInfo = {
          radio: this.props.selfState.getIn(['currRadioConfig', 'radioType']),
          country: this.props.store.getIn(['curData', 'radioList', radioId, 'countryCode']),
          channelWidth: this.props.store.getIn(['curData', 'radioList', radioId, 'channelWidth']),
        };
        props.fetch('goform/get_country_info', requestInfo).then((json) => {
          if (json.state && json.state.code === 2000) {
            this.props.receiveCountryInfo(json.data);
          }
        });
        this.handleWrongSecurMode();
        // const security = props.store.getIn(['curData', 'radioList', radioId, 'security']);
        // if (!security) {
        //   this.updateItemInRadioList('security', fromJS({ mode: 'none' }));
        // }
      });
    props.resetVaildateMsg();
  }


  // countryMap为Object
  makeCountryOptions(map) {
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

    const channelOptions = channelList.map(val => ({
      value: parseInt(val, 10).toString(),
      label: val,
    }))
    .unshift({ value: 'auto', label: 'auto' })
    .toJS();
    return channelOptions;
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

  updateItemInRadioList(name, value) {
    const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
    const radioList = this.props.store.getIn(['curData', 'radioList'])
                          .setIn([radioId, name], value);
    this.props.updateItemSettings({ radioList });
  }

  renderOperationMode() {
    return (
      <div className="firstScreen">
        <FormGroup
          label={_('Operation Mode')}
        >
          <div
            style={{
              paddingTop: '8px',
            }}
          >
            <FormInput
              type="radio"
              text={_('AP Mode')}
              name="operationModeItem"
            />
            <FormInput
              type="radio"
              text={_('Router Mode')}
              name="operationModeItem"
              style={{
                marginLeft: '10px',
              }}
            />
          </div>
        </FormGroup>
        {
          // AP mode
          true ? (
            <div>
              <FormGroup
                type="text"
                label={_('IP')}
              />
              <FormGroup
                type="text"
                label={_('Subnet Mask')}
              />
            </div>
          ) : null
        }
        {
          // Router Mode
          true ? (
            <div>
              <FormGroup
                type="select"
                label={_('Internet Connection Type')}
                options={[
                  { value: 'static', label: _('Static IP') },
                  { value: 'dhcp', label: _('DHCP') },
                  { value: 'pppoe', label: _('PPPOE') },
                ]}
              />
              {
                // static
                true ? (
                  <div>
                    <FormGroup
                      label={_('IP Address')}
                      type="text"
                    />
                    <FormGroup
                      label={_('Subnet Mask')}
                      type="text"
                    />
                    <FormGroup
                      type="text"
                      label={_('Gateway')}
                    />
                    <FormGroup
                      type="text"
                      label={_('Primary DNS')}
                    />
                    <FormGroup
                      type="text"
                      label={_('Secondary DNS')}
                    />
                  </div>
                ) : null
              }
              {
                // DHCP
                <div>
                  <FormGroup
                    type="text"
                    label={_('Fallback IP')}
                    disabled
                  />
                  <FormGroup
                    type="text"
                    label={_('Fallback Netmask')}
                    disabled
                  />
                  <FormGroup
                    type="checkbox"
                    label={_('NAT')}
                  />
                </div>
              }
              {
                // PPPOE
                <div>
                  <FormGroup
                    type="text"
                    label={_('Account')}
                  />
                  <FormGroup
                    type="text"
                    label={_('Password')}
                  />
                  <FormGroup
                    type="checkbox"
                    label={_('NAT')}
                  />
                </div>
              }
            </div>
          ) : null
        }
      </div>
    );
  }

  renderStepTwo() {
    const store = this.props.store;
    const { deviceMode } = this.props.selfState.toJS();
    const { ip, mask } = store.get('curData').toJS();
    const { lanIp, lanMask } = this.props.validateOption;

    return (
      <div className="secondScreen">
        <FormGroup
          label={_('IP Address')}
          type="text"
          value={ip}
          onChange={data => this.props.updateItemSettings({
            ip: data.value,
          })}
          {...lanIp}
          required
        />
        <FormGroup
          label={_('Subnet Mask')}
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
          const mode = val.get('mode');
          if (mode === 'wpa') return 'WPA-PSK';
          else if (mode === 'wpa2') return 'WPA2-PSK';
          else if (mode === 'wpa-mixed') return 'WPA/WPA2-PSK';
          else if (mode === 'wep') return 'WEP';
          return mode;
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
    const { deviceMode } = this.props.selfState.toJS();
    const { radioId, radioType } = this.props.selfState.get('currRadioConfig').toJS();
    const {
      ssid, countryCode, frequency, channelWidth, distance, wirelessMode, autoAdjust
    } = store.getIn(['curData', 'radioList', radioId]).toJS();
    const mode = store.getIn(['curData', 'radioList', radioId, 'security', 'mode']);
    const key = store.getIn(['curData', 'radioList', radioId, 'security', 'key']);
    const auth = store.getIn(['curData', 'radioList', radioId, 'security', 'auth']);
    const keyLength = store.getIn(['curData', 'radioList', radioId, 'security', 'keyLength']);
    const keyType = store.getIn(['curData', 'radioList', radioId, 'security', 'keyType']);
    const keyIndex = store.getIn(['curData', 'radioList', radioId, 'security', 'keyIndex']);
    const cipher = store.getIn(['curData', 'radioList', radioId, 'security', 'cipher']);
    const { lanIp, lanMask, validSsid, validDistance, validPassword, apmac3, staApmac } = this.props.validateOption;

    return (
      <div className="thirdScreen">
        {
          deviceMode === 'ap' ? (
            <div className="thirdForAp">
              <FormGroup
                type="text"
                label={_('SSID')}
                value={ssid}
                onChange={data => this.updateItemInRadioList('ssid', data.value)}
                required
                {...validSsid}
              />
              <FormGroup
                type="select"
                label={_('Security')}
                options={staAndApSecurityOptions}
                value={mode}
                onChange={(data) => {
                  const security = fromJS({
                    mode: data.value,
                    cipher: store.getIn(['curData', 'radioList', radioId, 'security', 'cipher']) || 'aes',
                    auth: store.getIn(['curData', 'radioList', radioId, 'security', 'auth']) || 'open',
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
                      label={_('Encryption')}
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
                      label={_('Password')}
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
                        label={_('Auth Type')}
                        type="switch"
                        options={wepAuthenOptions}
                        value={store.getIn(['curData', 'radioList', radioId, 'security', 'auth'])}
                        onChange={(data) => {
                          const security = store.getIn(['curData', 'radioList', radioId, 'security'])
                                                .set('auth', data.value);
                          this.updateItemInRadioList('security', security);
                        }}
                        minWidth="65px"
                      />
                      {/*
                        <FormGroup
                          label={_('Key Length')}
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
                        label={_('Key Format')}
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
                        label={_('Key Index')}
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
                        label={_('Password')}
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
                            text={_('Stop')}
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
                label={_('Lock To AP')}
                type="checkbox"
                checked={store.getIn(['curData', 'radioList', radioId, 'apMacEnable']) === '1'}
                onChange={data => this.updateItemInRadioList('apMacEnable', data.value)}
              />
              {
                store.getIn(['curData', 'radioList', radioId, 'apMacEnable']) === '1' ? (
                  <FormGroup
                    label={_('Peer Mac')}
                    value={store.getIn(['curData', 'radioList', radioId, 'apMac'])}
                    onChange={data => this.updateItemInRadioList('apMac', data.value)}
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
                    store.getIn(['curData', 'radioList', radioId, 'countryCode']),
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
                    marginLeft: '-1px',
                    width: '70px',
                  }}
                  onClick={() => { this.props.changeCtyModal(true); }}
                />
              </FormGroup>
              <Modal
                title={_('Country')}
                onClose={this.onCloseCountrySelectModal}
                onOk={this.props.saveCountrySelectModal}
                isShow={this.props.selfState.get('showCtyModal')}
              >
                <h3>{_('User Protocol')}</h3>
                <span>
                  {_('The initial Wi-Fi setup requires you to specify the country code for the country in which the AP operates. Configuring a country code ensures the radio’s frequency bands, channels, and transmit power levels are compliant with country-specific regulations.')}
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
                  onChange={data => this.props.changeCountryCode(data.value)}
                  disabled={!this.props.selfState.get('agreeProtocol')}
                />
              </Modal>
              <FormGroup
                type="switch"
                label={_('Channel Width')}
                minWidth="66px"
                options={channelWidthOptions}
                value={channelWidth}
                onChange={data => this.updateItemInRadioList('channelWidth', data.value)}
              />
              <FormGroup
                type="select"
                label={_('Channel')}
                options={this.makeChannelOptions()}
                value={frequency}
                onChange={data => this.updateItemInRadioList('frequency', data.value)}
              />
              <FormGroup
                type="select"
                label={_('Security')}
                options={staAndApSecurityOptions}
                value={mode}
                onChange={(data) => {
                  const security = fromJS({
                    mode: data.value,
                    cipher: store.getIn(['curData', 'radioList', radioId, 'security', 'cipher']) || 'aes',
                    auth: store.getIn(['curData', 'radioList', radioId, 'security', 'auth']) || 'open',
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
                      label={_('Encryption')}
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
                      label={_('Password')}
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
                      label={_('Auth Type')}
                      type="switch"
                      options={wepAuthenOptions}
                      value={store.getIn(['curData', 'radioList', radioId, 'security', 'auth'])}
                      onChange={(data) => {
                        const security = store.getIn(['curData', 'radioList', radioId, 'security'])
                                        .set('auth', data.value);
                        this.updateItemInRadioList('security', security);
                      }}
                      minWidth="65px"
                    />
                    {/*
                      <FormGroup
                        label={_('Key Length')}
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
                      label={_('Key Format')}
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
                      label={_('Key Index')}
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
                      label={_('Password')}
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
                  type="range"
                  className="fl"
                  label={_('Distance')}
                  value={distance}
                  min="1"
                  max="10"
                  step="0.1"
                  hasTextInput
                  help="km"
                  disabled={autoAdjust === '1'}
                  onChange={data => this.updateItemInRadioList('distance', data.value)}
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
                    {_('auto')}
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
                          text={_('Stop')}
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
                label={_('Peer MAC')}
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
                label={_('Country')}
              >
                <FormInput
                  type="text"
                  value={this.getCountryNameFromCode(
                    store.getIn(['curData', 'radioList', radioId, 'countryCode']),
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
              <Modal
                title={_('Country')}
                onClose={this.onCloseCountrySelectModal}
                onOk={this.props.saveCountrySelectModal}
                isShow={this.props.selfState.get('showCtyModal')}
              >
                <h3>{_('User Protocol')}</h3>
                <span>
                  {_('The initial Wi-Fi setup requires you to specify the country code for the country in which the AP operates. Configuring a country code ensures the radio’s frequency bands, channels, and transmit power levels are compliant with country-specific regulations.')}
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
                  onChange={data => this.props.changeCountryCode(data.value)}
                  disabled={!this.props.selfState.get('agreeProtocol')}
                />
              </Modal>
              <FormGroup
                type="switch"
                label={_('Channel Width')}
                minWidth="66px"
                options={channelWidthOptions}
                value={channelWidth}
                onChange={data => this.updateItemInRadioList('channelWidth', data.value)}
              />
              <FormGroup
                type="select"
                label={_('Channel')}
                options={this.makeChannelOptions()}
                value={frequency}
                onChange={data => this.updateItemInRadioList('frequency', data.value)}
              />
              <FormGroup
                type="select"
                label={_('Security')}
                value={mode}
                options={repeaterSecurityOptions}
                onChange={(data) => {
                  const security = fromJS({
                    mode: data.value,
                    auth: store.getIn(['curData', 'radioList', radioId, 'security', 'auth']) || 'open',
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
                      label={_('Auth Type')}
                      type="switch"
                      options={wepAuthenOptions}
                      value={auth}
                      onChange={(data) => {
                        const security = fromJS({
                          mode,
                          auth: data.value,
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
                        label={_('WEP Key Length')}
                        type="switch"
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
                      label={_('Key Format')}
                      type="switch"
                      options={keyTypeOptions}
                      value={keyType}
                      onChange={(data) => {
                        const security = fromJS({
                          mode,
                          auth,
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
                      label={_('Key Index')}
                      type="select"
                      options={keyIndexOptions}
                      value={keyIndex}
                      onChange={(data) => {
                        const security = fromJS({
                          mode,
                          auth,
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
                      label={_('Password')}
                      value={key || ''}
                      required
                      onChange={(data) => {
                        const security = fromJS({
                          mode,
                          auth,
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
                  type="range"
                  className="fl"
                  label={_('Distance')}
                  value={distance}
                  min="1"
                  max="10"
                  step="0.1"
                  hasTextInput
                  help="km"
                  disabled={autoAdjust === '1'}
                  onChange={data => this.updateItemInRadioList('distance', data.value)}
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
                    {_('auto')}
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
    const { ssid, countryCode, frequency, channelWidth, distance, wirelessMode } = store.getIn(['curData', 'radioList', radioId]).toJS();
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
                  label={_('Current Mode')}
                  value="AP"
                />
                <FormGroup
                  type="plain-text"
                  label={_('LAN IP')}
                  value={ip}
                />
                <FormGroup
                  type="plain-text"
                  label={_('Subnet Mask')}
                  value={mask}
                />

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
              </div>
              <div className="cols col-7">
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
                  label={_('Current Mode')}
                  value="Station"
                />

                <FormGroup
                  type="plain-text"
                  label={_('LAN IP')}
                  value={ip}
                />
                <FormGroup
                  type="plain-text"
                  label={_('Subnet Mask')}
                  value={mask}
                />
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
              </div>
              <div className="cols col-7">
                <FormGroup
                  type="plain-text"
                  label={_('Peer MAC')}
                  value={store.getIn(['curData', 'radioList', radioId, 'apMac'])}
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
                  label={_('Current Mode')}
                  value="Repeater"
                />
                <FormGroup
                  type="plain-text"
                  label={_('LAN IP')}
                  value={ip}
                />
                <FormGroup
                  type="plain-text"
                  label={_('Subnet Mask')}
                  value={mask}
                />

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
              </div>
              <div className="cols col-7">
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
                      if (mode === 'none' || mode === 'wep') return mode;
                      return mode.concat('/').concat(cipher);
                    }
                    return 'none';
                  })()
                  }
                />
                <FormGroup
                  type="plain-text"
                  label={_('Distance')}
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
    const store = this.props.store;
    const { deviceMode } = this.props.selfState.toJS();
    let wizardOptions = fromJS([
      {
        title: _('Operation Mode'),
        render: this.renderOperationMode,
      }, {
        title: _('Wireless Settings'),
        render: this.renderStepThree,
      }, {
        title: _('Confirm Settings'),
        render: this.renderStepFour,
      },
    ]);
    const titleMap = {
      ap: _('Scene: Access Point'),
      sta: _('Scene: Station'),
      repeater: _('Scene: Repeater'),
    };
    if (deviceMode) {
      wizardOptions = wizardOptions.setIn(
        [0, 'title'],
        titleMap[deviceMode]
      );
    }

    return (
      <div className="wrapall">
        <WizardContainer
          size="sm"
          title={_('Quick Setup')}
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
    dispatch
  );
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
  validator.mergeProps(validOptions)
)(QuickSetup);

export const quicksetup = reducer;
