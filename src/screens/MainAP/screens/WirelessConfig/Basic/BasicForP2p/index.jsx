import React from 'react'; import PropTypes from 'prop-types';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { Map, fromJS, List } from 'immutable';
import validator from 'shared/validator';
import { bindActionCreators } from 'redux';
import Input from 'shared/components/Form/atom/Input';
import Icon from 'shared/components/Icon';
import { FormGroup, FormInput, Modal, Table, SaveButton, icon } from 'shared/components';
import { Button } from 'shared/components/Button';
import { actions as appActions } from 'shared/containers/app';
import { actions } from 'shared/containers/settings';
import * as selfActions from './actions';
import reducer from './reducer';
import countryMap from './country';

import './index.scss';

// 可配置功能项
/**
basic: {
  devicemodeOptions: [
    { value: 'ap', label: __('AP') },
    { value: 'sta', label: __('Station') },
    { value: 'repeater', label: __('Repeater') },
  ],
  // 功能项参见WirelessConfig -> Basic页面下的ssidTableFullMemberOptions变量
  ssidTableKeys: ['enable', 'ssid', 'vlanId', 'hideSsid', 'isolation',
                  'security', 'delete', 'maxClients', 'airTimeEnable'],
}
 */

const propTypes = {
  app: PropTypes.instanceOf(Map),
  save: PropTypes.func,
  store: PropTypes.instanceOf(Map),
  selfState: PropTypes.instanceOf(Map),
  validateAll: PropTypes.func,
  route: PropTypes.object,
  // initSettings: PropTypes.func,
  // fetchSettings: PropTypes.func,
  fetch: PropTypes.func,
  // saveSettings: PropTypes.func,
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
  changeTitleShowIcon: PropTypes.func,
  changeTableItemForSsid: PropTypes.func,
  createModal: PropTypes.func,
  updateSelfItemSettings: PropTypes.func,
  updateBasicSettings: PropTypes.func,
  updateMultiSsidItem: PropTypes.func,
  updateRadioSettingsItem: PropTypes.func,
  changeWhichButton: PropTypes.func,
  restoreSelfState: PropTypes.func,
  changeCurrRadioConfig: PropTypes.func,
  productInfo: PropTypes.instanceOf(Map),
  changeSsidTableOptions: PropTypes.func,
  changeShowSpeedLimitModal: PropTypes.func,
  changeApMacInput: PropTypes.func,
  changeShowMacHelpInfo: PropTypes.func,
  // changeAirTimeEnable: PropTypes.func,
  changeTransferData: PropTypes.func,
};

const defaultProps = {};
let vlanEnable = '0';

// const devicemodeOptions = [
//   { value: 'ap', label: __('AP') },
//   { value: 'sta', label: __('Station') },
//   { value: 'repeater', label: __('Repeater') },
// ];

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

/*
const wepKeyLengthOptions = [
  { value: '64', label: '64bit' },
  { value: '128', label: '128bit' },
];
*/

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

const radioModeOptionsFor5g = [
  // { value: 'auto', label: 'auto' },
  { value: '11a', label: '802.11a' },
  { value: '11na', label: '802.11na' },
  { value: '11ac', label: '802.11ac' },
];

const radioModeOptionsFor2g = [
  // { value: 'auto', label: 'auto' },
  { value: '11b', label: '802.11b' },
  { value: '11g', label: '802.11g' },
  { value: '11bg', label: '802.11bg' },
  { value: '11ng', label: '802.11bgn' },
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
  validMacInput: validator({
    rules: 'mac',
  }),
  validPwd1: validator({
    rules: 'pwd|len:[8, 32]',
  }),
  validPwd2: validator({
    rules: 'pwd|len:[8, 32]',
  }),
  Hex: validator({
    rules: 'hex|len:[10, 10]',
  }),
  ASCII: validator({
    rules: 'ascii|len:[5, 5]',
  }),
  validVlanId: validator({
    rules: 'num:[1, 4094]',
  }),
  validMaxClients: validator({
    rules: 'num:[1, 50]',
  }),
  validUpload: validator({
    rules: 'num:[1, 1000]',
  }),
  validDownload: validator({
    rules: 'num:[1, 1000]',
  }),
  validTxpower: validator({
    rules: 'num:[1, 32]',
  }),
});

function getCountryNameFromCode(code, map) {
  for (const name of Object.keys(map)) {
    if (map[name] === code) {
      return __(name);
    }
  }
  return '';
}

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

export default class Basic extends React.Component {

  constructor(props) {
    super(props);
    this.onSave = this.onSave.bind(this);
    this.onHideSsidboxClick = this.onHideSsidboxClick.bind(this);
    // this.onAutoRepeatBoxClick = this.onAutoRepeatBoxClick.bind(this);
    this.onStopScanClick = this.onStopScanClick.bind(this);
    this.onScanBtnClick = this.onScanBtnClick.bind(this);
    this.onModalOkBtnClick = this.onModalOkBtnClick.bind(this);
    this.onModalCloseBtnClick = this.onModalCloseBtnClick.bind(this);
    this.onSelectScanResultItem = this.onSelectScanResultItem.bind(this);
    this.onChengeWirelessMode = this.onChengeWirelessMode.bind(this);
    this.noErrorThisPage = this.noErrorThisPage.bind(this);
    this.onCloseCountrySelectModal = this.onCloseCountrySelectModal.bind(this);
    this.makeChannelOptions = this.makeChannelOptions.bind(this);
    // this.onShowIconClick = this.onShowIconClick.bind(this);
    this.onSecurityModeChange = this.onSecurityModeChange.bind(this);
    this.onAddNewSsidItem = this.onAddNewSsidItem.bind(this);
    this.onDeleteBtnClick = this.onDeleteBtnClick.bind(this);
    this.onSsidItemChange = this.onSsidItemChange.bind(this);
    this.fetchFullPageData = this.fetchFullPageData.bind(this);
    this.firstInAndRefresh = this.firstInAndRefresh.bind(this);
    // this.makeRadioSelectOptions = this.makeRadioSelectOptions.bind(this);
    this.onChangeRadio = this.onChangeRadio.bind(this);
    this.makeSsidTableOptions = this.makeSsidTableOptions.bind(this);
    this.sortMacOrder = this.sortMacOrder.bind(this);
    // this.getAirTimeEnable = this.getAirTimeEnable.bind(this);
    this.getChannelListAndPowerRange = this.getChannelListAndPowerRange.bind(this);
    this.state = {
      ssidTableFullMemberOptions: fromJS([
        {
          id: 'enable',
          label: __('Enable'),
          width: '300px',
          render: function (val, item) {
            const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
            const pos = this.props.selfState.getIn(['multiSsid', 'radioList', radioId, 'vapList']).keyOf(item);
            const flag = pos === 0;
            return (
              <FormInput
                type="checkbox"
                checked={val === '1'}
                disabled={flag}
                onChange={() => this.onSsidItemChange(val, item, 'enable', (val === '1' ? '0' : '1'))}
                style={{
                  marginLeft: '3px',
                }}
              />
            );
          }.bind(this),
        },
        {
          id: 'ssid',
          label: __('SSID'),
          width: '250px',
          render: function (val, item) {
            const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
            const pos = this.props.selfState.getIn(['multiSsid', 'radioList', radioId, 'vapList']).keyOf(item);
            return (
              <FormInput
                type="text"
                value={val}
                disabled={pos === 0}
                onChange={(data) => {
                  if (data.value.length <= 31) {
                    this.onSsidItemChange(val, item, 'ssid', data.value);
                  }
                }}
                style={{
                  marginLeft: '-60px',
                  height: '29px',
                }}
              />
            );
          }.bind(this),
        },
        {
          id: 'vlanId',
          label: __('VLAN ID'),
          width: '250px',
          render: function (val, item) {
            // const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
            // const pos = this.props.selfState.getIn(['multiSsid', 'radioList', radioId, 'vapList']).keyOf(item);
            return (
              <FormInput
                type="number"
                value={val}
                disabled={vlanEnable === '0'}
                onChange={(data) => {
                  this.onSsidItemChange(val, item, 'vlanId', data.value);
                }}
                style={{
                  marginLeft: '-30px',
                  height: '29px',
                  width: '100px',
                }}
              />
            );
          }.bind(this),
        },
        {
          id: 'maxClients',
          label: __('Max Clients'),
          width: '250px',
          render: function (val, item) {
            if (val === '' || !Number.isInteger(+val) || parseInt(val, 10) <= 0) {
              this.onSsidItemChange(val, item, 'maxClients', '64');
            } // 后台没传值，或值错误，则提供默认值
            return (
              <FormInput
                type="number"
                value={val}
                max={100}
                min={1}
                onChange={(data) => {
                  this.onSsidItemChange(val, item, 'maxClients', data.value);
                }}
                style={{
                  marginLeft: '-22px',
                  height: '29px',
                  width: '100px',
                }}
              />
            );
          }.bind(this),
        },
        {
          id: 'airTimeEnable',
          label: __('Airtime Fairness'),
          width: '250px',
          render: function (val, item) {
            return (
              <FormInput
                type="checkbox"
                checked={val === '1'}
                // disabled={airTimeEnable === 0}
                onChange={
                  () => this.onSsidItemChange(val, item, 'airTimeEnable', (val === '1' ? '0' : '1'))
                }
                style={{ marginLeft: '30px' }}
              />
            );
          }.bind(this),
        },
        {
          id: 'hideSsid',
          label: __('Hide'),
          width: '200px',
          render: function (val, item) {
            return (
              <FormInput
                type="checkbox"
                checked={val === '1'}
                // disabled={pos === 0}
                onChange={
                  () => this.onSsidItemChange(val, item, 'hideSsid', (val === '1' ? '0' : '1'))
                }
              />
            );
          }.bind(this),
        },
        {
          id: 'isolation',
          label: __('Client Isolation'),
          width: '200px',
          render: function (val, item) {
            return (
              <FormInput
                type="checkbox"
                checked={val === '1'}
                // disabled={pos === 0}
                onChange={
                  () => this.onSsidItemChange(val, item, 'isolation', (val === '1' ? '0' : '1'))
                }
                style={{ marginLeft: '20px' }}
              />
            );
          }.bind(this),
        },
        {
          id: 'portalEnable',
          label: __('Portal'),
          width: '200px',
          render: function (val, item) {
            return (
              <FormInput
                type="checkbox"
                checked={val === '1'}
                onChange={
                  () => this.onSsidItemChange(val, item, 'portalEnable', (val === '1' ? '0' : '1'))
                }
              />
            );
          }.bind(this),
        },
        {
          id: 'security',
          label: __('Security Edit'),
          width: '200px',
          render: function (val, item) {
            const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
            const pos = this.props.selfState.getIn(['multiSsid', 'radioList', radioId, 'vapList']).keyOf(item);
            return (
              <div style={{ marginLeft: '8px' }}>
                <Button
                  text={__('Edit')}
                  icon="pencil-square"
                  size="sm"
                  disabled={pos === 0}
                  onClick={() => {
                    const tableItemForSsid = fromJS({}).set('val', val)
                          .set('item', item).set('isShow', '1')
                          .set('pos', pos);
                    this.props.changeTableItemForSsid(tableItemForSsid);
                  }}
                />
              </div>
            );
          }.bind(this),
        },
        {
          id: 'speedLimit',
          label: __('Speed Limit'),
          width: '200px',
          render: function (val, item) {
            const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
            const pos = this.props.selfState.getIn(['multiSsid', 'radioList', radioId, 'vapList']).keyOf(item);
            return (
              <div style={{ marginLeft: '7px' }}>
                <Button
                  text={__('Edit')}
                  icon="pencil-square"
                  size="sm"
                  onClick={() => {
                    const tableItemForSsid = fromJS({}).set('val', val)
                          .set('item', item).set('isShow', '0')
                          .set('pos', pos);
                    this.props.changeShowSpeedLimitModal(true);
                    this.props.changeTableItemForSsid(tableItemForSsid);
                  }}
                />
              </div>
            );
          }.bind(this),
        },
        {
          id: 'delete',
          label: __('Delete'),
          width: '200px',
          render: function (val, item) {
            const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
            const pos = this.props.selfState.getIn(['multiSsid', 'radioList', radioId, 'vapList']).keyOf(item);
            return (
              <div style={{ marginLeft: '-12px' }}>
                <Button
                  text={__('Delete')}
                  icon="times"
                  size="sm"
                  disabled={pos === 0}
                  onClick={() => this.onDeleteBtnClick(item)}
                />
              </div>
            );
          }.bind(this),
        },
      ]),
    };
  }

  componentWillMount() {
    // console.log(this.props.app.get('radioSelectOptions'));
    this.firstInAndRefresh();
  }

  componentDidUpdate(prevProps) {
    if (this.props.app.get('refreshAt') !== prevProps.app.get('refreshAt')) {
      const asyncStep = Promise.resolve(this.props.restoreSelfState());
      asyncStep.then(() => {
        this.firstInAndRefresh();
      });
    }
  }

  componentWillUnmount() {
    this.props.leaveSettingsScreen();
    this.props.leaveScreen();
    this.props.resetVaildateMsg();
  }

  onSave(url, module, validID) {
    // module指selfState中的radioSettings,multiSsid,basicSettings
    const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
    this.props.validateAll(validID).then((msg) => {
      if (msg.isEmpty()) {
        const dataToSave = this.props.selfState.getIn([module, 'radioList', radioId]).toJS();
        this.props.save(url, dataToSave).then((json) => {
          if (json.state && json.state.code === 2000) {
            this.fetchFullPageData();
          }
        });
      }
    });
  }

  onHideSsidboxClick() {
    const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
    const basicSettings = this.props.selfState.get('basicSettings');
    const hideSsid = basicSettings.getIn(['radioList', radioId, 'vapList', '0', 'hideSsid']) === '1' ? '0' : '1';
    const radioList = basicSettings.get('radioList').setIn([radioId, 'vapList', '0', 'hideSsid'], hideSsid);
    this.props.updateBasicSettings({ radioList });
  }
  /*
  onAutoRepeatBoxClick() {
    const val = (this.props.store.getIn(['curData', 'autoRepeat']) === '1') ? '0' : '1';
    this.props.updateItemSettings({
      autoRepeat: val,
    });
  }
  */

  onStopScanClick() {
    this.props.changeScanStatus(false);
    this.props.changeShowScanResultStatus(false);
  }
  onScanBtnClick() {
    const query = this.props.selfState.get('currRadioConfig').toJS();
    this.props.changeScanStatus(true);
    this.props.fetch('goform/get_site_survey', query).then((json) => {
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
  onModalOkBtnClick() {
    const {
      mac, ssid, security, frequency, channelWidth,
    } = this.props.selfState.get('selectedResult').toJS();
    const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
    const basicSettings = this.props.selfState.get('basicSettings');
    if (!this.props.selfState.get('selectedResult').isEmpty()) {
      let peers = basicSettings.getIn(['radioList', radioId, 'vapList', '0', 'peers']);
      if (peers !== undefined) { peers = peers.set('0', mac); }
      let firstSsid = basicSettings.getIn(['radioList', radioId, 'vapList', '0'])
                        .set('peers', peers).set('ssid', ssid).set('apMac', mac)
                        .set('security', fromJS(security).set('key', ''))
                        .set('frequency', frequency)
                        .set('channelWidth', channelWidth);
      if (basicSettings.get('lockType') === '1') {
        // 处理华润定制的多Station桥接功能
        const scanResult = this.props.store.getIn(['curData', 'scanResult', 'siteList']);
        let apMacList = fromJS([]);
        scanResult.forEach((val) => {
          if (val.get('ssid') === ssid) apMacList = apMacList.push(val.get('mac'));
        });
        firstSsid = firstSsid.set('apMacList', apMacList.slice(0, 8));
      }

      const radioList = basicSettings.get('radioList').setIn([radioId, 'vapList', '0'], firstSsid);
      this.props.updateBasicSettings({ radioList });
      this.props.updateItemSettings({ scanResult: fromJS({}) });
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
    this.props.fetch('goform/get_wl_info_forTestUse').then((json) => {
      // 首先更新数据，防止之前修改模式但未保存时加密方式发生变化，目的是切换回去后显示原来的数据
      if (json.state && json.state.code === 2000) {
        const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
        let newRadioList = fromJS(json.data).setIn(['radioList', radioId, 'wirelessMode'], data.value);
        // 处理切换成repeater后，加密方式为空的问题
        if (data.value === 'repeater' && json.data.radioList[0].vapList[0].security.mode !== 'wep') {
          newRadioList = newRadioList.setIn(['radioList', radioId, 'vapList', 0, 'security', 'mode'], 'none');
        }
        this.props.updateBasicSettings(newRadioList);
        this.props.updateMultiSsidItem(newRadioList);
      }
    });
  }
  onCloseCountrySelectModal() {
    this.props.fetch('goform/get_base_wl_info').then((json) => {
      if (json.state && json.state.code === 2000) {
        this.props.closeCountrySelectModal(json.data.countryCode);
      }
    });
  }

  onSecurityModeChange(data) {
    const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
    const basicSettings = this.props.selfState.get('basicSettings');
    const preSecurity = basicSettings.getIn(['radioList', radioId, 'vapList', '0', 'security']);
    const mode = data.value;
    const Authentication = preSecurity.get('Authentication') || 'shared';
    const keyLength = preSecurity.get('keyLength') || '64';
    const keyType = preSecurity.get('keyType') || 'Hex';
    const key = '';
    const keyIndex = preSecurity.get('keyIndex') || '1';
    const cipher = preSecurity.get('cipher') || 'aes';
    const afterSecurity = preSecurity.set('mode', mode).set('Authentication', Authentication)
                          .set('keyType', keyType).set('keyLength', keyLength)
                          .set('keyIndex', keyIndex)
                          .set('cipher', cipher)
                          .set('key', key);
    const radioList = basicSettings.get('radioList')
                    .setIn([radioId, 'vapList', '0', 'security'], afterSecurity);
    this.props.updateBasicSettings({ radioList });
  }

  onAddNewSsidItem() {
    const newSsid = fromJS({
      flag: Math.random(),
      ssid: '',
      vlanId: '1',
      hideSsid: '0',
      enable: '1',
      portalEnable: '0',
      airTimeEnable: '0',
      maxClients: '64',
      security: {
        mode: 'none',
        cipher: 'aes',
        Authentication: 'open',
        keyLength: '64',
        keyType: 'Hex',
        keyIndex: '1',
        key: '',
      },
    });
    const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
    const vapList = this.props.selfState.getIn(['multiSsid', 'radioList', radioId, 'vapList']).push(newSsid);
    const radioList = this.props.selfState.getIn(['multiSsid', 'radioList']).setIn([radioId, 'vapList'], vapList);
    if (vapList.size <= 15) { // 最大支持15个SSID
      this.props.updateMultiSsidItem({ radioList });
    }
  }

  onDeleteBtnClick(item) {
    const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
    const multiSsid = this.props.selfState.get('multiSsid');
    const num = multiSsid.getIn(['radioList', radioId, 'vapList']).keyOf(item);
    const vapList = multiSsid.getIn(['radioList', radioId, 'vapList']).delete(num);
    const radioList = multiSsid.get('radioList').setIn([radioId, 'vapList'], vapList);
    this.props.updateMultiSsidItem({ radioList });
  }

  onSsidItemChange(val, item, valId, newVal) {
    const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
    const multiSsid = this.props.selfState.get('multiSsid');
    const itemNum = multiSsid.getIn(['radioList', radioId, 'vapList']).keyOf(item);
    const newItem = item.set(valId, newVal);
    // console.log('item', item, newItem);
    const vapList = multiSsid.getIn(['radioList', radioId, 'vapList']).set(itemNum, newItem);
    const radioList = this.props.selfState.getIn(['multiSsid', 'radioList'])
                          .setIn([radioId, 'vapList'], vapList);
    this.props.updateMultiSsidItem({ radioList });
  }

  onChangeRadio(data) { // 注意参数实际是data的value属性，这里表示radio序号
    const radioType = this.props.productInfo.getIn(['deviceRadioList', data.value, 'radioType']);
    const config = fromJS({
      radioId: data.value,
      radioType,
    });
    this.props.changeCurrRadioConfig(config);
    // this.getAirTimeEnable();
  }

  fetchFullPageData() {
    this.props.fetch('goform/get_base_wl_info_forTestUse').then((json) => {
      if (json.state && json.state.code === 2000) {
        const radioInfo = {
          curModule: 'radioSettings',
          data: fromJS(json.data),
        };
        // 根据国家和频段，获取信道列表信息
        const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
        const country = json.data.radioList[radioId].countryCode;
        this.props.changeCountryCode(country);
        const channelWidth = json.data.channelWidth;
        const saveInfo = {
          radio: this.props.selfState.getIn(['currRadioConfig', 'radioType']),
          country,
          channelWidth,
        };
        this.props.fetch('goform/get_country_info', saveInfo).then((json2) => {
          if (json2.state && json2.state.code === 2000) {
            this.props.receiveCountryInfo(json2.data);
          }
        });
        this.props.updateSelfItemSettings(radioInfo);
      }
    }).then(() => {
      this.props.fetch('goform/get_wl_info_forTestUse').then((json) => {
        if (json.state && json.state.code === 2000) {
          const radioList = fromJS(json.data).get('radioList')
                            .map((radio) => {
                              const vapList = radio.get('vapList').map(val => val.set('flag', Math.random()));
                              return radio.set('vapList', vapList);
                            });
          const dataToUpdate = fromJS(json.data).set('radioList', radioList);
          const basicInfo = {
            curModule: 'basicSettings',
            data: fromJS(json.data),
          };
          const multiSsidInfo = {
            curModule: 'multiSsid',
            data: dataToUpdate,
          };
          this.props.updateSelfItemSettings(basicInfo);
          this.props.updateSelfItemSettings(multiSsidInfo);
        }
      });
    }).then(() => { // 生成多SSID列表的options
      const funConfig = this.props.route.funConfig;
      const keysFromRoute = funConfig.ssidTableKeys;
      this.makeSsidTableOptions(this.state.ssidTableFullMemberOptions, keysFromRoute);
    });
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
    const channelOptions = channelList.map(val =>
       ({
         value: parseInt(val, 10).toString(),
         label: val,
       }),
    )
    .unshift({ value: 'auto', label: 'auto' })
    .toJS();
    return channelOptions;
  }

  firstInAndRefresh() {
    const props = this.props;
    const groupId = props.groupId || -1;
    this.onChangeRadio({// 修改当前射频为第一个radio
      value: '0',
    });
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
    this.fetchFullPageData();
    props.changeTitleShowIcon({ name: 'showRadioSetting', value: true });
    props.changeTitleShowIcon({ name: 'showSsidSetting', value: true });
    props.changeTitleShowIcon({ name: 'showMultiSsid', value: true });
    props.changeShowSpeedLimitModal(false);
    props.changeShowScanResultStatus(false);
    props.changeScanStatus(false);
    props.changeApMacInput('');
    props.changeTableItemForSsid(fromJS({
      isShow: '0',
      val: '',
      item: fromJS({}),
    }));
    props.fetch('goform/get_network_info').then((json) => {
      if (json.state && json.state.code === 2000) {
        vlanEnable = json.data.vlanEnable;
      }
    });
    const config = fromJS({
      radioId: '0',
      radioType: this.props.productInfo.getIn(['deviceRadioList', 0, 'radioType']),
    });
    this.props.changeCurrRadioConfig(config);
  }

  makeSsidTableOptions(fullOptions, keysFromRoute) {
    const keys = fromJS(keysFromRoute);
    const tableOptions = fullOptions.filter((item) => {
      const id = item.get('id');
      if (keys.includes(id)) return true;
      return false;
    });
    this.props.changeSsidTableOptions(tableOptions);
  }

  sortMacOrder(it, apMacList, direction) {
    const macVal = apMacList.get(it);
    let macList = apMacList;
    const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
    if (it < apMacList.size && direction === 'down') {
      macList = apMacList.insert(it + 2, macVal).delete(it);
    } else if (it > 0 && direction === 'up') {
      macList = apMacList.insert(it - 1, macVal).delete(it + 1);
    }
    const radioList = this.props.selfState.get('basicSettings').get('radioList')
                        .setIn([radioId, 'vapList', '0', 'apMacList'], macList);
    this.props.updateBasicSettings({ radioList });
  }

  getChannelListAndPowerRange(radioId) {
    const saveInfo = {
      // radio: this.props.productInfo.getIn(['deviceRadioList', radioId, 'radioType']),
      radioId,
      country: this.props.store.getIn(['curData', 'radioList', radioId, 'countryCode']),
      channelwidth: this.props.store.getIn(['curData', 'radioList', radioId, 'channelWidth']),
      // 快速设置中取不到该值，置为空，后台会处理
      radiomode: this.props.store.getIn(['curData', 'radioList', radioId, 'radioMode']) || '',
    };
    this.props.fetch('goform/get_country_info', saveInfo).then((json2) => {
      if (json2.state && json2.state.code === 2000) {
        this.props.receiveCountryInfo(json2.data);
      }
    });
  }

  render() {
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

    const { radioId, radioType } = this.props.selfState.get('currRadioConfig').toJS();
    const radioSettings = this.props.selfState.get('radioSettings');
    const multiSsid = this.props.selfState.get('multiSsid');
    const basicSettings = this.props.selfState.get('basicSettings');
    const {
      staApmac, apmac1, apmac2, apmac3, validSsid, validPwd1, validPwd2, validMaxClients,
      validDownload, validUpload, validTxpower,
    } = this.props.validateOption;
    const tableItemForSsid = this.props.selfState.get('tableItemForSsid');
    const funConfig = this.props.route.funConfig;
    const apMac = basicSettings.getIn(['radioList', radioId, 'vapList', '0', 'apMac']);
    const apMacList = basicSettings.getIn(['radioList', radioId, 'vapList', '0', 'apMacList']);
    // const keysFromRoute = funConfig.ssidTableKeys;
    if (this.props.store.get('curSettingId') === 'base') {
      return null;
    }
    return (
      <div className="stats-group">
        {
          this.props.productInfo.get('deviceRadioList').size > 1 ? (
            <FormInput
              type="switch"
              label={__('Radio Select')}
              value={this.props.selfState.getIn(['currRadioConfig', 'radioId'])}
              options={this.props.productInfo.get('radioSelectOptions')}
              minWidth="100px"
              onChange={(data) => {
                this.onChangeRadio(data);
                const saveInfo = {
                  radio: this.props.productInfo.getIn(['deviceRadioList', data.value, 'radioType']),
                  country: this.props.selfState.getIn(['radioSettings', 'radioList', data.value, 'countryCode']),
                  channelWidth: this.props.selfState.getIn(['radioSettings', 'radioList', data.value, 'channelWidth']),
                };
                this.props.fetch('goform/get_country_info', saveInfo).then((json2) => {
                  if (json2.state && json2.state.code === 2000) {
                    this.props.receiveCountryInfo(json2.data);
                  }
                });
              }}
              style={{
                marginRight: '10px',
                marginBottom: '15px',
              }}
            />
          ) : null
        }
        <Modal
          isShow={this.props.selfState.get('showScanResult')}
          onOk={this.onModalOkBtnClick}
          onClose={this.onModalCloseBtnClick}
          okText={__('Select')}
          cancelText={__('Cancel')}
          size="lg"
          okButton
          draggable
          cancelButton
        >
          <Table
            options={modalOptions}
            list={this.props.store.getIn(['curData', 'scanResult', 'siteList'])}
          />
        </Modal>{ /* SSID 扫描弹出框 */ }

        <div className="stats-group-cell">
          {
            this.props.selfState.get('showSsidSetting') ? (
              <icon
                className="fa fa-minus-square-o"
                size="lg"
                style={{
                  marginRight: '4px',
                }}
                onClick={() => this.props.changeTitleShowIcon({
                  name: 'showSsidSetting',
                  value: false,
                })}
              >
                <span
                  className="title-span"
                >
                  {__('Basic Settings')}
                </span>
              </icon>
            ) : (
              <icon
                className="fa fa-plus-square"
                size="lg"
                style={{
                  marginRight: '4px',
                }}
                onClick={() => this.props.changeTitleShowIcon({
                  name: 'showSsidSetting',
                  value: true,
                })}
              >
                <span
                  className="title-span"
                >
                  {__('Basic Settings')}
                </span>
              </icon>
            )
          }
        </div>
        {
          this.props.selfState.get('showSsidSetting') ? (
            <div
              className="stats-group-cell"
              style={{
                overflow: 'visible',
              }}
            >
              { // 模式选择下拉框
                funConfig.devicemodeOptions.length === 1 && funConfig.devicemodeOptions[0].value === 'ap' ? null : (
                  <FormGroup
                    type="select"
                    options={funConfig.devicemodeOptions}
                    value={basicSettings.getIn(['radioList', radioId, 'wirelessMode'])}
                    onChange={data => this.onChengeWirelessMode(data)}
                    label={__('Radio Mode')}
                  />
                )
              }
              { // SSID输入框**ap模式**
                basicSettings.getIn(['radioList', radioId, 'wirelessMode']) === 'ap' ? (
                  <div
                    className="clearfix"
                  >
                    <div
                      style={{
                        width: '370px',
                      }}
                      className="fl"
                    >
                      <FormGroup
                        label={__('SSID')}
                        className="fl"
                        form="basicSettings"
                        type="text"
                        value={basicSettings.getIn(['radioList', radioId, 'vapList', '0', 'ssid'])}
                        onChange={(data) => {
                          if (data.value.length <= 31) {
                            const radioList = basicSettings.get('radioList')
                                .setIn([radioId, 'vapList', '0', 'ssid'], data.value);
                            this.props.updateBasicSettings({ radioList });
                          }
                        }}
                        required
                        {...validSsid}
                      />
                    </div>
                    <div
                      style={{
                        display: 'inline-block',
                        marginTop: '11px',
                      }}
                      className="fl"
                    >
                      <input
                        style={{
                          marginBottom: '-2px',
                          marginRight: '4px',
                        }}
                        type="checkbox"
                        checked={basicSettings.getIn(['radioList', radioId, 'vapList', '0', 'hideSsid']) === '1'}
                        onClick={data => this.onHideSsidboxClick(data)}
                      />
                      {__('Hide')}
                    </div>
                  </div>
                ) : null
              }
              { // SSID输入框**station模式**
                basicSettings.getIn(['radioList', radioId, 'wirelessMode']) === 'sta' ? (
                  <div className="clearfix">
                    <div
                      style={{
                        width: '500px',
                      }}
                    >
                      <div
                        className="fl"
                        style={{
                          width: '370px',
                        }}
                      >
                        <FormGroup
                          label={__('Remote SSID')}
                          className="fl"
                          type="text"
                          value={basicSettings.getIn(['radioList', radioId, 'vapList', '0', 'ssid'])}
                          onChange={(data) => {
                            const radioList = basicSettings.get('radioList')
                                  .setIn([radioId, 'vapList', '0', 'ssid'], data.value);
                            this.props.updateBasicSettings({ radioList });
                          }}
                          required
                          {...validSsid}
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        paddingTop: '2px',
                      }}
                      className="fl"
                    >
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
                    </div>
                  </div>
                ) : null
              }
              { // SSID输入框**repeater模式**
                basicSettings.getIn(['radioList', radioId, 'wirelessMode']) === 'repeater' ? (
                  <div className="clearfix">
                    <div
                      style={{
                        width: '500px',
                      }}
                    >
                      <div
                        className="fl"
                        style={{
                          width: '370px',
                        }}
                      >
                        <FormGroup
                          label={__('Remote SSID')}
                          className="fl"
                          type="text"
                          value={basicSettings.getIn(['radioList', radioId, 'vapList', '0', 'ssid'])}
                          onChange={(data) => {
                            const radioList = basicSettings.get('radioList')
                                            .setIn([radioId, 'vapList', '0', 'ssid'], data.value);
                            this.props.updateBasicSettings({ radioList });
                          }}
                          required
                          {...validSsid}
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        paddingTop: '2px',
                      }}
                      className="fl"
                    >
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
                    </div>
                    <div
                      style={{
                        marginTop: '11px',
                        marginLeft: '4px',
                      }}
                      className="fl"
                    >
                      <input
                        type="checkbox"
                        checked={basicSettings.getIn(['radioList', radioId, 'vapList', '0', 'hideSsid']) === '1'}
                        onClick={data => this.onHideSsidboxClick(data)}
                      />
                      {__('Hide')}
                    </div>
                  </div>
                ) : null
              }
              <FormGroup
                type="number"
                label={__('VLAN ID')}
                value={basicSettings.getIn(['radioList', radioId, 'vapList', '0', 'vlanId'])}
                help={`${__('Range: ')}1~4094`}
                min="1"
                max="4094"
                form="basicSettings"
                disabled={vlanEnable === '0'}
                onChange={(data) => {
                  const radioList = basicSettings.get('radioList').setIn([radioId, 'vapList', 0, 'vlanId'], data.value);
                  this.props.updateBasicSettings({ radioList });
                }}
                required
                {...this.props.validateOption.validVlanId}
              />
              {
                basicSettings.getIn(['radioList', radioId, 'wirelessMode']) === 'repeater' ||
                basicSettings.getIn(['radioList', radioId, 'wirelessMode']) === 'ap' ? (
                  <FormGroup
                    label={__('Client Isolation')}
                    type="checkbox"
                    checked={basicSettings.getIn(['radioList', radioId, 'vapList', '0', 'isolation']) === '1'}
                    onChange={(data) => {
                      const radioList = basicSettings.get('radioList')
                                      .setIn([radioId, 'vapList', '0', 'isolation'], data.value);
                      this.props.updateBasicSettings({ radioList });
                    }}
                  />
                ) : null
              }
              {
                funConfig.portalFun &&
                basicSettings.getIn(['radioList', radioId, 'wirelessMode']) !== 'sta' ? (
                  <FormGroup
                    type="checkbox"
                    label={__('Portal Enable')}
                    checked={basicSettings.getIn(['radioList', radioId, 'vapList', '0', 'portalEnable']) === '1'}
                    onChange={(data) => {
                      const radioList = basicSettings.get('radioList')
                                      .setIn([radioId, 'vapList', '0', 'portalEnable'], data.value);
                      this.props.updateBasicSettings({ radioList });
                    }}
                  />
                ) : null
              }

              { // repeater模式下，对端AP的mac地址输入框
                (basicSettings.getIn(['radioList', radioId, 'wirelessMode']) === 'repeater') ? (
                  <div>
                    <FormGroup
                      label="WDS Peers"
                      type="text"
                      value={basicSettings.getIn(['radioList', radioId, 'vapList', '0', 'peers', '0']) || ''}
                      onChange={(data) => {
                        const peer1 = basicSettings.getIn(['radioList', radioId, 'vapList', '0', 'peers', '1']) || '';
                        const peer2 = basicSettings.getIn(['radioList', radioId, 'vapList', '0', 'peers', '2']) || '';
                        const radioList = basicSettings.get('radioList')
                                          .setIn([radioId, 'vapList', '0', 'peers', '0'], data.value)
                                          .setIn([radioId, 'vapList', '0', 'peers', '1'], peer1)
                                          .setIn([radioId, 'vapList', '0', 'peers', '2'], peer2);
                        this.props.updateBasicSettings({ radioList });
                      }}
                      {...apmac1}
                    />
                    <FormGroup
                      type="text"
                      value={basicSettings.getIn(['radioList', radioId, 'vapList', '0', 'peers', '1']) || ''}
                      onChange={(data) => {
                        const peer0 = basicSettings.getIn(['radioList', radioId, 'vapList', '0', 'peers', '0']) || '';
                        const peer2 = basicSettings.getIn(['radioList', radioId, 'vapList', '0', 'peers', '2']) || '';
                        const radioList = basicSettings.get('radioList')
                                          .setIn([radioId, 'vapList', '0', 'peers', '0'], peer0)
                                          .setIn([radioId, 'vapList', '0', 'peers', '1'], data.value)
                                          .setIn([radioId, 'vapList', '0', 'peers', '2'], peer2);
                        this.props.updateBasicSettings({ radioList });
                      }}
                      {... apmac2}
                    />
                    <FormGroup
                      type="text"
                      value={basicSettings.getIn(['radioList', radioId, 'vapList', '0', 'peers', '2']) || ''}
                      onChange={(data) => {
                        const peer0 = basicSettings.getIn(['radioList', radioId, 'vapList', '0', 'peers', '0']) || '';
                        const peer1 = basicSettings.getIn(['radioList', radioId, 'vapList', '0', 'peers', '1']) || '';
                        const radioList = basicSettings.get('radioList')
                                          .setIn([radioId, 'vapList', '0', 'peers', '0'], peer0)
                                          .setIn([radioId, 'vapList', '0', 'peers', '1'], peer1)
                                          .setIn([radioId, 'vapList', '0', 'peers', '2'], data.value);
                        this.props.updateBasicSettings({ radioList });
                      }}
                      {... apmac3}
                    />
                  </div>
                ) : null
              }
              { // station模式，lock to ap功能根据lockType值判断是否是华润定制
                (basicSettings.getIn(['radioList', radioId, 'wirelessMode']) === 'sta' && basicSettings.get('lockType') === '0') ? (
                  <div>
                    <FormGroup
                      label={__('Lock To AP')}
                      type="checkbox"
                      checked={basicSettings.getIn(['radioList', radioId, 'vapList', '0', 'apMacEnable']) === '1'}
                      onChange={(data) => {
                        const radioList = basicSettings.get('radioList')
                                        .setIn([radioId, 'vapList', '0', 'apMacEnable'], data.value);
                        this.props.updateBasicSettings({ radioList });
                      }}
                    />
                    {
                      basicSettings.getIn(['radioList', radioId, 'vapList', '0', 'apMacEnable']) === '1' ? (
                        <FormGroup
                          label={__('Peer Mac')}
                          form="basicSettings"
                          value={apMac}
                          onChange={(data) => {
                            const radioList = basicSettings.get('radioList')
                                            .setIn([radioId, 'vapList', '0', 'apMac'], data.value);
                            this.props.updateBasicSettings({ radioList });
                          }}
                          placeholder={__('not necessary')}
                          {...staApmac}
                        />
                      ) : null
                    }
                  </div>
                ) : null
              }
              { // station模式下，根据lockType判断是否是华润定制模式
                (basicSettings.getIn(['radioList', radioId, 'wirelessMode']) === 'sta' && basicSettings.get('lockType') === '1') ? (
                  <div>
                    <FormGroup
                      label={__('Lock To AP')}
                      type="checkbox"
                      checked={basicSettings.getIn(['radioList', radioId, 'vapList', '0', 'apMacEnable']) === '1'}
                      onChange={(data) => {
                        const radioList = basicSettings.get('radioList')
                                        .setIn([radioId, 'vapList', '0', 'apMacEnable'], data.value);
                        this.props.updateBasicSettings({ radioList });
                      }}
                    />
                    {
                      basicSettings.getIn(['radioList', radioId, 'vapList', '0', 'apMacEnable']) === '1' ? (
                        <div>
                          <div className="clearfix">
                            <FormGroup
                              className="fl"
                              label={__('Peer Mac')}
                            >
                              {
                                apMacList.size === 0 ? (
                                  <div className="paddingDiv" />
                                ) : (
                                  <ul className="apMacListWrap">
                                    {
                                      apMacList.toJS().map((val, it) => (
                                        <div
                                          className="clearfix"
                                          key={it}
                                        >
                                          <li
                                            className="apMacItem fl"
                                            onDragOver={(e) => {
                                              e.preventDefault();
                                            }}
                                            onDragStart={(e) => {
                                              // e.dataTransfer.setData('mac', e.target.innerHTML);
                                              this.props.changeTransferData(e.target.innerHTML);
                                            }}
                                            onDrop={(e) => {
                                              const dropMac = this.props.selfState.get('transferData');
                                              const targetMac = e.target.innerHTML;
                                              let macList = apMacList;
                                              const dropMacIter = macList.keyOf(dropMac);
                                              const targetMacIter = macList.keyOf(targetMac);

                                              if (typeof (dropMacIter) !== 'undefined' &&
                                                  typeof (targetMacIter) !== 'undefined' &&
                                                  targetMacIter >= dropMacIter) { // 向下移动
                                                macList = macList.insert(targetMacIter + 1, dropMac)
                                                          .delete(dropMacIter);
                                              } else if (typeof (dropMacIter) !== 'undefined' &&
                                                  typeof (targetMacIter) !== 'undefined' &&
                                                  targetMacIter < dropMacIter) {
                                                macList = macList.insert(targetMacIter, dropMac)
                                                          .delete(dropMacIter + 1);
                                              }
                                              const radioList = basicSettings.get('radioList')
                                                                .setIn([radioId, 'vapList', '0', 'apMacList'], macList);
                                              this.props.updateBasicSettings({ radioList });
                                              this.props.changeTransferData('');
                                            }}
                                            draggable
                                          >
                                            {val}
                                          </li>
                                          <Icon
                                            className="apMacIcon fl"
                                            name="arrow-down"
                                            onClick={() => { this.sortMacOrder(it, apMacList, 'down'); }}
                                          />
                                          <Icon
                                            className="apMacIcon fl"
                                            name="arrow-up"
                                            onClick={() => { this.sortMacOrder(it, apMacList, 'up'); }}
                                          />
                                          <Icon
                                            className="apMacIcon fl"
                                            name="close"
                                            id={it}
                                            onClick={(e) => {
                                              const macList = apMacList.delete(e.target.id);
                                              const radioList = basicSettings.get('radioList')
                                                                .setIn([radioId, 'vapList', '0', 'apMacList'], macList);
                                              this.props.updateBasicSettings({ radioList });
                                            }}
                                          />
                                        </div>
                                      ))
                                    }
                                  </ul>
                                )
                              }
                            </FormGroup>
                            <Icon
                              className="fl"
                              name="question-circle"
                              style={{ marginLeft: '5px' }}
                              onMouseOver={() => {
                                this.props.changeShowMacHelpInfo(true);
                              }}
                              onMouseOut={() => {
                                this.props.changeShowMacHelpInfo(false);
                              }}
                            />
                            {
                              this.props.selfState.get('showMacHelpInfo') ? (
                                <span
                                  className="fl peer-mac-notice"
                                >
                                  {__('Peers mac address table. The mac order represents the connection priority. The mac in higher order has the higher priority than mac bellow.The table allows you to drag to re-order to change the priority.')}
                                </span>
                              ) : null
                            }
                          </div>
                          <div className="clearfix">
                            <FormGroup
                              type="text"
                              className="fl"
                              form="macInputArea"
                              value={this.props.selfState.get('apMacInputData')}
                              onChange={(data) => {
                                this.props.changeApMacInput(data.value);
                              }}
                              style={{
                                width: '370px',
                                marginTop: '-2px',
                              }}
                              {...this.props.validateOption.validMacInput}
                            />
                            <Button
                              text={__('Add')}
                              className="fl"
                              theme="primary"
                              onClick={() => {
                                const val = this.props.selfState.get('apMacInputData').replace(/-/g, ':');
                                let macList = apMacList;
                                this.props.validateAll('macInputArea').then((msg) => {
                                  if (msg.isEmpty()) {
                                    if (macList.size >= 5) {
                                      this.props.createModal({
                                        id: 'settings',
                                        role: 'alert',
                                        text: __('Mac list number can not exceed 5.'),
                                      });
                                    } else if (macList.includes(val)) {
                                      this.props.createModal({
                                        id: 'settings',
                                        role: 'alert',
                                        text: __('The mac address already exists in the list!'),
                                      });
                                    } else if (val !== '') {
                                      macList = macList.push(val);
                                      const radioList = basicSettings.get('radioList')
                                                      .setIn([radioId, 'vapList', '0', 'apMacList'], macList);
                                      this.props.updateBasicSettings({ radioList });
                                      this.props.changeApMacInput('');
                                    }
                                  }
                                });
                              }}
                            />
                          </div>
                        </div>
                      ) : null
                    }
                  </div>
                ) : null
              }

              <div>
                { // 加密方式选择框
                  (basicSettings.getIn(['radioList', radioId, 'wirelessMode']) === 'sta' ||
                    basicSettings.getIn(['radioList', radioId, 'wirelessMode']) === 'ap') ? (
                      <div>
                        <FormGroup
                          label={__('Security')}
                          type="select"
                          options={staAndApSecurityOptions}
                          value={basicSettings.getIn(['radioList', radioId, 'vapList', '0', 'security', 'mode']) || 'none'}
                          onChange={data => this.onSecurityModeChange(data)}
                        />
                      </div>
                  ) : null
                }
                {
                  (basicSettings.getIn(['radioList', radioId, 'wirelessMode']) === 'repeater') ? (
                    <div>
                      <FormGroup
                        label={__('Security')}
                        type="select"
                        options={repeaterSecurityOptions}
                        value={basicSettings.getIn(['radioList', radioId, 'vapList', '0', 'security', 'mode'])}
                        onChange={data => this.onSecurityModeChange(data)}
                      />
                    </div>
                  ) : null
                }
                {
                  (basicSettings.getIn(['radioList', radioId, 'vapList', '0', 'security', 'mode']) === 'none' ||
                  basicSettings.getIn(['radioList', radioId, 'vapList', '0', 'security', 'mode']) === 'wep') ? null : (
                    <div>
                      <FormGroup
                        label={__('Encryption')}
                        minWidth="66px"
                        type="switch"
                        value={basicSettings.getIn(['radioList', radioId, 'vapList', '0', 'security', 'cipher'])}
                        onChange={(data) => {
                          const security = basicSettings.getIn(['radioList', radioId, 'vapList', '0', 'security'])
                                                  .set('cipher', data.value);
                          const radioList = basicSettings.get('radioList')
                                                  .setIn([radioId, 'vapList', '0', 'security'], security);
                          this.props.updateBasicSettings({ radioList });
                        }}
                        options={[
                          { label: 'AES', value: 'aes' },
                          { label: 'TKIP', value: 'tkip' },
                          { label: 'MIXED', value: 'aes&tkip' },
                        ]}
                      />
                      <FormGroup
                        label={__('Password')}
                        type="password"
                        form="basicSettings"
                        required
                        value={basicSettings.getIn(['radioList', radioId, 'vapList', '0', 'security', 'key'])}
                        onChange={(data) => {
                          const security = basicSettings.getIn(['radioList', radioId, 'vapList', '0', 'security'])
                                                        .set('key', data.value);
                          const radioList = basicSettings.get('radioList')
                                                      .setIn([radioId, 'vapList', '0', 'security'], security);
                          this.props.updateBasicSettings({ radioList });
                        }}
                        {...validPwd1}
                      />
                    </div>
                  )
                }
                {
                  (basicSettings.getIn(['radioList', radioId, 'vapList', '0', 'security', 'mode']) === 'wep') ? (
                    <div>
                      <FormGroup
                        label={__('Authentication Type')}
                        type="select"
                        options={wepAuthenOptions}
                        value={basicSettings.getIn(['radioList', radioId, 'vapList', '0', 'security', 'Authentication'])}
                        onChange={(data) => {
                          const security = basicSettings.getIn(['radioList', radioId, 'vapList', '0', 'security'])
                                          .set('Authentication', data.value);
                          const radioList = basicSettings.get('radioList')
                                          .setIn([radioId, 'vapList', '0', 'security'], security);
                          this.props.updateBasicSettings({ radioList });
                        }}
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
                                            .setIn(['radioList', radioId, '0', 'security'], security);
                            this.props.updateItemSettings({ vapList });
                          }}
                        />
                      */}
                      <FormGroup
                        label={__('Key Index')}
                        type="select"
                        options={keyIndexOptions}
                        value={basicSettings.getIn(['radioList', radioId, 'vapList', '0', 'security', 'keyIndex'])}
                        onChange={(data) => {
                          const security = basicSettings.getIn(['radioList', radioId, 'vapList', '0', 'security'])
                                          .set('keyIndex', data.value);
                          const radioList = basicSettings.get('radioList')
                                          .setIn([radioId, 'vapList', '0', 'security'], security);
                          this.props.updateBasicSettings({ radioList });
                        }}
                      />
                      <FormGroup
                        label={__('Key Format')}
                        type="select"
                        options={keyTypeOptions}
                        value={basicSettings.getIn(['radioList', radioId, 'vapList', '0', 'security', 'keyType'])}
                        onChange={(data) => {
                          const security = basicSettings.getIn(['radioList', radioId, 'vapList', '0', 'security'])
                                                  .set('keyType', data.value);
                          const radioList = basicSettings.get('radioList')
                                .setIn([radioId, 'vapList', '0', 'security'], security);
                          this.props.updateBasicSettings({ radioList });
                        }}
                      />
                      <FormGroup
                        type="password"
                        required
                        label={__('Password')}
                        form="basicSettings"
                        value={basicSettings.getIn(['radioList', radioId, 'vapList', '0', 'security', 'key'])}
                        onChange={(data) => {
                          const security = basicSettings.getIn(['radioList', radioId, 'vapList', '0', 'security'])
                                                  .set('key', data.value);
                          const radioList = basicSettings.get('radioList')
                                          .setIn([radioId, 'vapList', '0', 'security'], security);
                          this.props.updateBasicSettings({ radioList });
                        }}
                        {...this.props.validateOption[basicSettings.getIn(['radioList', radioId, 'vapList', '0', 'security', 'keyType'])]}
                      />
                    </div>
                  ) : null
                }
              </div>
              <FormGroup>
                <SaveButton
                  type="button"
                  loading={this.props.app.get('saving') &&
                          this.props.selfState.get('whichButton') === 'basicSettings'}
                  onClick={() => {
                    this.props.changeWhichButton('basicSettings');
                    this.onSave('goform/set_wireless', 'basicSettings', 'basicSettings');
                  }}
                />
              </FormGroup>
            </div>
          ) : null
        }

        <div className="stats-group-cell">
          {
            this.props.selfState.get('showRadioSetting') ? (
              <icon
                className="fa fa-minus-square-o"
                size="lg"
                onClick={() => this.props.changeTitleShowIcon({
                  name: 'showRadioSetting',
                  value: false,
                })}
              >
                <span
                  className="title-span"
                >
                  {__('Radio Settings')}
                </span>
              </icon>
            ) : (
              <icon
                className="fa fa-plus-square"
                size="lg"
                style={{
                  marginRight: '4px',
                }}
                onClick={() => this.props.changeTitleShowIcon({
                  name: 'showRadioSetting',
                  value: true,
                })}
              >
                <span
                  className="title-span"
                >
                  {__('Radio Settings')}
                </span>
              </icon>
            )
          }
        </div>
        {
          this.props.selfState.get('showRadioSetting') ? (
            <div
              className="stats-group-cell"
              style={{
                overflow: 'visible',
              }}
            >
              <FormGroup
                type="checkbox"
                label={__('Radio')}
                checked={radioSettings.getIn(['radioList', radioId, 'enable']) === '1'}
                onChange={(data) => {
                  const radioList = radioSettings.get('radioList').setIn([radioId, 'enable'], data.value);
                  this.props.updateRadioSettingsItem({ radioList });
                }}
              />
              <FormGroup
                label={__('Country')}
              >
                <FormInput
                  type="text"
                  value={getCountryNameFromCode(
                      this.props.selfState.get('selectedCountry'),
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
              { /* 国家代码弹出选择框 */
              }
              <Modal
                title={__('Country Code')}
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
                  onChange={() => { this.props.changeAgreeProtocol(true); }}
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
              <FormGroup
                label={__('Wireless Mode')}
                type="select"
                options={radioType === '5G' ? radioModeOptionsFor5g : radioModeOptionsFor2g}
                value={radioSettings.getIn(['radioList', radioId, 'radioMode'])}
                onChange={(data) => {
                  const radioList = radioSettings.get('radioList').setIn([radioId, 'radioMode'], data.value);
                  this.props.updateRadioSettingsItem({ radioList });
                }}
              />
              <FormGroup
                label={__('Channel')}
                type="select"
                options={this.makeChannelOptions()}
                value={radioSettings.getIn(['radioList', radioId, 'frequency']) || 'auto'}
                onChange={(data) => {
                  const radioList = radioSettings.get('radioList')
                                    .setIn([radioId, 'frequency'], data.value || 'auto');
                  this.props.updateRadioSettingsItem({ radioList });
                }}
              />
              { // 2.4G频宽
                radioSettings.getIn(['radioList', radioId, 'radioMode']) === '11ng' &&
                this.props.selfState.getIn(['currRadioConfig', 'radioType']) === '2.4G' ? (
                  <FormGroup
                    label={__('Channel Bandwidth')}
                    type="switch"
                    minWidth="99px"
                    options={channelWidthOptions.slice(0, 2)}
                    value={radioSettings.getIn(['radioList', radioId, 'channelWidth'])}
                    onChange={(data) => {
                      const radioList = radioSettings.get('radioList')
                                        .setIn([radioId, 'channelWidth'], data.value);
                      this.props.updateRadioSettingsItem({ radioList });
                    }}
                  />
                ) : null
              }
              { // 5G频宽
                this.props.selfState.getIn(['currRadioConfig', 'radioType']) === '5G' &&
                (radioSettings.getIn(['radioList', radioId, 'radioMode']) === '11ac' ||
                radioSettings.getIn(['radioList', radioId, 'radioMode']) === '11na') ? (
                  <FormGroup
                    label={__('Channel Bandwidth')}
                    type="switch"
                    minWidth="66px"
                    options={channelWidthOptions}
                    value={radioSettings.getIn(['radioList', radioId, 'channelWidth'])}
                    onChange={(data) => {
                      const radioList = radioSettings.get('radioList')
                                        .setIn([radioId, 'channelWidth'], data.value);
                      this.props.updateRadioSettingsItem({ radioList });
                    }}
                  />
                ) : null
              }
              {
                funConfig.radioMaxClientsLimit ? (
                  <FormGroup
                    label={__('Max Clients')}
                    type="number"
                    form="maxradioclients"
                    value={radioSettings.getIn(['radioList', radioId, 'maxRadioClients'])}
                    onChange={(data) => {
                      const radioList = radioSettings.get('radioList')
                                        .setIn([radioId, 'maxRadioClients'], data.value);
                      this.props.updateRadioSettingsItem({ radioList });
                    }}
                    help={`${__('Range: ')}1 ~ 50`}
                    min="1"
                    max="50"
                    required
                    {...validMaxClients}
                  />
                ) : null
              }
              <FormGroup
                label={__('Tx Power')}
                type="number"
                min="3"
                max={this.props.selfState.get('maxTxpower')}
                value={radioSettings.getIn(['radioList', radioId, 'txPower'])}
                onChange={(data) => {
                  const radioList = radioSettings.get('radioList')
                                    .setIn([radioId, 'txPower'], data.value);
                  this.props.updateRadioSettingsItem({ radioList });
                }}
                help={`${__('Range: ')} 3~${this.props.selfState.get('maxTxpower')} dBm`}
                {...validTxpower}
              />
              {
                /**
                <FormGroup
                  label={__('Output Power')}
                >
                  <div
                    className="clearfix"
                    style={{
                      padding: '0',
                    }}
                  >
                    <Input
                      type="range"
                      step="0.1"
                      min="1"
                      ref={(rangeInput) => { this.rangeInput = rangeInput; }}
                      max={this.props.selfState.get('maxTxpower')}
                      value={radioSettings.getIn(['radioList', radioId, 'txPower'])}
                      onChange={(data) => {
                        let val = data.value;
                        const max = Number(this.props.selfState.get('maxTxpower'));
                        if (val > max) val = max;
                        const radioList = radioSettings.get('radioList')
                                          .setIn([radioId, 'txPower'], val);
                        this.props.updateRadioSettingsItem({ radioList });
                      }}
                      className="fl"
                      style={{
                        display: 'inline-block',
                        padding: '0',
                        margin: '-4px 0 0 0',
                        height: '40px',
                        backgroundColor: '#f2f2f2',
                      }}
                    />
                    <Input
                      type="number"
                      step="0.1"
                      min="1"
                      className="fl"
                      ref={(numberInput) => { this.numberInput = numberInput; }}
                      max={this.props.selfState.get('maxTxpower')}
                      value={radioSettings.getIn(['radioList', radioId, 'txPower'])}
                      onChange={(e) => {
                        const radioList = radioSettings.get('radioList')
                                          .setIn([radioId, 'txPower'], e.target.value);
                        this.props.updateRadioSettingsItem({ radioList });
                      }}
                      style={{
                        marginLeft: '4px',
                        width: '50px',
                      }}
                    />
                  </div>
                </FormGroup>
                 *
                 */
              }

              <FormGroup>
                <SaveButton
                  type="button"
                  loading={this.props.app.get('saving') &&
                          this.props.selfState.get('whichButton') === 'radioSettings'}
                  onClick={() => {
                    this.props.validateAll('maxradioclients').then((msg) => {
                      if (msg.isEmpty()) {
                        this.props.changeWhichButton('radioSettings');
                        this.onSave('goform/set_base_wl', 'radioSettings', 'radioSettings');
                      }
                    });
                  }}
                />
              </FormGroup>
              {
                /*
                <FormGroup
                  label={__('Rate Set')}
                  type="select"
                  value={rateSet}
                  options={rateOptions}
                  onChange={(data) => this.props.updateItemSettings({
                    maxTxRate: data.value,
                  })}
                />
                */
              }
            </div>
          ) : null
        }

        <div className="stats-group-cell">
          {
            this.props.selfState.get('showMultiSsid') ? (
              <icon
                className="fa fa-minus-square-o"
                size="lg"
                style={{ marginRight: '4px' }}
                onClick={() => {
                  this.props.changeTitleShowIcon({
                    name: 'showMultiSsid',
                    value: false,
                  });
                  // this.makeSsidTableOptions(ssidTableFullMemberOptions, keysFromRoute);
                }}
              >
                <span
                  className="title-span"
                >
                  {__('Multiple SSID')}
                </span>
              </icon>
            ) : (
              <icon
                className="fa fa-plus-square"
                size="lg"
                style={{ marginRight: '4px' }}
                onClick={() => {
                  this.props.changeTitleShowIcon({
                    name: 'showMultiSsid',
                    value: true,
                  });
                  // this.makeSsidTableOptions(ssidTableFullMemberOptions, keysFromRoute);
                }}
              >
                <span
                  className="title-span"
                >
                  {__('Multiple SSID')}
                </span>
              </icon>
            )
          }
        </div>
        {
          this.props.selfState.get('showMultiSsid') ? (
            <div className="stats-group-cell">
              <span>{__('Notice: The first SSID can\'t be modefied here !')}</span>
              <Table
                options={this.props.selfState.get('ssidTableOptions')}
                list={(() => {
                  const list = fromJS([]);
                  if (multiSsid.getIn(['radioList', radioId])) {
                    if (multiSsid.getIn(['radioList', radioId, 'wirelessMode']) !== 'sta') {
                      return multiSsid.getIn(['radioList', radioId, 'vapList']);
                    }
                    return multiSsid.getIn(['radioList', radioId, 'vapList']).setSize(1);
                  }
                  return list;
                })()
                }
              />
              <div
                className="stats-group-cell"
                style={{ marginTop: '10px' }}
              >
                <Button
                  text={__('Add')}
                  icon="plus"
                  onClick={() => this.onAddNewSsidItem()}
                  style={{ marginRight: '10px' }}
                  disabled={multiSsid.getIn(['radioList', radioId, 'wirelessMode']) === 'sta'}
                />
                <SaveButton
                  type="button"
                  loading={this.props.app.get('saving') &&
                          this.props.selfState.get('whichButton') === 'multiSsid'}
                  // disabled={multiSsid.get('wirelessMode') === 'sta'}
                  onClick={() => {
                    let error = '';
                    let totalNum = 0;
                    const vapList = multiSsid.getIn(['radioList', radioId, 'vapList']).toJS();
                    const radioClientLimit = radioSettings.getIn(['radioList', radioId, 'maxRadioClients']);
                    const len = multiSsid.getIn(['radioList', radioId, 'wirelessMode']) === 'sta' ? 1 : vapList.length;
                    const re = /^[0-9]*[1-9][0-9]*$/;
                    for (let i = 0; i < len; i++) {
                      if (!re.test(vapList[i].vlanId)) {
                        error = __('Vlan ID must be positive interger !');
                        break;
                      }
                      if (vapList[i].vlanId < 1 || vapList[i].vlanId > 4094) {
                        error = __('Vlan ID number out of range ! (1 ~ 4094)');
                        break;
                      }
                      if (vapList[i].ssid === '') {
                        error = __('SSID can not be empty string !');
                        break;
                      }
                      // for (let j = i + 1; j < len; j++) {
                      //   if (vapList[i].ssid === vapList[j].ssid) {
                      //     error = 'The same ssid are not allowed!';
                      //     break;
                      //   }
                      // }
                      // 判断是否有该功能，没有则不验证
                      if (this.props.route.funConfig.ssidTableKeys.indexOf('maxClients') !== -1) {
                        if (vapList[i].maxClients === '' ||
                            !Number.isInteger(+vapList[i].maxClients) ||
                            parseInt(vapList[i].maxClients, 10) <= 0) {
                          error = __('Max clients number must be positive interger !');
                          break;
                        }
                        totalNum += Number(vapList[i].maxClients);
                      }
                    }
                    if (funConfig.radioMaxClientsLimit && // 射频最大客户端限制功能存在
                        radioClientLimit !== 0 && // 为零表示不限制
                        totalNum > radioClientLimit) {
                      error = `${__('The total number of ssid maximum clients should not exceed ')}${radioClientLimit}`;
                    }
                    // console.log('error', totalNum, radioClientLimit);
                    if (error === '') {
                      this.props.changeWhichButton('multiSsid');
                      this.onSave('goform/set_wireless', 'multiSsid', 'multiSsid');
                    } else {
                      this.props.createModal({
                        id: 'settings',
                        role: 'alert',
                        text: error,
                      });
                    }
                  }}
                />
              </div>
            </div>
          ) : null
        }

        <Modal
          title={__('Speed Limit')}
          isShow={this.props.selfState.get('showSpeedLimitModal')}
          draggable
          onOk={() => {
            this.props.validateAll('speedlimitform').then((msg) => {
              if (msg.isEmpty()) {
                const pos = tableItemForSsid.get('pos');
                const vapList = multiSsid.getIn(['radioList', radioId, 'vapList'])
                                .set(pos, tableItemForSsid.get('item'));
                const radioList = multiSsid.get('radioList').setIn([radioId, 'vapList'], vapList);
                this.props.updateMultiSsidItem({ radioList });
                this.props.changeShowSpeedLimitModal(false);
                this.props.changeTableItemForSsid(fromJS({
                  isShow: '0',
                  val: '',
                  item: {},
                  pos: '',
                }));
              }
            });
          }}
          onClose={() => {
            this.props.changeShowSpeedLimitModal(false);
            this.props.changeTableItemForSsid(fromJS({
              isShow: '0',
              val: '',
              item: {},
              pos: '',
            }));
            this.props.resetVaildateMsg();
          }}
        >
          <FormGroup
            type="checkbox"
            label={__('Speed Limit')}
            checked={tableItemForSsid.getIn(['item', 'speedLimit', 'enable']) === '1'}
            onChange={() => {
              const val = tableItemForSsid.getIn(['item', 'speedLimit', 'enable']) === '1' ? '0' : '1';
              const newItem = tableItemForSsid.get('item')
                              .setIn(['speedLimit', 'enable'], val);
              const newItemForSsid = tableItemForSsid.set('item', newItem);
              this.props.changeTableItemForSsid(newItemForSsid);
            }}
          />
          {
            tableItemForSsid.getIn(['item', 'speedLimit', 'enable']) === '1' ? (
              <div>
                <FormGroup
                  type="number"
                  label={__('Max Upload Speed')}
                  form="speedlimitform"
                  value={tableItemForSsid.getIn(['item', 'speedLimit', 'upload'])}
                  onChange={(data) => {
                    const newItem = tableItemForSsid.get('item')
                                    .setIn(['speedLimit', 'upload'], data.value);
                    const newItemForSsid = tableItemForSsid.set('item', newItem);
                    this.props.changeTableItemForSsid(newItemForSsid);
                  }}
                  help="KB"
                  required
                  {...validUpload}
                />
                <FormGroup
                  type="number"
                  label={__('Max Download Speed')}
                  form="speedlimitform"
                  value={tableItemForSsid.getIn(['item', 'speedLimit', 'download'])}
                  onChange={(data) => {
                    const newItem = tableItemForSsid.get('item')
                                    .setIn(['speedLimit', 'download'], data.value);
                    const newItemForSsid = tableItemForSsid.set('item', newItem);
                    this.props.changeTableItemForSsid(newItemForSsid);
                  }}
                  help="KB"
                  required
                  {...validDownload}
                />
              </div>
            ) : null
          }
        </Modal>
        <Modal
          title={__('Security Settings For SSID')}
          isShow={tableItemForSsid.get('isShow') === '1'}
          draggable
          onOk={() => {
            this.props.validateAll('ssidSecurityModal').then((msg) => {
              if (msg.isEmpty()) {
                const pos = tableItemForSsid.get('pos');
                const vapList = multiSsid.getIn(['radioList', radioId, 'vapList'])
                                .set(pos, tableItemForSsid.get('item'));
                const radioList = multiSsid.get('radioList').setIn([radioId, 'vapList'], vapList);
                this.props.updateMultiSsidItem({ radioList });
                this.props.changeTableItemForSsid(fromJS({
                  isShow: '0',
                  val: '',
                  item: {},
                  pos: '',
                }));
              }
            });
          }}
          onClose={() => {
            this.props.changeTableItemForSsid(fromJS({
              isShow: '0',
              val: '',
              item: {},
              pos: '',
            }));
            this.props.resetVaildateMsg();
          }}
          okButton
          cancelButton
        >
          <FormGroup
            label={__('Security')}
            type="select"
            options={staAndApSecurityOptions}
            value={tableItemForSsid.getIn(['item', 'security', 'mode'])}
            onChange={(data) => {
              const securDefault = fromJS({
                cipher: 'aes',
                Authentication: 'shared',
                keyType: 'Hex',
                keyIndex: '1',
              });
              const currentSecur = tableItemForSsid.getIn(['item', 'security']);
              const secur = securDefault.merge(currentSecur)
                            .set('mode', data.value).set('key', '');
              const newItem = tableItemForSsid.get('item').set('security', secur);
              const newItemForSsid = tableItemForSsid.set('item', newItem);
              this.props.changeTableItemForSsid(newItemForSsid);
            }}
          />
          {
            (tableItemForSsid.getIn(['item', 'security', 'mode']) === 'none' ||
              tableItemForSsid.getIn(['item', 'security', 'mode']) === 'wep') ? null : (
                <div>
                  <FormGroup
                    label={__('Encryption')}
                    minWidth="66px"
                    type="switch"
                    value={tableItemForSsid.getIn(['item', 'security', 'cipher'])}
                    options={[
                      { label: 'AES', value: 'aes' },
                      { label: 'TKIP', value: 'tkip' },
                      { label: 'MIXED', value: 'aes&tkip' },
                    ]}
                    onChange={(data) => {
                      const newItem = tableItemForSsid.get('item')
                                      .setIn(['security', 'cipher'], data.value);
                      const newItemForSsid = tableItemForSsid.set('item', newItem);
                      this.props.changeTableItemForSsid(newItemForSsid);
                    }}
                  />
                  <FormGroup
                    label={__('Password')}
                    type="password"
                    required
                    form="ssidSecurityModal"
                    value={tableItemForSsid.getIn(['item', 'security', 'key'])}
                    onChange={(data) => {
                      const newItem = tableItemForSsid.get('item')
                                      .setIn(['security', 'key'], data.value);
                      const newItemForSsid = tableItemForSsid.set('item', newItem);
                      this.props.changeTableItemForSsid(newItemForSsid);
                    }}
                    {...validPwd2}
                  />
                </div>
            )
          }
          {
            (tableItemForSsid.getIn(['item', 'security', 'mode']) === 'wep') ? (
              <div>
                <FormGroup
                  label={__('Authentication Type')}
                  type="select"
                  options={wepAuthenOptions}
                  value={tableItemForSsid.getIn(['item', 'security', 'Authentication'])}
                  onChange={(data) => {
                    const newItem = tableItemForSsid.get('item')
                                    .setIn(['security', 'Authentication'], data.value);
                    const newItemForSsid = tableItemForSsid.set('item', newItem);
                    this.props.changeTableItemForSsid(newItemForSsid);
                  }}
                />
                {
                  /**
                  <FormGroup
                    label={__('Key Length')}
                    type="select"
                    options={wepKeyLengthOptions}
                    value={tableItemForSsid.getIn(['item', 'security', 'keyLength'])}
                    onChange={(data) => {
                      const newItem = tableItemForSsid.get('item')
                                      .setIn(['security', 'keyLength'], data.value);
                      const newItemForSsid = tableItemForSsid.set('item', newItem);
                      this.props.changeTableItemForSsid(newItemForSsid);
                    }}
                  />
                   */
                }
                <FormGroup
                  label={__('Key Index')}
                  type="select"
                  options={keyIndexOptions}
                  value={tableItemForSsid.getIn(['item', 'security', 'keyIndex'])}
                  onChange={(data) => {
                    const newItem = tableItemForSsid.get('item')
                                    .setIn(['security', 'keyIndex'], data.value);
                    const newItemForSsid = tableItemForSsid.set('item', newItem);
                    this.props.changeTableItemForSsid(newItemForSsid);
                  }}
                />
                <FormGroup
                  label={__('Key Format')}
                  type="select"
                  options={keyTypeOptions}
                  value={tableItemForSsid.getIn(['item', 'security', 'keyType'])}
                  onChange={(data) => {
                    const newItem = tableItemForSsid.get('item')
                                    .setIn(['security', 'keyType'], data.value);
                    const newItemForSsid = tableItemForSsid.set('item', newItem);
                    this.props.changeTableItemForSsid(newItemForSsid);
                  }}
                />
                <FormGroup
                  type="password"
                  required
                  label={__('Password')}
                  form="ssidSecurityModal"
                  value={tableItemForSsid.getIn(['item', 'security', 'key'])}
                  onChange={(data) => {
                    const newItem = tableItemForSsid.get('item')
                                    .setIn(['security', 'key'], data.value);
                    const newItemForSsid = tableItemForSsid.set('item', newItem);
                    this.props.changeTableItemForSsid(newItemForSsid);
                  }}
                  {...this.props.validateOption[tableItemForSsid.getIn(['item', 'security', 'keyType'])]}
                />
              </div>
            ) : null
          }
        </Modal>
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
    productInfo: state.product,
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
  validator.mergeProps(validOptions),
)(Basic);

export const basic = reducer;
