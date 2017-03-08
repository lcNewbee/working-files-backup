import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { Map, fromJS } from 'immutable';
import validator from 'shared/validator';
import { bindActionCreators } from 'redux';
import Icon from 'shared/components/Icon';
import { FormGroup, FormInput, Modal, Table, SaveButton, icon } from 'shared/components';
import { Button } from 'shared/components/Button';
import * as appActions from 'shared/actions/app';
import * as actions from 'shared/actions/settings';
import * as selfActions from './actions';
import reducer from './reducer';
import countryMap from './country';

import './index.scss';

const propTypes = {
  app: PropTypes.instanceOf(Map),
  save: PropTypes.func,
  store: PropTypes.instanceOf(Map),
  selfState: PropTypes.instanceOf(Map),
  validateAll: PropTypes.func,
  fetchSettings: PropTypes.func,
  route: PropTypes.object,
  // initSettings: PropTypes.func,
  // fetchSettings: PropTypes.func,
  fetch: PropTypes.func,
  // saveSettings: PropTypes.func,
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
  receiveCountryInfo: PropTypes.func,
  resetVaildateMsg: PropTypes.func,
  changeTitleShowIcon: PropTypes.func,
  changeTableItemForSsid: PropTypes.func,
  createModal: PropTypes.func,
  // updateSelfItemSettings: PropTypes.func,
  updateItemSettings: PropTypes.func,
  // updateMultiSsidItem: PropTypes.func,
  // updateRadioSettingsItem: PropTypes.func,
  changeWhichButton: PropTypes.func,
  restoreSelfState: PropTypes.func,
  changeCurrRadioConfig: PropTypes.func,
  productInfo: PropTypes.instanceOf(Map),
  changeSsidTableOptions: PropTypes.func,
  changeShowSpeedLimitModal: PropTypes.func,
  changeTransferData: PropTypes.func,
  changeShowMacHelpInfo: PropTypes.func,
  changeApMacInput: PropTypes.func,
};

const defaultProps = {};
let vlanEnable = '0';


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
  { value: '11ac', label: '802.11ac' },
  { value: '11na', label: '802.11an' },
  { value: '11a', label: '802.11a' },
];

const radioModeOptionsFor2g = [
  // { value: 'auto', label: 'auto' },
  { value: '11b', label: '802.11b' },
  { value: '11g', label: '802.11g' },
  { value: '11bg', label: '802.11bg' },
  { value: '11ng', label: '802.11bgn' },
];

const channelWidthOptions = [
  { value: 'HT20', label: 'HT20' },
  { value: 'HT40-', label: 'HT40-' },
  { value: 'HT40+', label: 'HT40+' },
  { value: 'HT80', label: 'HT80' },
];

const validOptions = Map({
  validSsid: validator({
    rules: 'remarkTxt:["\'\\\\"]|len:[1, 32]',
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
  validPwd1: validator({
    rules: 'pwd|len:[8, 63]',
  }),
  validPwd2: validator({
    rules: 'pwd|len:[8, 63]',
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
    rules: 'num:[1, 200]',
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
  validMacInput: validator({
    rules: 'mac',
  }),
});

function getCountryNameFromCode(code, map) {
  for (const name of Object.keys(map)) {
    if (map[name] === code) {
      return _(name);
    }
  }
  return '';
}

// countryMap为Object
function makeCountryOptions(map) {
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

export default class Basic extends React.Component {

  constructor(props) {
    super(props);
    this.onSave = this.onSave.bind(this);
    this.onHideSsidboxClick = this.onHideSsidboxClick.bind(this);
    this.onStopScanClick = this.onStopScanClick.bind(this);
    this.onScanBtnClick = this.onScanBtnClick.bind(this);
    this.onModalOkBtnClick = this.onModalOkBtnClick.bind(this);
    this.onModalCloseBtnClick = this.onModalCloseBtnClick.bind(this);
    this.onSelectScanResultItem = this.onSelectScanResultItem.bind(this);
    this.onChengeWirelessMode = this.onChengeWirelessMode.bind(this);
    this.noErrorThisPage = this.noErrorThisPage.bind(this);
    this.onCloseCountrySelectModal = this.onCloseCountrySelectModal.bind(this);
    this.makeChannelOptions = this.makeChannelOptions.bind(this);
    this.onSecurityModeChange = this.onSecurityModeChange.bind(this);
    this.onAddNewSsidItem = this.onAddNewSsidItem.bind(this);
    this.onDeleteBtnClick = this.onDeleteBtnClick.bind(this);
    this.onSsidItemChange = this.onSsidItemChange.bind(this);
    this.fetchFullPageData = this.fetchFullPageData.bind(this);
    this.firstInAndRefresh = this.firstInAndRefresh.bind(this);
    this.onChangeRadio = this.onChangeRadio.bind(this);
    this.makeSsidTableOptions = this.makeSsidTableOptions.bind(this);
    this.saveCountrySelectModal = this.saveCountrySelectModal.bind(this);
    this.radioSettingsHeadClassName = this.radioSettingsHeadClassName.bind(this);
    this.getChannelListAndPowerRange = this.getChannelListAndPowerRange.bind(this);
    this.sortMacOrder = this.sortMacOrder.bind(this);
    this.state = {
      ssidTableFullMemberOptions: fromJS([
        {
          id: 'enable',
          label: _('Enable'),
          width: '300px',
          transform: function (val, item) {
            const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
            const pos = this.props.store.getIn(['curData', 'radioList', radioId, 'vapList']).keyOf(item);
            const flag = (pos === 0);
            return (
              <FormInput
                type="checkbox"
                checked={val === '1'}
                disabled={flag}
                onChange={() => this.onSsidItemChange(val, item, 'enable', (val === '1' ? '0' : '1'))}
                style={{
                  marginLeft: '-3px',
                }}
              />
            );
          }.bind(this),
        },
        {
          id: 'ssid',
          label: _('SSID'),
          width: '250px',
          transform: function (val, item) {
            const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
            const pos = this.props.store.getIn(['curData', 'radioList', radioId, 'vapList']).keyOf(item);
            return (
              <FormInput
                type="text"
                value={val}
                disabled={pos === 0 && this.props.store.getIn(['curData', 'radioList', radioId, 'wirelessMode']) !== 'ap'}
                onChange={(data) => {
                  console.log('data.value.length', utils.getUtf8Length(data.value), data.value, data.value.length);
                  if (utils.getUtf8Length(data.value) <= 32) {
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
          label: _('VLAN ID'),
          width: '250px',
          transform: function (val, item) {
            // const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
            // const pos = this.props.store
            //                 .getIn(['curData', 'radioList', radioId, 'vapList']).keyOf(item);
            return (
              <FormInput
                type="number"
                value={val}
                min="1"
                max="4094"
                defaultValue="1"
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
          label: _('Max Clients'),
          width: '250px',
          transform: function (val, item) {
            // if (val === '' || !Number.isInteger(+val) || parseInt(val, 10) <= 0) {
            //   this.onSsidItemChange(val, item, 'maxClients', '64');
            // } // 后台没传值，或值错误，则提供默认值
            return (
              <FormInput
                type="number"
                value={val}
                max="1000"
                min="1"
                defaultValue="64"
                // disabled={pos === 0 || vlanEnable === '0'}
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
          label: _('Airtime Fairness'),
          width: '250px',
          transform: function (val, item) {
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
          label: _('Hide'),
          width: '200px',
          transform: function (val, item) {
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
          label: _('Client Isolation'),
          width: '200px',
          transform: function (val, item) {
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
          label: _('Portal'),
          width: '200px',
          transform: function (val, item) {
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
          label: _('Security'),
          width: '200px',
          transform: function (val, item) {
            const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
            const pos = this.props.store.getIn(['curData', 'radioList', radioId, 'vapList']).keyOf(item);
            return (
              <Button
                text={_('Edit')}
                icon="pencil-square"
                size="sm"
                disabled={pos === 0 && this.props.store.getIn(['curData', 'radioList', radioId, 'wirelessMode']) !== 'ap'}
                onClick={() => {
                  const tableItemForSsid = fromJS({}).set('val', val)
                        .set('item', item).set('isShow', '1')
                        .set('pos', pos);
                  this.props.changeTableItemForSsid(tableItemForSsid);
                }}
              />
            );
          }.bind(this),
        },
        {
          id: 'speedLimit',
          label: _('Speed Limit'),
          width: '200px',
          transform: function (val, item) {
            const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
            const pos = this.props.store.getIn(['curData', 'radioList', radioId, 'vapList']).keyOf(item);
            return (
              <div style={{ marginLeft: '7px' }}>
                <Button
                  text={_('Edit')}
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
          label: _('Delete'),
          width: '200px',
          transform: function (val, item) {
            const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
            const pos = this.props.store.getIn(['curData', 'radioList', radioId, 'vapList']).keyOf(item);
            return (
              <div style={{ marginLeft: '-12px' }}>
                <Button
                  text={_('Delete')}
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

  onSave(validID) {
    const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
    this.props.validateAll(validID).then((msg) => {
      if (msg.isEmpty()) {
        const curSettingId = this.props.store.get('curSettingId');
        let dataToSave = this.props.store.getIn(['curData', 'radioList', radioId]);
        let dataFromServer = this.props.store.getIn([curSettingId, 'data', 'radioList', radioId]);
        // console.log('dataFromServer', dataFromServer.toJS());
        // 根据保存按钮，重新组织需要保存的数据（因为两部分数据是一个接口，所以要区分）
        if (validID === 'radioSettings') {
          const firstVap = dataToSave.getIn(['vapList', 0]);
          // 如果是station和repeater模式，则除了第一个ssid外，其他都要替换,这里处理第一个ssid
          if (dataToSave.get('wirelessMode') === 'sta' || dataToSave.get('wirelessMode') === 'repeater') {
            dataFromServer = dataFromServer.setIn(['vapList', 0], firstVap);
          }
          const vapList = dataFromServer.get('vapList');
          dataToSave = dataToSave.set('vapList', vapList);
        } else if (validID === 'multiSsid') {
          dataFromServer = dataFromServer.delete('vapList');
          dataToSave = dataToSave.merge(dataFromServer);
        }
        this.props.save('goform/set_wl_all', dataToSave.toJS()).then((json) => {
          if (json.state && json.state.code === 2000) {
            this.fetchFullPageData();
          }
        });
      }
    });
  }

  onHideSsidboxClick() {
    const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
    // const basicSettings = this.props.selfState.get('basicSettings');
    const curData = this.props.store.get('curData');
    const hideSsid = curData.getIn(['radioList', radioId, 'vapList', '0', 'hideSsid']) === '1' ? '0' : '1';
    const radioList = curData.get('radioList').setIn([radioId, 'vapList', '0', 'hideSsid'], hideSsid);
    this.props.updateItemSettings({ radioList });
  }

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
    const curData = this.props.store.get('curData');
    // const basicSettings = this.props.selfState.get('basicSettings');
    if (!this.props.selfState.get('selectedResult').isEmpty()) {
      let peers = curData.getIn(['radioList', radioId, 'vapList', '0', 'peers']);
      if (peers !== undefined) { peers = peers.set('0', mac); }
      let firstSsid = curData.getIn(['radioList', radioId, 'vapList', '0'])
                        .set('peers', peers).set('ssid', ssid).set('apMac', mac)
                        .set('security', fromJS(security).set('key', ''))
                        .set('frequency', frequency)
                        .set('channelWidth', channelWidth);
      if (curData.get('lockType') === '1') {
        // 处理华润定制的多Station桥接功能
        const scanResult = this.props.store.getIn(['curData', 'scanResult', 'siteList']);
        let apMacList = fromJS([]);
        scanResult.forEach((val) => {
          if (val.get('ssid') === ssid) apMacList = apMacList.push(val.get('mac'));
        });
        firstSsid = firstSsid.set('apMacList', apMacList.slice(0, 5));
      }
      const radioList = curData.get('radioList').setIn([radioId, 'vapList', '0'], firstSsid);
      this.props.updateItemSettings({ radioList });
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
    this.props.fetchSettings('goform/get_wl_all')
        .then(() => {
          const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
          let newRadioList = this.props.store.getIn(['curData', 'radioList']).setIn([radioId, 'wirelessMode'], data.value);
          const securityMode = this.props.store.getIn(['curData', 'radioList', radioId, 'vapList', 0, 'security', 'mode']);
          if (data.value === 'repeater' && securityMode !== 'wep') {
            newRadioList = newRadioList.setIn([radioId, 'vapList', 0, 'security', 'mode'], 'none');
          }
          this.props.updateItemSettings({ radioList: newRadioList });
        });
  }
  onCloseCountrySelectModal() {
    const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
    this.props.fetch('goform/get_wl_all').then((json) => {
      if (json.state && json.state.code === 2000) {
        this.props.closeCountrySelectModal(json.data.radioList[radioId].countryCode);
      }
    });
  }

  onSecurityModeChange(data) {
    const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
    const curData = this.props.store.get('curData');
    // const basicSettings = this.props.selfState.get('basicSettings');
    const preSecurity = curData.getIn(['radioList', radioId, 'vapList', '0', 'security']);
    const mode = data.value;
    const auth = preSecurity.get('auth') || 'shared';
    const keyLength = preSecurity.get('keyLength') || '64';
    const keyType = preSecurity.get('keyType') || 'Hex';
    // const key = preSecurity.get('key') || '';
    const keyIndex = preSecurity.get('keyIndex') || '1';
    const cipher = preSecurity.get('cipher') || 'aes';
    const afterSecurity = preSecurity.set('mode', mode).set('auth', auth)
                          .set('keyType', keyType).set('keyLength', keyLength)
                          .set('keyIndex', keyIndex)
                          .set('cipher', cipher)
                          .set('key', '');
    const radioList = curData.get('radioList')
                    .setIn([radioId, 'vapList', '0', 'security'], afterSecurity);
    this.props.updateItemSettings({ radioList });
  }

  onAddNewSsidItem() {
    const newSsid = fromJS({
      flag: Math.random(),
      ssid: '',
      vlanId: '1',
      hideSsid: '0',
      enable: '1',
      maxClients: '64',
      portalEnable: '0',
      airTimeEnable: '0',
      security: {
        mode: 'none',
        cipher: 'aes',
        auth: 'open',
        keyLength: '64',
        keyType: 'Hex',
        keyIndex: '1',
        key: '',
      },
    });
    const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
    const vapList = this.props.store.getIn(['curData', 'radioList', radioId, 'vapList']).push(newSsid);
    const radioList = this.props.store.getIn(['curData', 'radioList']).setIn([radioId, 'vapList'], vapList);
    if (vapList.size <= 15) { // 最大支持15个SSID
      this.props.updateItemSettings({ radioList });
    }
  }

  onDeleteBtnClick(item) {
    const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
    const curDate = this.props.store.get('curData');
    const num = curDate.getIn(['radioList', radioId, 'vapList']).keyOf(item);
    const vapList = curDate.getIn(['radioList', radioId, 'vapList']).delete(num);
    const radioList = curDate.get('radioList').setIn([radioId, 'vapList'], vapList);
    this.props.updateItemSettings({ radioList });
  }

  onSsidItemChange(val, item, valId, newVal) {
    const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
    const curData = this.props.store.get('curData');
    const itemNum = curData.getIn(['radioList', radioId, 'vapList']).keyOf(item);
    const newItem = item.set(valId, newVal);
    // console.log('item', item, newItem);
    const vapList = curData.getIn(['radioList', radioId, 'vapList']).set(itemNum, newItem);
    const radioList = this.props.store.getIn(['curData', 'radioList'])
                          .setIn([radioId, 'vapList'], vapList);
    this.props.updateItemSettings({ radioList });
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

  getChannelListAndPowerRange(radioId) {
    const radioType = this.props.productInfo.getIn(['deviceRadioList', radioId, 'radioType']);
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
        const channelList = json2.data.channels.map(val => parseInt(val, 10).toString());
        if (channelList.indexOf(frequency) === -1) {
          const radioList = this.props.store.getIn(['curData', 'radioList']).setIn([radioId, 'frequency'], 'auto');
          this.props.updateItemSettings({ radioList });
        }
      }
    });
  }

  fetchFullPageData() {
    this.props.fetch('goform/get_wl_all').then((json) => {
      if (json.state && json.state.code === 2000) {
        // const radioInfo = {
        //   curModule: 'radioSettings',
        //   data: fromJS(json.data),
        // };
        // 将数据同步到setting下对应curSettingId的数据中，保存时要用到
        const curSettingId = this.props.store.get('curSettingId');
        this.props.reciveFetchSettings(json.data, curSettingId);
        /** ****向vapList中的每一项添加一个标识唯一性的标志flag***/
        const radioList = fromJS(json.data).get('radioList')
                          .map((radio) => {
                            const vapList = radio.get('vapList').map(val => val.set('flag', Math.random()));
                            return radio.set('vapList', vapList);
                          });
        const dataToUpdate = fromJS(json.data).set('radioList', radioList);
        /** ***************************************************/
        this.props.updateItemSettings(dataToUpdate);
        // 根据国家和频段，获取信道列表信息
        const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
        const country = json.data.radioList[radioId].countryCode;
        this.props.changeCountryCode(country);
        this.getChannelListAndPowerRange(radioId);
      }
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
    this.onChangeRadio({// 修改当前射频为第一个radio
      value: '0',
    });
    props.initSettings({
      settingId: props.route.id,
      formUrl: props.route.formUrl,
      saveUrl: props.route.saveUrl,
      defaultData: {
      },
    });
    props.fetch('goform/get_network_info').then((json) => {
      if (json.state && json.state.code === 2000) {
        vlanEnable = json.data.vlanEnable;
      }
    }).then(() => {
      this.fetchFullPageData();
    });
    // props.changeTitleShowIcon({ name: 'showRadioSetting', value: true });
    props.changeTitleShowIcon({ name: 'showSsidSetting', value: true });
    props.changeTitleShowIcon({ name: 'showMultiSsid', value: true });
    props.changeShowSpeedLimitModal(false);
    props.changeShowScanResultStatus(false);
    props.changeScanStatus(false);
    props.changeTableItemForSsid(fromJS({
      isShow: '0',
      val: '',
      item: fromJS({}),
    }));
    const config = fromJS({
      radioId: '0',
      radioType: this.props.productInfo.getIn(['deviceRadioList', 0, 'radioType']),
    });
    this.props.changeCurrRadioConfig(config);
    // this.getAirTimeEnable();
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
    const radioList = this.props.store.get('curData').get('radioList')
                        .setIn([radioId, 'vapList', '0', 'apMacList'], macList);
    this.props.updateItemSettings({ radioList });
  }

  saveCountrySelectModal() {
    const selectedCode = this.props.selfState.get('selectedCountry');
    const { radioId } = this.props.selfState.get('currRadioConfig').toJS();
    const radioList = this.props.store.getIn(['curData', 'radioList'])
                                .setIn([radioId, 'countryCode'], selectedCode);
    Promise.resolve().then(() => {
      this.props.updateItemSettings({ radioList });
    }).then(() => {
      this.getChannelListAndPowerRange(radioId);
    });
    this.props.changeCtyModal(false);
  }

  radioSettingsHeadClassName() {
    let radioSettingsClass = 'cols col-12 o-box__cell';
    const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
    const wirelessMode = this.props.store.getIn(['curData', 'radioList', radioId, 'wirelessMode']);
    if (wirelessMode === 'ap') {
      radioSettingsClass = 'cols col-12 o-box__cell';
    }
    return radioSettingsClass;
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
        transform(val) {
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
    // const curData = this.props.store.get('curData');
    const { radioId, radioType } = this.props.selfState.get('currRadioConfig').toJS();
    const {
      staApmac, apmac1, apmac2, apmac3, validSsid, validPwd1, validPwd2, validMaxClients,
      validDownload, validUpload, validTxpower,
    } = this.props.validateOption;
    const tableItemForSsid = this.props.selfState.get('tableItemForSsid');
    const funConfig = this.props.route.funConfig;
    const curData = this.props.store.get('curData');
    const apMac = curData.getIn(['radioList', radioId, 'vapList', '0', 'apMac']);
    const apMacList = curData.getIn(['radioList', radioId, 'vapList', '0', 'apMacList']) || fromJS([]);
    // const keysFromRoute = funConfig.ssidTableKeys;
    if (this.props.store.get('curSettingId') === 'base') {
      return null;
    }
    const wirelessMode = this.props.store.getIn(['curData', 'radioList', radioId, 'wirelessMode']);
    return (
      <div className="stats-group o-box" style={{ minWidth: '1200px' }}>
        {
          this.props.productInfo.get('deviceRadioList').size > 1 ? (
            <FormInput
              type="switch"
              label={_('Radio Select')}
              value={this.props.selfState.getIn(['currRadioConfig', 'radioId'])}
              options={this.props.productInfo.get('radioSelectOptions')}
              minWidth="100px"
              onChange={(data) => {
                const country = this.props.store.getIn(['curData', 'radioList', data.value, 'countryCode']);
                this.onChangeRadio(data);
                this.props.changeCountryCode(country);
                this.getChannelListAndPowerRange(data.value);
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
          okText={_('Select')}
          cancelText={_('Cancel')}
          size="lg"
          okButton
          cancelButton
          draggable
        >
          <Table
            className="table"
            options={modalOptions}
            list={this.props.store.getIn(['curData', 'scanResult', 'siteList'])}
          />
        </Modal>{ /* SSID 扫描弹出框 */ }

        <div className="row">
          <div className={this.radioSettingsHeadClassName()}>
            {  // 标题
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
                    style={{
                      fontSize: '1.17em',
                      fontFamily: 'Microsoft YaHei',
                      fontWeight: 'bold',
                      paddingLeft: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    {_('Radio Settings')}
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
                    style={{
                      fontSize: '1.17em',
                      fontFamily: 'Microsoft YaHei',
                      fontWeight: 'bold',
                      paddingLeft: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    {_('Radio Settings')}
                  </span>
                </icon>
              )
            }
          </div>
        </div>
        { // 射频部分设置
          this.props.selfState.get('showRadioSetting') ? (
            <div className="o-box__cell">
              <div
                className="cols col-5"
                style={{
                  overflow: 'visible',
                }}
              >
                <FormGroup
                  type="checkbox"
                  label={_('Radio')}
                  checked={curData.getIn(['radioList', radioId, 'enable']) === '1'}
                  onChange={(data) => {
                    const radioList = curData.get('radioList').setIn([radioId, 'enable'], data.value);
                    this.props.updateItemSettings({ radioList });
                  }}
                />
                { // 模式选择下拉框
                  funConfig.devicemodeOptions.length === 1 && funConfig.devicemodeOptions[0].value === 'ap' ? null : (
                    <FormGroup
                      type="select"
                      options={funConfig.devicemodeOptions}
                      value={curData.getIn(['radioList', radioId, 'wirelessMode'])}
                      onChange={data => this.onChengeWirelessMode(data)}
                      label={_('Radio Mode')}
                    />
                  )
                }
                <FormGroup
                  label={_('Country')}
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
                    text={_('Change')}
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
                  title={_('Country Code')}
                  onClose={this.onCloseCountrySelectModal}
                  onOk={this.saveCountrySelectModal}
                  draggable
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
                    onChange={() => { this.props.changeAgreeProtocol(true); }}
                  />
                  <FormGroup
                    label={_('Country')}
                    type="select"
                    options={makeCountryOptions(countryMap)}
                    value={this.props.selfState.get('selectedCountry')}
                    onChange={data => this.props.changeCountryCode(data.value)}
                    disabled={!this.props.selfState.get('agreeProtocol')}
                  />
                </Modal>
                <FormGroup
                  label={_('Wireless Mode')}
                  type="select"
                  options={radioType === '5G' ? radioModeOptionsFor5g : radioModeOptionsFor2g}
                  value={curData.getIn(['radioList', radioId, 'radioMode'])}
                  onChange={(data) => {
                    let radioList = curData.get('radioList').setIn([radioId, 'radioMode'], data.value);
                    const channelWidth = curData.getIn(['radioList', radioId, 'channelWidth']);
                    if (data.value === '11na' && channelWidth === 'HT80') {
                      radioList = radioList.setIn([radioId, 'channelWidth'], 'HT40+');
                    }
                    if (data.value === '11b' || data.value === '11g' || data.value === '11bg' || data.value === '11a') {
                      radioList = radioList.setIn([radioId, 'channelWidth'], 'HT20');
                    }
                    Promise.resolve().then(() => {
                      this.props.updateItemSettings({ radioList });
                    }).then(() => {
                      this.getChannelListAndPowerRange(radioId);
                    });
                  }}
                />
                { // 2.4G频宽
                  curData.getIn(['radioList', radioId, 'radioMode']) === '11ng' &&
                  this.props.selfState.getIn(['currRadioConfig', 'radioType']) === '2.4G' ? (
                    <FormGroup
                      label={_('Channel Bandwidth')}
                      type="switch"
                      minWidth="66px"
                      options={channelWidthOptions.slice(0, 3)}
                      value={curData.getIn(['radioList', radioId, 'channelWidth'])}
                      onChange={(data) => {
                        const radioList = curData.get('radioList')
                                          .setIn([radioId, 'channelWidth'], data.value);
                        Promise.resolve().then(() => {
                          this.props.updateItemSettings({ radioList });
                        }).then(() => {
                          this.getChannelListAndPowerRange(radioId);
                        });
                      }}
                    />
                  ) : null
                }
                { // 5G频宽
                  this.props.selfState.getIn(['currRadioConfig', 'radioType']) === '5G' &&
                  curData.getIn(['radioList', radioId, 'radioMode']) === '11na' ? (
                    <FormGroup
                      label={_('Channel Bandwidth')}
                      type="switch"
                      minWidth="66px"
                      options={channelWidthOptions.slice(0, 3)}
                      value={curData.getIn(['radioList', radioId, 'channelWidth'])}
                      onChange={(data) => {
                        const radioList = curData.get('radioList')
                                          .setIn([radioId, 'channelWidth'], data.value);
                        Promise.resolve().then(() => {
                          this.props.updateItemSettings({ radioList });
                        }).then(() => {
                          this.getChannelListAndPowerRange(radioId);
                        });
                      }}
                    />
                  ) : null
                }
                { // 5G频宽
                  this.props.selfState.getIn(['currRadioConfig', 'radioType']) === '5G' &&
                  curData.getIn(['radioList', radioId, 'radioMode']) === '11ac' ? (
                    <FormGroup
                      label={_('Channel Bandwidth')}
                      type="switch"
                      minWidth="42px"
                      options={channelWidthOptions}
                      value={curData.getIn(['radioList', radioId, 'channelWidth'])}
                      onChange={(data) => {
                        const radioList = curData.get('radioList')
                                          .setIn([radioId, 'channelWidth'], data.value);
                        Promise.resolve().then(() => {
                          this.props.updateItemSettings({ radioList });
                        }).then(() => {
                          this.getChannelListAndPowerRange(radioId);
                        });
                      }}
                    />
                  ) : null
                }
                <FormGroup
                  label={_('Channel')}
                  type="select"
                  options={this.makeChannelOptions()}
                  value={curData.getIn(['radioList', radioId, 'frequency'])}
                  onChange={(data) => {
                    const radioList = curData.get('radioList')
                                      .setIn([radioId, 'frequency'], data.value);
                    this.props.updateItemSettings({ radioList });
                  }}
                />
                {
                  funConfig.radioMaxClientsLimit ? (
                    <FormGroup
                      label={_('Max Clients')}
                      type="number"
                      max={200}
                      min={1}
                      form="radioSettings"
                      value={curData.getIn(['radioList', radioId, 'maxRadioClients'])}
                      onChange={(data) => {
                        const radioList = curData.get('radioList')
                                          .setIn([radioId, 'maxRadioClients'], data.value);
                        this.props.updateItemSettings({ radioList });
                      }}
                      help={`${_('Range: ')}1 ~ 200`}
                      required
                      {...validMaxClients}
                    />
                  ) : null
                }
                <FormGroup
                  label={_('Tx Power')}
                  type="number"
                  min={this.props.selfState.get('minTxpower')}
                  form="radioSettings"
                  max={this.props.selfState.get('maxTxpower')}
                  value={curData.getIn(['radioList', radioId, 'txPower'])}
                  onChange={(data) => {
                    const radioList = curData.get('radioList')
                                      .setIn([radioId, 'txPower'], data.value);
                    this.props.updateItemSettings({ radioList });
                  }}
                  help={`${_('Range: ')} ${this.props.selfState.get('minTxpower') || '3'}~${this.props.selfState.get('maxTxpower') || '23'} dBm`}
                  required
                  {...validTxpower}
                />
              </div>
              {
                wirelessMode !== 'ap' &&
                typeof (wirelessMode) !== 'undefined' ? ( // 处理第一次进入该页面，汽包内容闪现的问题。
                  <div
                    style={{
                      overflow: 'visible',
                    }}
                    className="cols cols-6 bubble"
                  >
                    <div className="bubble-arrow-before" />
                    { // SSID输入框**station模式**
                      curData.getIn(['radioList', radioId, 'wirelessMode']) === 'sta' ? (
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
                                label={_('Remote SSID')}
                                className="fl"
                                type="text"
                                form="radioSettings"
                                value={curData.getIn(['radioList', radioId, 'vapList', '0', 'ssid'])}
                                onChange={(data) => {
                                  const radioList = curData.get('radioList')
                                        .setIn([radioId, 'vapList', '0', 'ssid'], data.value);
                                  this.props.updateItemSettings({ radioList });
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
                          </div>
                        </div>
                        ) : null
                    }
                    { // SSID输入框**repeater模式**
                      curData.getIn(['radioList', radioId, 'wirelessMode']) === 'repeater' ? (
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
                                label={_('Remote SSID')}
                                className="fl"
                                type="text"
                                form="radioSettings"
                                value={curData.getIn(['radioList', radioId, 'vapList', '0', 'ssid'])}
                                onChange={(data) => {
                                  const radioList = curData.get('radioList')
                                                  .setIn([radioId, 'vapList', '0', 'ssid'], data.value);
                                  this.props.updateItemSettings({ radioList });
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
                              checked={curData.getIn(['radioList', radioId, 'vapList', '0', 'hideSsid']) === '1'}
                              onClick={data => this.onHideSsidboxClick(data)}
                            />
                            {_('Hide')}
                          </div>
                        </div>
                      ) : null
                    }
                    {
                      curData.getIn(['radioList', radioId, 'wirelessMode']) === 'sta' ? null : (
                        <FormGroup
                          type="number"
                          label={_('VLAN ID')}
                          value={curData.getIn(['radioList', radioId, 'vapList', '0', 'vlanId'])}
                          help={`${_('Range: ')}1~4094`}
                          min="1"
                          max="4094"
                          defaultValue="1"
                          form="radioSettings"
                          disabled={vlanEnable === '0'}
                          onChange={(data) => {
                            const radioList = curData.get('radioList').setIn([radioId, 'vapList', 0, 'vlanId'], data.value);
                            this.props.updateItemSettings({ radioList });
                          }}
                          style={{
                            width: '500px',
                          }}
                          required
                          {...this.props.validateOption.validVlanId}
                        />
                      )
                    }
                    <div style={{ width: '350px' }}>
                      { // repeater模式下，对端AP的mac地址输入框
                        (curData.getIn(['radioList', radioId, 'wirelessMode']) === 'repeater') ? (
                          <div>
                            <FormGroup
                              label="WDS Peers"
                              type="text"
                              minWidth="350px"
                              value={curData.getIn(['radioList', radioId, 'vapList', '0', 'peers', '0']) || ''}
                              onChange={(data) => {
                                const peer1 = curData.getIn(['radioList', radioId, 'vapList', '0', 'peers', '1']) || '';
                                const peer2 = curData.getIn(['radioList', radioId, 'vapList', '0', 'peers', '2']) || '';
                                const radioList = curData.get('radioList')
                                                  .setIn([radioId, 'vapList', '0', 'peers', '0'], data.value)
                                                  .setIn([radioId, 'vapList', '0', 'peers', '1'], peer1)
                                                  .setIn([radioId, 'vapList', '0', 'peers', '2'], peer2);
                                this.props.updateItemSettings({ radioList });
                              }}
                              {...apmac1}
                            />
                            <FormGroup
                              type="text"
                              value={curData.getIn(['radioList', radioId, 'vapList', '0', 'peers', '1']) || ''}
                              onChange={(data) => {
                                const peer0 = curData.getIn(['radioList', radioId, 'vapList', '0', 'peers', '0']) || '';
                                const peer2 = curData.getIn(['radioList', radioId, 'vapList', '0', 'peers', '2']) || '';
                                const radioList = curData.get('radioList')
                                                  .setIn([radioId, 'vapList', '0', 'peers', '0'], peer0)
                                                  .setIn([radioId, 'vapList', '0', 'peers', '1'], data.value)
                                                  .setIn([radioId, 'vapList', '0', 'peers', '2'], peer2);
                                this.props.updateItemSettings({ radioList });
                              }}
                              {... apmac2}
                            />
                            <FormGroup
                              type="text"
                              value={curData.getIn(['radioList', radioId, 'vapList', '0', 'peers', '2']) || ''}
                              onChange={(data) => {
                                const peer0 = curData.getIn(['radioList', radioId, 'vapList', '0', 'peers', '0']) || '';
                                const peer1 = curData.getIn(['radioList', radioId, 'vapList', '0', 'peers', '1']) || '';
                                const radioList = curData.get('radioList')
                                                  .setIn([radioId, 'vapList', '0', 'peers', '0'], peer0)
                                                  .setIn([radioId, 'vapList', '0', 'peers', '1'], peer1)
                                                  .setIn([radioId, 'vapList', '0', 'peers', '2'], data.value);
                                this.props.updateItemSettings({ radioList });
                              }}
                              {... apmac3}
                            />
                          </div>
                        ) : null
                      }
                    </div>
                    {/* // station模式下，对端AP的mac地址输入框
                      (curData.getIn(['radioList', radioId, 'wirelessMode']) === 'sta') ? (
                        <div>
                          <FormGroup
                            label={_('Lock To AP')}
                            type="checkbox"
                            checked={curData.getIn(['radioList', radioId, 'vapList', '0', 'apMacEnable']) === '1'}
                            onChange={(data) => {
                              const radioList = curData.get('radioList')
                                              .setIn([radioId, 'vapList', '0', 'apMacEnable'], data.value);
                              this.props.updateItemSettings({ radioList });
                            }}
                          />
                          {
                            curData.getIn(['radioList', radioId, 'vapList', '0', 'apMacEnable']) === '1' ? (
                              <FormGroup
                                label={_('Peer Mac')}
                                form="radioSettings"
                                value={curData.getIn(['radioList', radioId, 'vapList', '0', 'apMac'])}
                                onChange={(data) => {
                                  const radioList = curData.get('radioList')
                                                  .setIn([radioId, 'vapList', '0', 'apMac'], data.value);
                                  this.props.updateItemSettings({ radioList });
                                }}
                                placeholder={_('not necessary')}
                                {...staApmac}
                              />
                            ) : null
                          }
                        </div>
                      ) : null
                    }
                    {/* // station模式下，对端AP的mac地址输入框
                      (curData.getIn(['radioList', radioId, 'wirelessMode']) === 'sta') ? (
                        <div>
                          <FormGroup
                            label={_('Lock To AP')}
                            type="checkbox"
                            checked={curData.getIn(['radioList', radioId, 'vapList', '0', 'apMacEnable']) === '1'}
                            onChange={(data) => {
                              const radioList = curData.get('radioList')
                                              .setIn([radioId, 'vapList', '0', 'apMacEnable'], data.value);
                              this.props.updateItemSettings({ radioList });
                            }}
                          />
                          {
                            curData.getIn(['radioList', radioId, 'vapList', '0', 'apMacEnable']) === '1' ? (
                              <FormGroup
                                label={_('Peer Mac')}
                                form="radioSettings"
                                value={apMac}
                                onChange={(data) => {
                                  const radioList = curData.get('radioList')
                                                  .setIn([radioId, 'vapList', '0', 'apMac'], data.value);
                                  this.props.updateItemSettings({ radioList });
                                }}
                                placeholder={_('not necessary')}
                                {...staApmac}
                              />
                            ) : null
                          }
                        </div>
                      ) : null
                    */}

                    { // station模式，lock to ap功能根据lockType值判断是否是华润定制
                      (curData.getIn(['radioList', radioId, 'wirelessMode']) === 'sta' && curData.get('lockType') === '0') ? (
                        <div>
                          <FormGroup
                            label={_('Lock To AP')}
                            type="checkbox"
                            checked={curData.getIn(['radioList', radioId, 'vapList', '0', 'apMacEnable']) === '1'}
                            onChange={(data) => {
                              const radioList = curData.get('radioList')
                                              .setIn([radioId, 'vapList', '0', 'apMacEnable'], data.value);
                              this.props.updateItemSettings({ radioList });
                            }}
                          />
                          {
                            curData.getIn(['radioList', radioId, 'vapList', '0', 'apMacEnable']) === '1' ? (
                              <FormGroup
                                label={_('Peer Mac')}
                                form="radioSettings"
                                value={apMac}
                                onChange={(data) => {
                                  const radioList = curData.get('radioList')
                                                  .setIn([radioId, 'vapList', '0', 'apMac'], data.value);
                                  this.props.updateItemSettings({ radioList });
                                }}
                                placeholder={_('not necessary')}
                                {...staApmac}
                              />
                            ) : null
                          }
                        </div>
                      ) : null
                    }
                    { // station模式下，根据lockType判断是否是华润定制模式
                      (curData.getIn(['radioList', radioId, 'wirelessMode']) === 'sta' && curData.get('lockType') === '1') ? (
                        <div>
                          <FormGroup
                            label={_('Lock To AP')}
                            type="checkbox"
                            checked={curData.getIn(['radioList', radioId, 'vapList', '0', 'apMacEnable']) === '1'}
                            onChange={(data) => {
                              const radioList = curData.get('radioList')
                                              .setIn([radioId, 'vapList', '0', 'apMacEnable'], data.value);
                              this.props.updateItemSettings({ radioList });
                            }}
                          />
                          {
                            curData.getIn(['radioList', radioId, 'vapList', '0', 'apMacEnable']) === '1' ? (
                              <div>
                                <div className="clearfix">
                                  <FormGroup
                                    className="fl"
                                    label={_('Peer Mac')}
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
                                                    const radioList = curData.get('radioList')
                                                                      .setIn([radioId, 'vapList', '0', 'apMacList'], macList);
                                                    this.props.updateItemSettings({ radioList });
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
                                                    const radioList = curData.get('radioList')
                                                                      .setIn([radioId, 'vapList', '0', 'apMacList'], macList);
                                                    this.props.updateItemSettings({ radioList });
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
                                        {_('Peers mac address table. The mac order represents the connection priority. The mac in higher order has the higher priority than mac bellow.The table allows you to drag to re-order to change the priority.')}
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
                                    text={_('Add')}
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
                                              text: _('Mac list number can not exceed 5.'),
                                            });
                                          } else if (macList.includes(val)) {
                                            this.props.createModal({
                                              id: 'settings',
                                              role: 'alert',
                                              text: _('The mac address already exists in the list!'),
                                            });
                                          } else if (val !== '') {
                                            macList = macList.push(val);
                                            const radioList = curData.get('radioList')
                                                            .setIn([radioId, 'vapList', '0', 'apMacList'], macList);
                                            this.props.updateItemSettings({ radioList });
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
                        (curData.getIn(['radioList', radioId, 'wirelessMode']) === 'sta' ||
                          curData.getIn(['radioList', radioId, 'wirelessMode']) === 'ap') ? (
                            <div>
                              <FormGroup
                                label={_('Security')}
                                type="select"
                                options={staAndApSecurityOptions}
                                value={curData.getIn(['radioList', radioId, 'vapList', '0', 'security', 'mode']) || 'none'}
                                onChange={data => this.onSecurityModeChange(data)}
                              />
                            </div>
                        ) : null
                      }
                      {
                        (curData.getIn(['radioList', radioId, 'wirelessMode']) === 'repeater') ? (
                          <div>
                            <FormGroup
                              label={_('Security')}
                              type="select"
                              options={repeaterSecurityOptions}
                              value={curData.getIn(['radioList', radioId, 'vapList', '0', 'security', 'mode'])}
                              onChange={data => this.onSecurityModeChange(data)}
                            />
                          </div>
                        ) : null
                      }
                      {
                        (curData.getIn(['radioList', radioId, 'vapList', '0', 'security', 'mode']) === 'none' ||
                        curData.getIn(['radioList', radioId, 'vapList', '0', 'security', 'mode']) === 'wep') ? null : (
                          <div style={{ width: '350px' }}>
                            <FormGroup
                              label={_('Encryption')}
                              minWidth="66px"
                              type="switch"
                              value={curData.getIn(['radioList', radioId, 'vapList', '0', 'security', 'cipher'])}
                              onChange={(data) => {
                                const security = curData.getIn(['radioList', radioId, 'vapList', '0', 'security'])
                                                        .set('cipher', data.value);
                                const radioList = curData.get('radioList')
                                                        .setIn([radioId, 'vapList', '0', 'security'], security);
                                this.props.updateItemSettings({ radioList });
                              }}
                              options={[
                                { label: 'AES', value: 'aes' },
                                { label: 'TKIP', value: 'tkip' },
                                { label: 'MIXED', value: 'aes&tkip' },
                              ]}
                            />
                            <FormGroup
                              label={_('Password')}
                              type="password"
                              form="radioSettings"
                              required
                              value={curData.getIn(['radioList', radioId, 'vapList', '0', 'security', 'key'])}
                              onChange={(data) => {
                                const security = curData.getIn(['radioList', radioId, 'vapList', '0', 'security'])
                                                              .set('key', data.value);
                                const radioList = curData.get('radioList')
                                                            .setIn([radioId, 'vapList', '0', 'security'], security);
                                this.props.updateItemSettings({ radioList });
                              }}
                              {...validPwd1}
                            />
                          </div>
                        )
                      }
                      {
                        (curData.getIn(['radioList', radioId, 'vapList', '0', 'security', 'mode']) === 'wep') ? (
                          <div style={{ width: '350px' }}>
                            <FormGroup
                              label={_('Auth Type')}
                              type="select"
                              options={wepAuthenOptions}
                              value={curData.getIn(['radioList', radioId, 'vapList', '0', 'security', 'auth'])}
                              onChange={(data) => {
                                const security = curData.getIn(['radioList', radioId, 'vapList', '0', 'security'])
                                                .set('auth', data.value);
                                const radioList = curData.get('radioList')
                                                .setIn([radioId, 'vapList', '0', 'security'], security);
                                this.props.updateItemSettings({ radioList });
                              }}
                            />
                            <FormGroup
                              label={_('Key Index')}
                              type="select"
                              options={keyIndexOptions}
                              value={curData.getIn(['radioList', radioId, 'vapList', '0', 'security', 'keyIndex'])}
                              onChange={(data) => {
                                const security = curData.getIn(['radioList', radioId, 'vapList', '0', 'security'])
                                                .set('keyIndex', data.value);
                                const radioList = curData.get('radioList')
                                                .setIn([radioId, 'vapList', '0', 'security'], security);
                                this.props.updateItemSettings({ radioList });
                              }}
                            />
                            <FormGroup
                              label={_('Key Format')}
                              type="select"
                              options={keyTypeOptions}
                              value={curData.getIn(['radioList', radioId, 'vapList', '0', 'security', 'keyType'])}
                              onChange={(data) => {
                                const security = curData.getIn(['radioList', radioId, 'vapList', '0', 'security'])
                                                        .set('keyType', data.value);
                                const radioList = curData.get('radioList')
                                      .setIn([radioId, 'vapList', '0', 'security'], security);
                                this.props.updateItemSettings({ radioList });
                              }}
                            />
                            <FormGroup
                              type="password"
                              required
                              label={_('Password')}
                              form="radioSettings"
                              value={curData.getIn(['radioList', radioId, 'vapList', '0', 'security', 'key'])}
                              onChange={(data) => {
                                const security = curData.getIn(['radioList', radioId, 'vapList', '0', 'security'])
                                                        .set('key', data.value);
                                const radioList = curData.get('radioList')
                                                .setIn([radioId, 'vapList', '0', 'security'], security);
                                this.props.updateItemSettings({ radioList });
                              }}
                              {...this.props.validateOption[curData.getIn(['radioList', radioId, 'vapList', '0', 'security', 'keyType'])]}
                            />
                          </div>
                        ) : null
                      }
                    </div>
                    <div className="bubble-arrow-after" />
                  </div>
                ) : null
              }

              <div className="cols col-12">
                <SaveButton
                  type="button"
                  loading={this.props.app.get('saving') &&
                          this.props.selfState.get('whichButton') === 'radioSettings'}
                  onClick={() => {
                    /** 规避添加新SSID但不编辑，再保存射频信息时，会下发空SSID的问题，暂时规避！ */
                    const vapList = curData.getIn(['radioList', radioId, 'vapList'])
                                    .filter(item => item.get('ssid') !== '');
                    const radioList = curData.get('radioList').setIn([radioId, 'vapList'], vapList);
                    /** ******************************************************************** */
                    this.props.changeWhichButton('radioSettings');
                    Promise.resolve().then(() => {
                      this.props.updateItemSettings({ radioList });
                    }).then(() => {
                      this.onSave('radioSettings');
                    });
                  }}
                />
              </div>
            </div>
          ) : null
        }
        <div className="cols col-12 o-box__cell">
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
                  style={{
                    fontSize: '1.17em',
                    fontFamily: 'Microsoft YaHei',
                    fontWeight: 'bold',
                    paddingLeft: '4px',
                    cursor: 'pointer',
                  }}
                >
                  {_('Multiple SSID')}
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
                  style={{
                    fontSize: '1.17em',
                    fontFamily: 'Microsoft YaHei',
                    fontWeight: 'bold',
                    paddingLeft: '4px',
                    cursor: 'pointer',
                  }}
                >
                  {_('Multiple SSID')}
                </span>
              </icon>
            )
          }
        </div>
        {
          this.props.selfState.get('showMultiSsid') ? (
            <div className="cols col-12 o-box__cell">
              <Table
                className="table"
                options={this.props.selfState.get('ssidTableOptions')}
                list={(() => {
                  const list = fromJS([]);
                  if (curData.getIn(['radioList', radioId])) {
                    if (curData.getIn(['radioList', radioId, 'wirelessMode']) !== 'sta') {
                      return curData.getIn(['radioList', radioId, 'vapList']);
                    }
                    return curData.getIn(['radioList', radioId, 'vapList']).setSize(1);
                  }
                  return list;
                })()
                }
              />
              <div
                style={{ marginTop: '10px' }}
              >
                <Button
                  text={_('Add')}
                  icon="plus"
                  onClick={() => this.onAddNewSsidItem()}
                  style={{ marginRight: '10px' }}
                  disabled={curData.getIn(['radioList', radioId, 'wirelessMode']) === 'sta'}
                />
                <SaveButton
                  type="button"
                  loading={this.props.app.get('saving') &&
                          this.props.selfState.get('whichButton') === 'multiSsid'}
                  // disabled={curData.get('wirelessMode') === 'sta'}
                  onClick={() => {
                    let error = '';
                    let totalNum = 0;
                    const vapList = curData.getIn(['radioList', radioId, 'vapList']).toJS();
                    const radioClientLimit = curData.getIn(['radioList', radioId, 'maxRadioClients']);
                    const len = curData.getIn(['radioList', radioId, 'wirelessMode']) === 'sta' ? 1 : vapList.length;
                    // console.log('len', curData.getIn([radioId, 'wirelessMode']));
                    const re = /^[0-9]*[1-9][0-9]*$/;
                    for (let i = 0; i < len; i++) {
                      if (!re.test(vapList[i].vlanId)) {
                        error = _('Vlan ID must be positive interger !');
                        break;
                      }
                      if (vapList[i].vlanId < 1 || vapList[i].vlanId > 4094) {
                        error = _('Vlan ID number out of range ! (1 ~ 4094)');
                        break;
                      }
                      if (vapList[i].ssid === '') {
                        error = _('SSID can not be empty string !');
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
                          error = _('Max clients number must be positive interger !');
                          break;
                        }
                        totalNum += Number(vapList[i].maxClients);
                      }
                    }
                    if (funConfig.radioMaxClientsLimit && // 射频最大客户端限制功能存在
                        radioClientLimit !== 0 && // 为零表示不限制
                        totalNum > radioClientLimit) {
                      error = `${_('The total number of ssid maximum clients should not exceed ')}${radioClientLimit}`;
                    }
                    if (error === '') {
                      this.props.changeWhichButton('multiSsid');
                      this.onSave('multiSsid');
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

        {
          /*
          <div className="form-group form-group--save">
            <div className="form-control">
              <SaveButton
                type="button"
                loading={this.props.app.get('saving')}
                onClick={this.onSave}
              />
            </div>
          </div>
        */
        }

        <Modal
          title={_('Speed Limit')}
          isShow={this.props.selfState.get('showSpeedLimitModal')}
          draggable
          onOk={() => {
            this.props.validateAll('speedlimitform').then((msg) => {
              if (msg.isEmpty()) {
                const pos = tableItemForSsid.get('pos');
                const vapList = curData.getIn(['radioList', radioId, 'vapList'])
                                .set(pos, tableItemForSsid.get('item'));
                const radioList = curData.get('radioList').setIn([radioId, 'vapList'], vapList);
                this.props.updateItemSettings({ radioList });
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
            label={_('Speed Limit')}
            checked={tableItemForSsid.getIn(['item', 'speedLimit', 'enable']) === '1'}
            onClick={() => {
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
                  label={_('Max Upload Speed')}
                  form="speedlimitform"
                  value={tableItemForSsid.getIn(['item', 'speedLimit', 'upload'])}
                  onChange={(data) => {
                    const newItem = tableItemForSsid.get('item')
                                    .setIn(['speedLimit', 'upload'], data.value);
                    const newItemForSsid = tableItemForSsid.set('item', newItem);
                    this.props.changeTableItemForSsid(newItemForSsid);
                  }}
                  style={{ width: '400px' }}
                  help="KB"
                  required
                  {...validUpload}
                />
                <FormGroup
                  type="number"
                  label={_('Max Download Speed')}
                  form="speedlimitform"
                  value={tableItemForSsid.getIn(['item', 'speedLimit', 'download'])}
                  onChange={(data) => {
                    const newItem = tableItemForSsid.get('item')
                                    .setIn(['speedLimit', 'download'], data.value);
                    const newItemForSsid = tableItemForSsid.set('item', newItem);
                    this.props.changeTableItemForSsid(newItemForSsid);
                  }}
                  style={{ width: '400px' }}
                  help="KB"
                  required
                  {...validDownload}
                />
              </div>
            ) : null
          }
        </Modal>
        <Modal
          title={_('Security Settings For SSID')}
          isShow={tableItemForSsid.get('isShow') === '1'}
          draggable
          onOk={() => {
            this.props.validateAll('ssidSecurityModal').then((msg) => {
              if (msg.isEmpty()) {
                const pos = tableItemForSsid.get('pos');
                const vapList = curData.getIn(['radioList', radioId, 'vapList'])
                                .set(pos, tableItemForSsid.get('item'));
                const radioList = curData.get('radioList').setIn([radioId, 'vapList'], vapList);
                this.props.updateItemSettings({ radioList });
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
            label={_('Security')}
            type="select"
            options={staAndApSecurityOptions}
            value={tableItemForSsid.getIn(['item', 'security', 'mode'])}
            onChange={(data) => {
              const securDefault = fromJS({
                cipher: 'aes',
                auth: 'shared',
                keyType: 'Hex',
                keyIndex: '1',
              });
              const currentSecur = tableItemForSsid.getIn(['item', 'security']);

              const secur = securDefault.merge(currentSecur)
                            .set('mode', data.value).set('key', '');
              // console.log('currentSecur', currentSecur.toJS(), secur.toJS());
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
                    label={_('Encryption')}
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
                    label={_('Password')}
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
                  label={_('Auth Type')}
                  type="select"
                  options={wepAuthenOptions}
                  value={tableItemForSsid.getIn(['item', 'security', 'auth'])}
                  onChange={(data) => {
                    const newItem = tableItemForSsid.get('item')
                                    .setIn(['security', 'auth'], data.value);
                    const newItemForSsid = tableItemForSsid.set('item', newItem);
                    this.props.changeTableItemForSsid(newItemForSsid);
                  }}
                />
                {
                  /**
                  <FormGroup
                    label={_('Key Length')}
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
                  label={_('Key Index')}
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
                  label={_('Key Format')}
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
                  label={_('Password')}
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
