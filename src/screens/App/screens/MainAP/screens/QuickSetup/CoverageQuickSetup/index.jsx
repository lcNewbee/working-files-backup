import React, { PropTypes } from 'react';
import { fromJS, Map } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import validator from 'shared/utils/lib/validator';
import utils from 'shared/utils';
import {
  FormGroup, FormInput, WizardContainer,
} from 'shared/components';
import * as appActions from 'shared/actions/app';
import * as settingActions from 'shared/actions/settings';
import * as selfActions from './actions';
import reducer from './reducer';
import './index.scss';

// 可配置功能项
/**
coverageQuickSetup: {
  router: true, // 是否有router模式
},
*/

const propTypes = {
  app: PropTypes.instanceOf(Map),
  fetch: PropTypes.func,
  selfState: PropTypes.instanceOf(Map),
  fetchSettings: PropTypes.func,
  changeDeviceMode: PropTypes.func,
  validateAll: PropTypes.func,
  product: PropTypes.instanceOf(Map),
  route: PropTypes.object,
  save: PropTypes.func,

  store: PropTypes.instanceOf(Map),
  updateItemSettings: PropTypes.func,
  // saveCountrySelectModal: PropTypes.func,
  // changeAgreeProtocol: PropTypes.func,
  // changeCountryCode: PropTypes.func,
  // changeCtyModal: PropTypes.func,
  resetVaildateMsg: PropTypes.func,
  changeShowScanResultStatus: PropTypes.func,
  changeScanStatus: PropTypes.func,
  changeSelectedResult: PropTypes.func,
  closeCountrySelectModal: PropTypes.func,
  // receiveCountryInfo: PropTypes.func,
  validateOption: PropTypes.object,
  // saveSettings: PropTypes.func,
  restoreSelfState: PropTypes.func,
  changeReinitAt: PropTypes.func,
  changeCurrRadioConfig: PropTypes.func,
};

const defaultState = {
  security: {
    mode: 'none',
    cipher: 'aes',
    auth: 'open',
    keyType: 'ASCII',
    keyIndex: '1',
  },
  ssid: 'Axilspot',
  vlanId: '1',
  routerInfo: {
    proto: 'dhcp',
    nat: '1',
  },
};

// const channelWidthOptions = [
//   { value: 'HT20', label: '20MHz' },
//   { value: 'HT40', label: '40MHz' },
//   { value: 'HT80', label: '80MHz' },
// ];

const staAndApSecurityOptions = [
  { value: 'none', label: 'None' },
  { value: 'wpa', label: 'WPA-PSK' },
  { value: 'wpa2', label: 'WPA2-PSK' },
  { value: 'wpa-mixed', label: 'WPA-PSK/WPA2-PSK' },
  { value: 'wep', label: 'WEP' },
];

// const repeaterSecurityOptions = [
//   { value: 'none', label: 'None' },
//   { value: 'wep', label: 'WEP' },
// ];

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
  validBrgLanIp: validator({
    rules: 'ip',
  }),
  validBrgLanMask: validator({
    rules: 'mask',
  }),
  validRutLanIp: validator({
    rules: 'ip',
  }),
  validRutLanMask: validator({
    rules: 'mask',
  }),
  validWanMask: validator({
    rules: 'mask',
  }),
  validWanIp: validator({
    rules: 'ip',
  }),
  validDns1: validator({
    rules: 'ip',
  }),
  validDns2: validator({
    rules: 'ip',
  }),
  validGateway: validator({
    rules: 'ip',
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
  validVlan: validator({
    rules: 'num:[1, 4094]',
  }),
});

// countryMap为Object
// function makeCountryOptions(map) {
//   const countryList = [];
//   for (const key of Object.keys(map)) {
//     const entry = {
//       label: _(key),
//       value: map[key],
//     };
//     countryList.push(entry);
//   }
//   return countryList;
// }

// function getCountryNameFromCode(code, map) {
//   for (const name of Object.keys(map)) {
//     if (map[name] === code) {
//       return _(name);
//     }
//   }
//   return '';
// }

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
      'initRadioOnEffect',
      'updateItemInRouterInfo',
      'generateRadioString',
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
    if (data.currStep === 0 && data.targetStep === 1) {
      const { ip, mask } = this.props.store.get('curData').toJS();
      const msg = validator.combineValid.noBroadcastIp(ip, mask);
      // console.log('ip&mask', ip + ',' + mask);
      if (msg) {
        return msg;
      }
    }
    if (data.currStep === 1 && data.targetStep === 2) {
      const radioOnEffect = this.props.store.getIn(['curData', 'radioOnEffect']).toJS();
      if (!radioOnEffect.some(val => val === '1')) { // 需要用户选择，而且必须选择至少一个
        return _('Please select at least one radio to apply the SSID');
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
    const saveData = this.props.store.get('curData').delete('radioList').toJS();
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

  generateRadioString() {
    const radioSelectOptions = this.props.product.get('radioSelectOptions').toJS();
    const radioOnEffect = this.props.store.getIn(['curData', 'radioOnEffect']).toJS();
    let str = '';
    radioOnEffect.forEach((val, i) => {
      if (val === '1' && str === '') {
        const ss = radioSelectOptions[i].label;
        str = `${ss}`;
      } else if (val === '1') {
        const ss = radioSelectOptions[i].label;
        str = `${str}、${ss}`;
      }
    });
    return str;
  }

  initRadioOnEffect() {
    const radioSelectOptions = this.props.product.get('radioSelectOptions').toJS();
    const radioOnEffect = fromJS(radioSelectOptions.map(() => '0')).set('0', '1');
    this.props.updateItemSettings({ radioOnEffect });
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
    props.fetchSettings()
      .then(() => {
        const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
        const wirelessMode = this.props.store.getIn(['curData', 'radioList', radioId, 'wirelessMode']);
        this.props.changeDeviceMode(wirelessMode);
        this.handleWrongSecurMode();
      }).then(() => {
        // 初始化SSID生效的radio列表
        this.initRadioOnEffect();
      }).then(() => {
        // 用radioList中第一个ssid名称初始化与radioList同级的ssid
        const ssid = this.props.store.getIn(['curData', 'radioList', '0', 'ssid']);
        console.log('ssid', ssid);
        props.updateItemSettings({ ssid });
      });
    props.resetVaildateMsg();
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

  updateItemInRadioList(name, value) {
    const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
    const radioList = this.props.store.getIn(['curData', 'radioList'])
                          .setIn([radioId, name], value);
    this.props.updateItemSettings({ radioList });
  }

  updateItemInRouterInfo(name, value) {
    const routerInfo = this.props.store.getIn(['curData', 'routerInfo']).set(name, value);
    this.props.updateItemSettings({ routerInfo });
  }

  renderOperationMode() {
    const store = this.props.store;
    const {
      validBrgLanIp, validBrgLanMask, validVlan, validWanIp, validWanMask, validGateway, validDns1,
      validDns2, validRutLanIp, validRutLanMask,
    } = this.props.validateOption;
    return (
      <div className="firstScreen">
        {
          this.props.route.funConfig.router ? (
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
                  checked={store.getIn(['curData', 'wiredMode']) === 'bridge'}
                  name="operationModeItem"
                  onClick={() => {
                    this.props.updateItemSettings({ wiredMode: 'bridge' });
                  }}
                />
                <FormInput
                  type="radio"
                  text={_('Router Mode')}
                  checked={store.getIn(['curData', 'wiredMode']) === 'router'}
                  name="operationModeItem"
                  onClick={() => {
                    this.props.updateItemSettings({ wiredMode: 'router' });
                  }}
                  style={{
                    marginLeft: '10px',
                  }}
                />
              </div>
            </FormGroup>
          ) : null
        }

        {
          // bridge mode
          store.getIn(['curData', 'wiredMode']) === 'bridge' ||
          !store.getIn(['curData', 'wiredMode']) ? (
            <div>
              <FormGroup
                type="text"
                label={_('IP')}
                value={store.getIn(['curData', 'ip'])}
                onChange={(data) => {
                  this.props.updateItemSettings({ ip: data.value });
                }}
                required
                {...validBrgLanIp}
              />
              <FormGroup
                type="text"
                label={_('Subnet Mask')}
                value={store.getIn(['curData', 'mask'])}
                onChange={(data) => {
                  this.props.updateItemSettings({ mask: data.value });
                }}
                required
                {...validBrgLanMask}
              />
              {/*
                <FormGroup
                  type="number"
                  label={_('VLAN ID')}
                  value={store.getIn(['curData', 'vlanId'])}
                  onChange={(data) => {
                    this.props.updateItemSettings({ vlanId: data.value });
                  }}
                  required
                  {...validVlan}
                />
              */}

            </div>
          ) : null
        }
        {
          // Router Mode
          store.getIn(['curData', 'wiredMode']) === 'router' ? (
            <div>
              <FormGroup
                type="select"
                label={_('Internet Connection Type')}
                options={[
                  { value: 'static', label: _('Static IP') },
                  { value: 'dhcp', label: _('DHCP') },
                  { value: 'pppoe', label: _('PPPOE') },
                ]}
                value={store.getIn(['curData', 'routerInfo', 'proto'])}
                onChange={(data) => {
                  this.updateItemInRouterInfo('proto', data.value);
                }}
              />
              {
                // dhcp
                store.getIn(['curData', 'routerInfo', 'proto']) === 'dhcp' ? (
                  <div>
                    <FormGroup
                      type="text"
                      label={_('LAN IP')}
                      value={this.props.store.getIn(['curData', 'routerInfo', 'lanIp'])}
                      onChange={(data) => {
                        this.updateItemInRouterInfo('lanIp', data.value);
                      }}
                      {...validRutLanIp}
                      required
                    />
                    <FormGroup
                      type="text"
                      label={_('LAN Mask')}
                      value={this.props.store.getIn(['curData', 'routerInfo', 'lanMask'])}
                      onChange={(data) => {
                        this.updateItemInRouterInfo('lanMask', data.value);
                      }}
                      required
                      {...validRutLanMask}
                    />
                  </div>
                ) : null
              }
              {
                // static
                store.getIn(['curData', 'routerInfo', 'proto']) === 'static' ? (
                  <div>
                    <FormGroup
                      label={_('WAN IP')}
                      type="text"
                      value={this.props.store.getIn(['curData', 'routerInfo', 'ip'])}
                      onChange={(data) => {
                        this.updateItemInRouterInfo('ip', data.value);
                      }}
                      required
                      {...validWanIp}
                    />
                    <FormGroup
                      label={_('Subnet Mask')}
                      type="text"
                      value={this.props.store.getIn(['curData', 'routerInfo', 'mask'])}
                      onChange={(data) => {
                        this.updateItemInRouterInfo('mask', data.value);
                      }}
                      required
                      {...validWanMask}
                    />
                    <FormGroup
                      type="text"
                      label={_('Gateway')}
                      value={this.props.store.getIn(['curData', 'routerInfo', 'gateway'])}
                      onChange={(data) => {
                        this.updateItemInRouterInfo('gateway', data.value);
                      }}
                      required
                      {...validGateway}
                    />
                    <FormGroup
                      type="text"
                      label={_('Primary DNS')}
                      value={this.props.store.getIn(['curData', 'routerInfo', 'dns1'])}
                      onChange={(data) => {
                        this.updateItemInRouterInfo('dns1', data.value);
                      }}
                      required
                      {...validDns1}
                    />
                    <FormGroup
                      type="text"
                      label={_('Secondary DNS')}
                      value={this.props.store.getIn(['curData', 'routerInfo', 'dns2'])}
                      onChange={(data) => {
                        this.updateItemInRouterInfo('dns2', data.value);
                      }}
                      {...validDns2}
                    />
                    <FormGroup
                      type="text"
                      label={_('LAN IP')}
                      value={this.props.store.getIn(['curData', 'routerInfo', 'lanIp'])}
                      onChange={(data) => {
                        this.updateItemInRouterInfo('lanIp', data.value);
                      }}
                      required
                      {...validRutLanIp}
                    />
                    <FormGroup
                      type="text"
                      label={_('LAN Mask')}
                      value={this.props.store.getIn(['curData', 'routerInfo', 'lanMask'])}
                      onChange={(data) => {
                        this.updateItemInRouterInfo('lanMask', data.value);
                      }}
                      required
                      {...validRutLanMask}
                    />
                  </div>
                ) : null
              }
              {
                // PPPOE
                store.getIn(['curData', 'routerInfo', 'proto']) === 'pppoe' ? (
                  <div>
                    <FormGroup
                      type="text"
                      label={_('Account')}
                      value={store.getIn(['curData', 'routerInfo', 'user'])}
                      onChange={(data) => {
                        this.updateItemInRouterInfo('user', data.value);
                      }}
                    />
                    <FormGroup
                      type="text"
                      label={_('Password')}
                      value={store.getIn(['curData', 'routerInfo', 'password'])}
                      onChange={(data) => {
                        this.updateItemInRouterInfo('password', data.value);
                      }}
                    />
                    <FormGroup
                      type="text"
                      label={_('LAN IP')}
                      value={this.props.store.getIn(['curData', 'routerInfo', 'lanIp'])}
                      onChange={(data) => {
                        this.updateItemInRouterInfo('lanIp', data.value);
                      }}
                      required
                      {...validRutLanIp}
                    />
                    <FormGroup
                      type="text"
                      label={_('LAN Mask')}
                      value={this.props.store.getIn(['curData', 'routerInfo', 'lanMask'])}
                      onChange={(data) => {
                        this.updateItemInRouterInfo('lanMask', data.value);
                      }}
                      required
                      {...validRutLanMask}
                    />
                  </div>
                ) : null
              }
              <FormGroup
                type="checkbox"
                checked={store.getIn(['curData', 'routerInfo', 'nat']) === '1'}
                label={_('NAT')}
                onChange={() => {
                  const val = store.getIn(['curData', 'routerInfo', 'nat']) === '1' ? '0' : '1';
                  this.updateItemInRouterInfo('nat', val);
                }}
              />
              <FormGroup
                type="checkbox"
                checked={store.getIn(['curData', 'routerInfo', 'dhcpEnable']) === '1'}
                label={_('DHCP Sever')}
                onChange={() => {
                  const val = store.getIn(['curData', 'routerInfo', 'dhcpEnable']) === '1' ? '0' : '1';
                  this.updateItemInRouterInfo('dhcpEnable', val);
                }}
              />
            </div>
          ) : null
        }
      </div>
    );
  }

  renderStepThree() {
    const { mode, key, auth, keyType, keyIndex, cipher } = this.props.store.getIn(['curData', 'security']).toJS();
    const { validSsid, validPassword } = this.props.validateOption;
    const radioSelectOptions = this.props.product.get('radioSelectOptions').toJS();

    return (
      <div className="thirdScreen">
        <div className="thirdForAp">
          <FormGroup
            type="text"
            label={_('SSID')}
            value={this.props.store.getIn(['curData', 'ssid'])}
            onChange={(data) => {
              this.props.updateItemSettings({ ssid: data.value });
            }}
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
                cipher: 'aes',
                auth: 'open',
                keyIndex: '1',
                keyLength: '64',
                keyType: 'Hex',
                key: '',
              });
              this.props.updateItemSettings({ security });
            }}
          />
          {
            /wpa/.test(mode) ? (
              <div>
                <FormGroup
                  label={_('Encryption')}
                  minWidth="66px"
                  type="switch"
                  value={cipher}
                  onChange={(data) => {
                    const security = fromJS({
                      mode,
                      key,
                      cipher: data.value,
                    });
                    this.props.updateItemSettings({ security });
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
                      cipher,
                    });
                    this.props.updateItemSettings({ security });
                  }}
                  required
                  {...validPassword}
                />
              </div>
            ) : null
          }
          {
              (mode === 'wep') ? (
                <div>
                  <FormGroup
                    label={_('Auth Type')}
                    type="switch"
                    options={wepAuthenOptions}
                    value={auth}
                    onChange={(data) => {
                      const security = this.props.store.getIn(['curData', 'security'])
                                            .set('auth', data.value);
                      this.props.updateItemSettings({ security });
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
                    value={keyType}
                    onChange={(data) => {
                      const security = this.props.store.getIn(['curData', 'security'])
                                              .set('keyType', data.value);
                      this.props.updateItemSettings({ security });
                    }}
                    minWidth="65px"
                  />
                  <FormGroup
                    label={_('Key Index')}
                    type="select"
                    options={keyIndexOptions}
                    value={keyIndex}
                    onChange={(data) => {
                      const security = this.props.store.getIn(['curData', 'security'])
                                      .set('keyIndex', data.value);
                      this.props.updateItemSettings({ security });
                    }}
                  />
                  <FormGroup
                    type="password"
                    required
                    label={_('Password')}
                    value={key}
                    onChange={(data) => {
                      const security = this.props.store.getIn(['curData', 'security'])
                                              .set('key', data.value);
                      this.props.updateItemSettings({ security });
                    }}
                    {...this.props.validateOption[this.props.store.getIn(['curData', 'security', 'keyType'])]}
                  />
                </div>
              ) : null
          }
          {
            radioSelectOptions.length > 1 ? (
              <FormGroup
                label={_('Radios Apply')}
              >
                {
                  radioSelectOptions.map((item, i) => (
                    <FormInput
                      type="checkbox"
                      theme="square"
                      key={i}
                      text={`${_(item.label)}`}
                      checked={this.props.store.getIn(['curData', 'radioOnEffect', i]) === '1'}
                      onChange={() => {
                        let radioOnEffect = this.props.store.getIn(['curData', 'radioOnEffect']);
                        if (radioOnEffect.get(i) === '1') {
                          radioOnEffect = radioOnEffect.set(i, '0');
                        } else {
                          radioOnEffect = radioOnEffect.set(i, '1');
                        }
                        this.props.updateItemSettings({ radioOnEffect });
                      }}
                      style={{
                        marginTop: '8px',
                        marginRight: '15px',
                      }}
                    />
                    ))
                }
              </FormGroup>
            ) : null
          }
        </div>
      </div>
    );
  }

  renderStepFour() {
    const store = this.props.store;
    const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
    const { deviceMode } = this.props.selfState.toJS();
    const { ip, mask, wiredMode, vlanId, security } = this.props.store.get('curData').toJS();
    const { wanIp, wanMask, lanIp, lanMask, nat, dhcpEnable, dns1, dns2, user, password } = this.props.store.getIn(['curData', 'routerInfo']).toJS();
    const ssid = store.getIn(['curData', 'radioList', radioId, 'ssid']);
    // const mode = store.getIn(['curData', 'radioList', radioId, 'security', 'mode']);
    // const cipher = store.getIn(['curData', 'radioList', radioId, 'security', 'cipher']);


    return (
      <div className="fourthScreen">
        {
          deviceMode === 'ap' && (wiredMode === 'bridge' || !wiredMode) ? (
            <div className="fourthForAp row">
              <div className="cols col-5">
                {
                  this.props.route.funConfig.router ? (
                    <FormGroup
                      type="plain-text"
                      label={_('Current Mode')}
                      value={wiredMode === 'bridge' ? 'AP' : wiredMode}
                    />
                  ) : null
                }
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
                {/*
                  <FormGroup
                    type="plain-text"
                    label={_('VLAN ID')}
                    value={vlanId}
                  />
                */}
                <FormGroup
                  type="plain-text"
                  label={_('SSID')}
                  value={ssid}
                />
                {
                  /wep/.test(security.mode) ? (
                    <div>
                      {
                        /wpa/.test(security.mode) ? (
                          <FormGroup
                            type="plain-text"
                            label={_('Security Mode')}
                            value={`${security.mode}/${security.cipher}`}
                          />
                        ) : (
                          <FormGroup
                            type="plain-text"
                            label={_('Security Mode')}
                            value={security.mode}
                          />
                        )
                      }
                    </div>
                  ) : null
                }
              </div>
              <div className="cols col-7">
                {
                  /wep/.test(security.mode) ? null : (
                    <div>
                      {
                        /wpa/.test(security.mode) ? (
                          <FormGroup
                            type="plain-text"
                            label={_('Security Mode')}
                            value={`${security.mode}/${security.cipher}`}
                          />
                        ) : (
                          <FormGroup
                            type="plain-text"
                            label={_('Security Mode')}
                            value={security.mode}
                          />
                        )
                      }
                    </div>
                  )
                }
                {
                  /wep/.test(security.mode) ? (
                    <div>
                      <FormGroup
                        type="plain-text"
                        label={_('Auth Type')}
                        value={security.auth}
                      />
                      <FormGroup
                        type="plain-text"
                        label={_('Key Format')}
                        value={security.keyType}
                      />
                      <FormGroup
                        type="plain-text"
                        label={_('Key Index')}
                        value={`key ${security.keyIndex}`}
                      />
                    </div>
                  ) : null
                }
                {
                  security.mode !== 'none' ? (
                    <FormGroup
                      type="plain-text"
                      label={_('Key')}
                      value={security.key}
                    />
                  ) : null
                }
                {
                  this.props.product.get('radioSelectOptions').size > 1 ? (
                    <FormGroup
                      type="plain-text"
                      label={_('Radio')}
                      value={this.generateRadioString()}
                    />
                  ) : null
                }
              </div>
            </div>
          ) : null
        }

        {
          deviceMode === 'ap' && wiredMode === 'router' ? (
            <div className="fourthForAp row">
              <div className="cols col-5">
                {
                  this.props.route.funConfig.router ? (
                    <FormGroup
                      type="plain-text"
                      label={_('Current Mode')}
                      value={wiredMode === 'bridge' ? 'AP' : wiredMode}
                    />
                  ) : null
                }
                {
                  this.props.store.getIn(['curData', 'routerInfo', 'proto']) === 'static' ? (
                    <div>
                      <FormGroup
                        type="plain-text"
                        label={_('WAN IP')}
                        value={wanIp}
                      />
                      <FormGroup
                        type="plain-text"
                        label={_('WAN Mask')}
                        value={wanMask}
                      />
                      <FormGroup
                        type="plain-text"
                        label={_('First DNS')}
                        value={dns1}
                      />
                      <FormGroup
                        type="plain-text"
                        label={_('Secondary DNS')}
                        value={dns2}
                      />
                    </div>
                  ) : null
                }
                {
                  this.props.store.getIn(['curData', 'routerInfo', 'proto']) === 'pppoe' ? (
                    <div>
                      <FormGroup
                        type="plain-text"
                        label={_('Account')}
                        value={user}
                      />
                      <FormGroup
                        type="plain-text"
                        label={_('Password')}
                        value={password}
                      />
                    </div>
                  ) : null
                }
                <FormGroup
                  type="plain-text"
                  label={_('LAN IP')}
                  value={lanIp}
                />
                <FormGroup
                  type="plain-text"
                  label={_('LAN Mask')}
                  value={lanMask}
                />
                <FormGroup
                  type="plain-text"
                  label={_('NAT')}
                  value={nat === '1' ? 'On' : 'Off'}
                />
                <FormGroup
                  type="plain-text"
                  label={_('DHCP Sever')}
                  value={dhcpEnable === '1' ? 'On' : 'Off'}
                />
              </div>
              <div className="cols col-7">
                <FormGroup
                  type="plain-text"
                  label={_('SSID')}
                  value={ssid}
                />
                {
                  /wpa/.test(security.mode) ? (
                    <FormGroup
                      type="plain-text"
                      label={_('Security Mode')}
                      value={`${security.mode}/${security.cipher}`}
                    />
                  ) : (
                    <FormGroup
                      type="plain-text"
                      label={_('Security Mode')}
                      value={security.mode}
                    />
                  )
                }
                {
                  /wep/.test(security.mode) ? (
                    <div>
                      <FormGroup
                        type="plain-text"
                        label={_('Auth')}
                        value={security.auth}
                      />
                      <FormGroup
                        type="plain-text"
                        label={_('Key Format')}
                        value={security.keyType}
                      />
                      <FormGroup
                        type="plain-text"
                        label={_('Key Index')}
                        value={security.keyIndex}
                      />
                    </div>
                  ) : null
                }
                {
                  security.mode !== 'none' ? (
                    <FormGroup
                      type="plain-text"
                      label={_('Key')}
                      value={security.key}
                    />
                  ) : null
                }
                <FormGroup
                  type="plain-text"
                  label={_('Radio')}
                  value={this.generateRadioString()}
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
    // const { deviceMode } = this.props.selfState.toJS();
    const wizardOptions = fromJS([
      {
        title: _('Wired Settings'),
        render: this.renderOperationMode,
      }, {
        title: _('Wireless Settings'),
        render: this.renderStepThree,
      }, {
        title: _('Confirm Settings'),
        render: this.renderStepFour,
      },
    ]);
    // const titleMap = {
    //   ap: _('Scene: Access Point'),
    //   sta: _('Scene: Station'),
    //   repeater: _('Scene: Repeater'),
    // };
    // if (deviceMode) {
    //   wizardOptions = wizardOptions.setIn(
    //     [0, 'title'],
    //     titleMap[deviceMode],
    //   );
    // }

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
    dispatch,
  );
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
  validator.mergeProps(validOptions),
)(QuickSetup);

export const quicksetup = reducer;
