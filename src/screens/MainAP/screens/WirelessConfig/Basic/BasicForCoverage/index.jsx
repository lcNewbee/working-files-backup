import React from 'react'; import PropTypes from 'prop-types';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { Map, fromJS } from 'immutable';
import validator from 'shared/validator';
import { bindActionCreators } from 'redux';
import Icon from 'shared/components/Icon';
import { FormGroup, FormInput, Modal, Table, SaveButton, icon } from 'shared/components';
import { Button } from 'shared/components/Button';
import { actions as appActions } from 'shared/containers/app';
import { actions } from 'shared/containers/settings';
import * as selfActions from './actions';
import reducer from './reducer';
import countryMap from './country';

const remarkTxt = require('shared/validator/validates/single').remarkTxt;

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
  reciveFetchSettings: PropTypes.func,
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

const defaultRadioModeOptionsFor5g = [
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
    utils.binds(this, [
      'onSave', 'onHideSsidboxClick', 'onStopScanClick', 'onScanBtnClick',
      'onModalOkBtnClick', 'onModalCloseBtnClick', 'onSelectScanResultItem',
      'onChengeWirelessMode', 'noErrorThisPage', 'onCloseCountrySelectModal',
      'makeChannelOptions', 'onSecurityModeChange', 'onAddNewSsidItem',
      'onDeleteBtnClick', 'onSsidItemChange', 'fetchFullPageData',
      'firstInAndRefresh', 'onChangeRadio', 'makeSsidTableOptions', 'renderOperateRadio',
      'saveCountrySelectModal', 'saveCountrySelectModal', 'radioSettingsHeadClassName',
      'radioSettingsHeadClassName', 'getChannelListAndPowerRange', 'sortMacOrder',
      'renderEnableBtn', 'renderSsidInput', 'renderVlanIdInput', 'renderMaxClientsInput',
      'renderCheckboxBtn', 'renderSecurityBtn', 'renderSpeedLimitBtn', 'renderDeleteBtn',
    ]);
    this.state = {
      ssidTableFullMemberOptions: fromJS([
        {
          id: 'enable',
          label: __('Enable'),
          width: '200px',
          marginLeft: '3px',
          render: (val, item) => this.renderEnableBtn(val, item),
        },
        {
          id: 'ssid',
          label: __('SSID'),
          width: '250px',
          paddingLeft: '60px',
          render: (val, item) => this.renderSsidInput(val, item),
        },
        {
          id: 'vlanId',
          label: __('VLAN ID'),
          width: '250px',
          paddingLeft: '30px',
          render: (val, item) => this.renderVlanIdInput(val, item),
        },
        {
          id: 'maxClients',
          label: __('Max Clients'),
          width: '250px',
          paddingLeft: '22px',
          render: (val, item) => this.renderMaxClientsInput(val, item),
        },
        {
          id: 'airTimeEnable',
          label: __('Airtime Fairness'),
          width: '250px',
          paddingLeft: '-30px',
          render: (val, item) => this.renderCheckboxBtn(val, item, 'airTimeEnable'),
        },
        {
          id: 'hideSsid',
          label: __('Hide'),
          width: '200px',
          render: (val, item) => this.renderCheckboxBtn(val, item, 'hideSsid'),
        },
        {
          id: 'isolation',
          label: __('Client Isolation'),
          width: '200px',
          marginLeft: '-20px',
          render: (val, item) => this.renderCheckboxBtn(val, item, 'isolation'),
        },
        {
          id: 'portalEnable',
          label: __('Portal'),
          width: '200px',
          render: (val, item) => this.renderCheckboxBtn(val, item, 'portalEnable'),
        },
        {
          id: 'security',
          label: __('Security'),
          width: '200px',
          paddingLeft: '8px',
          render: (val, item) => this.renderSecurityBtn(val, item),
        },
        {
          id: 'speedLimit',
          label: __('Speed Limit'),
          width: '200px',
          marginLeft: '-8px',
          render: (val, item) => this.renderSpeedLimitBtn(val, item),
        },
        {
          id: 'delete',
          label: __('Delete'),
          width: '200px',
          render: (val, item) => this.renderDeleteBtn(val, item),
        },
      ]),
    };
  }

  componentWillMount() {
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
          // 验证SSID是否合法
          const vaplen = dataToSave.get('vapList').size;
          let i = 0;
          for (;i < vaplen; i++) {
            const ssid = dataToSave.getIn(['vapList', i, 'ssid']);
            const message = remarkTxt(ssid, "'\\\\");
            if (message) {
              this.props.createModal({
                id: 'settings',
                role: 'alert',
                text: `SSID ${i + 1}: ${message}`,
              });
              break;
            }
          }
          if (i < vaplen) return null; // 循环提前退出，说明验证不通过
          // 保留修改的SSID，将后台传递的射频信息原封不动地赋值到将要保存的对象中，再发给后台
          dataFromServer = dataFromServer.delete('vapList');
          dataToSave = dataToSave.merge(dataFromServer);
          // 修正ssid，将所有ssid的首尾空格去掉
          const ssidList = dataToSave.get('vapList').map((item) => {
            const ssid = item.get('ssid');
            const text = ssid.replace(/(^\s*)|(\s*$)/g, '');
            return item.set('ssid', text);
          });
          dataToSave = dataToSave.set('vapList', ssidList);
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
          const curWirelessMode = this.props.store.getIn(['curData', 'radioList', radioId, 'wirelessMode']);
          let newRadioList = this.props.store.getIn(['curData', 'radioList']).setIn([radioId, 'wirelessMode'], data.value);
          const securityMode = this.props.store.getIn(['curData', 'radioList', radioId, 'vapList', 0, 'security', 'mode']);
          if (curWirelessMode !== data.value || (data.value === 'repeater' && securityMode !== 'wep')) {
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
    const cipher = preSecurity.get('cipher') || 'aes&tkip';
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
        cipher: 'aes&tkip',
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

  renderEnableBtn(val, item) {
    const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
    const pos = this.props.store.getIn(['curData', 'radioList', radioId, 'vapList']).keyOf(item);
    const flag = (pos === 0);
    return (
      <FormInput
        type="checkbox"
        checked={val === '1'}
        // disabled={flag}
        onChange={() => this.onSsidItemChange(val, item, 'enable', (val === '1' ? '0' : '1'))}
      />
    );
  }

  renderSsidInput(val, item) {
    const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
    const pos = this.props.store.getIn(['curData', 'radioList', radioId, 'vapList']).keyOf(item);
    return (
      <FormInput
        type="text"
        value={val}
        // disabled={pos === 0 && this.props.store.getIn(['curData', 'radioList', radioId, 'wirelessMode']) !== 'ap'}
        onChange={(data) => {
          const ssid = item.get('ssid');
          const str = ssid.replace(/(^\s*)|(\s*$)/g, '');
          if (str === '' && data.value === ' ') return null;
          else if (utils.getUtf8Length(data.value) <= 32) {
            this.onSsidItemChange(val, item, 'ssid', data.value);
          }
        }}
        style={{
          height: '29px',
        }}
      />
    );
  }

  renderVlanIdInput(val, item) {
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
          height: '29px',
          width: '100px',
        }}
      />
    );
  }

  renderMaxClientsInput(val, item) {
    return (
      <FormInput
        type="number"
        value={val}
        max="512"
        min="1"
        defaultValue="64"
        onChange={(data) => {
          this.onSsidItemChange(val, item, 'maxClients', data.value);
        }}
        style={{
          height: '29px',
          width: '100px',
        }}
      />
    );
  }

  renderCheckboxBtn(val, item, type) {
    return (
      <FormInput
        type="checkbox"
        checked={val === '1'}
        onChange={
          () => this.onSsidItemChange(val, item, type, (val === '1' ? '0' : '1'))
        }
      />
    );
  }

  renderSecurityBtn(val, item) {
    const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
    const pos = this.props.store.getIn(['curData', 'radioList', radioId, 'vapList']).keyOf(item);
    return (
      <Button
        text={__('Edit')}
        icon="pencil-square"
        size="sm"
        // disabled={pos === 0 && this.props.store.getIn(['curData', 'radioList', radioId, 'wirelessMode']) !== 'ap'}
        onClick={() => {
          const tableItemForSsid = fromJS({}).set('val', val)
                .set('item', item).set('isShow', '1')
                .set('pos', pos);
          this.props.changeTableItemForSsid(tableItemForSsid);
        }}
      />
    );
  }

  renderSpeedLimitBtn(val, item) {
    const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
    const pos = this.props.store.getIn(['curData', 'radioList', radioId, 'vapList']).keyOf(item);
    return (
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
    );
  }

  renderDeleteBtn(val, item) {
    const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
    const pos = this.props.store.getIn(['curData', 'radioList', radioId, 'vapList']).keyOf(item);
    return (
      <div style={{ marginLeft: '-12px' }}>
        <Button
          text={__('Delete')}
          icon="times"
          size="sm"
          // disabled={pos === 0}
          onClick={() => this.onDeleteBtnClick(item)}
        />
      </div>
    );
  }

  renderOperateRadio(val, item) {
    return (
      <FormInput
        type="radio"
        name="selectScanItem"
        onChange={() => this.onSelectScanResultItem(item)}
      />
    );
  }

  render() {
    const that = this;
    const modalOptions = fromJS([
      {
        id: 'operate',
        text: __('Select'),
        render: (val, item) => that.renderOperateRadio(val, item),
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
        render: (val) => {
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
    const radioModeOptionsFor5g = funConfig.radioModeOptionsFor5g ? funConfig.radioModeOptionsFor5g
                                                                  : defaultRadioModeOptionsFor5g;
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
              label={__('Radio Select')}
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
                    style={{
                      fontSize: '1.17em',
                      fontFamily: 'Microsoft YaHei',
                      fontWeight: 'bold',
                      paddingLeft: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    {__('Radio Settings')}
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
                style={{ overflow: 'visible' }}
              >
                <FormGroup
                  type="checkbox"
                  label={__('Radio')}
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
                      label={__('Radio Mode')}
                    />
                  )
                }
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
                    theme="primary"
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
                  onOk={this.saveCountrySelectModal}
                  draggable
                  isShow={this.props.selfState.get('showCtyModal')}
                >
                  <h3>{__('User Protocol')}</h3>
                  <span>
                    {__('The initial Wi-Fi setup requires you to specify the country code for the country in which the AP operates. Configuring a country code ensures the radio\'s frequency bands, channels, and transmit power levels are compliant with country-specific regulations.')}
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
                      label={__('Channel Bandwidth')}
                      type="switch"
                      minWidth="66px"
                      options={channelWidthOptions.slice(0, 3)}
                      value={curData.getIn(['radioList', radioId, 'channelWidth'])}
                      onChange={(data) => {
                        const radioList = curData.get('radioList').setIn([radioId, 'channelWidth'], data.value);
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
                      label={__('Channel Bandwidth')}
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
                      label={__('Channel Bandwidth')}
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
                  label={__('Channel')}
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
                      label={__('Max Clients')}
                      type="number"
                      max={512}
                      min={1}
                      form="radioSettings"
                      value={curData.getIn(['radioList', radioId, 'maxRadioClients'])}
                      onChange={(data) => {
                        const radioList = curData.get('radioList')
                                          .setIn([radioId, 'maxRadioClients'], data.value);
                        this.props.updateItemSettings({ radioList });
                      }}
                      help={`${__('Range: ')}1 ~ 200`}
                      required
                      {...validMaxClients}
                    />
                  ) : null
                }
                <FormGroup
                  label={__('Tx Power')}
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
                  help={`${__('Range: ')} ${this.props.selfState.get('minTxpower') || '3'}~${this.props.selfState.get('maxTxpower') || '23'} dBm`}
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
                                label={__('Remote SSID')}
                                className="fl"
                                type="text"
                                form="radioSettings"
                                value={curData.getIn(['radioList', radioId, 'vapList', '0', 'ssid'])}
                                onChange={(data) => {
                                  const ssid = this.props.store.getIn(['curData', 'radioList', radioId, 'vapList', '0', 'ssid']);
                                  const str = ssid.replace(/(^\s*)|(\s*$)/g, '');
                                  if (str === '' && data.value === ' ') return null;
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
                                  text={__('Stop')}
                                  onClick={this.onStopScanClick}
                                  loading
                                />
                              ) : (
                                <Button
                                  text={__('Scan')}
                                  theme="primary"
                                  onClick={this.onScanBtnClick}
                                />
                              )
                            }
                          </div>
                        </div>
                        ) : null
                    }
                    {
                      curData.getIn(['radioList', radioId, 'wirelessMode']) === 'sta' &&
                      this.props.route.funConfig.hasIptvFun && (
                        <div>
                          <FormGroup
                            type="checkbox"
                            label={__('IPTV Enable')}
                            checked={curData.getIn(['radioList', radioId, 'vapList', '0', 'iptvEnable']) === '1'}
                            onChange={(data) => {
                              const radioList = curData.get('radioList')
                                        .setIn([radioId, 'vapList', '0', 'iptvEnable'], data.value);
                              this.props.updateItemSettings({ radioList });
                            }}
                          />
                          {
                            curData.getIn(['radioList', radioId, 'vapList', '0', 'iptvEnable']) === '1' && (
                              <FormGroup
                                type="number"
                                label={__('IPTV Vlan')}
                                value={curData.getIn(['radioList', radioId, 'vapList', '0', 'iptvVlanId'])}
                                onChange={(data) => {
                                  const radioList = curData.get('radioList')
                                            .setIn([radioId, 'vapList', '0', 'iptvVlanId'], data.value);
                                  this.props.updateItemSettings({ radioList });
                                }}
                              />
                            )
                          }
                        </div>
                      )
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
                                label={__('Remote SSID')}
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
                              checked={curData.getIn(['radioList', radioId, 'vapList', '0', 'hideSsid']) === '1'}
                              onClick={data => this.onHideSsidboxClick(data)}
                            />
                            {__('Hide')}
                          </div>
                        </div>
                      ) : null
                    }
                    {
                      curData.getIn(['radioList', radioId, 'wirelessMode']) === 'sta' ? null : (
                        <FormGroup
                          type="number"
                          label={__('VLAN ID')}
                          value={curData.getIn(['radioList', radioId, 'vapList', '0', 'vlanId'])}
                          help={`${__('Range: ')}1~4094`}
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
                    <div style={{ width: '370px' }}>
                      { // repeater模式下，对端AP的mac地址输入框
                        (curData.getIn(['radioList', radioId, 'wirelessMode']) === 'repeater') ? (
                          <div>
                            <FormGroup
                              label="WDS Peers"
                              type="text"
                              minWidth="350px"
                              className="basic-wds-mac-input"
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

                    { // station模式，lock to ap功能根据lockType值判断是否是华润定制
                      (curData.getIn(['radioList', radioId, 'wirelessMode']) === 'sta' && curData.get('lockType') === '0') ? (
                        <div>
                          <FormGroup
                            label={__('Lock To AP')}
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
                                label={__('Peer Mac')}
                                form="radioSettings"
                                value={apMac}
                                onChange={(data) => {
                                  const radioList = curData.get('radioList')
                                                  .setIn([radioId, 'vapList', '0', 'apMac'], data.value);
                                  this.props.updateItemSettings({ radioList });
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
                      (curData.getIn(['radioList', radioId, 'wirelessMode']) === 'sta' && curData.get('lockType') === '1') ? (
                        <div>
                          <FormGroup
                            label={__('Lock To AP')}
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
                                label={__('Security')}
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
                              label={__('Security')}
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
                          <div style={{ width: '370px' }}>
                            <FormGroup
                              label={__('Encryption')}
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
                              label={__('Password')}
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
                          <div style={{ width: '370px' }}>
                            <FormGroup
                              label={__('Authentication Type')}
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
                              label={__('Key Index')}
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
                              label={__('Key Format')}
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
                              label={__('Password')}
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
                  style={{
                    fontSize: '1.17em',
                    fontFamily: 'Microsoft YaHei',
                    fontWeight: 'bold',
                    paddingLeft: '4px',
                    cursor: 'pointer',
                  }}
                >
                  {__('Multiple SSID')}
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
                  text={__('Add')}
                  icon="plus"
                  theme="primary"
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
                    const re = /^[0-9]*[1-9][0-9]*$/;
                    for (let i = 0; i < len; i++) {
                      if (!re.test(vapList[i].vlanId)) {
                        error = __('VLAN ID must be positive interger !');
                        break;
                      }
                      if (vapList[i].vlanId < 1 || vapList[i].vlanId > 4094) {
                        error = __('VLAN ID number out of range ! (1 ~ 4094)');
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
          title={__('Speed Limit')}
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
            label={__('Speed Limit')}
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
                  label={__('Max Upload Speed')}
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
                  label={__('Max Download Speed')}
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
          title={__('Security Settings For SSID')}
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
            label={__('Security')}
            type="select"
            options={staAndApSecurityOptions}
            value={tableItemForSsid.getIn(['item', 'security', 'mode'])}
            onChange={(data) => {
              const securDefault = fromJS({
                cipher: 'aes&tkip',
                auth: 'shared',
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
