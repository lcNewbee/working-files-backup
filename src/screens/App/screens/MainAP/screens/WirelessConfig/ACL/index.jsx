import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, SaveButton } from 'shared/components/Button';
import { fromJS, Map, List } from 'immutable';
import { FormInput, FormGroup } from 'shared/components/Form';
import validator from 'shared/validator';
import * as sharedActions from 'shared/actions/settings';
import * as appActions from 'shared/actions/app';
import utils from 'shared/utils';
import * as actions from './actions';
import reducer from './reducer';
import MacList from './MacList';

const propTypes = {
  store: PropTypes.instanceOf(Map),
  route: PropTypes.object,
  initSettings: PropTypes.func,
  save: PropTypes.func,
  fetchSettings: PropTypes.func,
  saveSettings: PropTypes.func,
  app: PropTypes.instanceOf(Map),
  selfState: PropTypes.instanceOf(Map),
  fetch: PropTypes.func,
  updateItemSettings: PropTypes.func,
  changeTextAreaValue: PropTypes.func,
  onMacClick: PropTypes.func,
  maclist: PropTypes.instanceOf(List),
  macStatus: PropTypes.instanceOf(List),
  initMacstatus: PropTypes.func,
  updateMacStatus: PropTypes.func,
  changeMacInput: PropTypes.func,
  macInput: PropTypes.instanceOf(Map),
  changePreLenInMacInput: PropTypes.func,
  leaveSettingsScreen: PropTypes.func,
  leaveScreen: PropTypes.func,
  resetVaildateMsg: PropTypes.func,
  createModal: PropTypes.func,
  changeSelectedSsid: PropTypes.func,
  selectedSsid: PropTypes.number,
  validateOption: PropTypes.object,
  validateAll: PropTypes.func,
  restoreSelfState: PropTypes.func,
  product: PropTypes.instanceOf(Map),
  changeCurrRadioConfig: PropTypes.func,
  changeSsidSelectOptions: PropTypes.func,
};
const validOptions = Map({
  inputMac: validator({
    rules: 'mac',
  }),
});

const defaultProps = fromJS({
  maclist: [
  ],
  macstatus: [
  ],
});

let ssidSelectOptions = [];
export default class ACL extends React.Component {

  constructor(props) {
    super(props);
    this.updateAclMacList = this.updateAclMacList.bind(this);
    this.onMacInputChange = this.onMacInputChange.bind(this);
    this.onAddMacToLocalList = this.onAddMacToLocalList.bind(this);
    this.firstInAndRefresh = this.firstInAndRefresh.bind(this);
    this.switchToNewRadioPage = this.switchToNewRadioPage.bind(this);
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
    this.props.resetVaildateMsg();
  }


  // onMacInputChange(value) {
  //   let val = value;
  //   const lastChar = value.charAt(value.length - 1);
  //   const preLen = this.props.macInput.get('preLen');
  //   const afterLen = val.length;
  //   if (preLen < afterLen) { // 添加
  //     if (lastChar.match(/[0-9a-fA-F]/) !== null) {
  //       const macArr = val.split(':');
  //       const len = macArr.length;
  //       if (macArr[len - 1].length <= 2) {
  //         if (macArr[len - 1].length === 2 && len < 6) {
  //           val += ':';
  //         }
  //       } else { // 删除超过MAC地址长度限制的字符，不在输入框显示
  //         val = val.slice(0, -1);
  //       }
  //       this.props.changePreLenInMacInput(val.length);
  //       this.props.changeMacInput(val);
  //     } else if (lastChar.match(/[:]/) !== null) {
  //       val = value.slice(0, -1);
  //       this.props.changePreLenInMacInput(val.length);
  //       this.props.changeMacInput(val);
  //     }
  //   } else if (preLen >= afterLen) { // 删除
  //     if (lastChar === ':') {
  //       val = val.slice(0, -2);
  //       this.props.changePreLenInMacInput(val.length);
  //       this.props.changeMacInput(val);
  //     } else {
  //       const length = (val.length === 1) ? 0 : val.length;
  //       this.props.changePreLenInMacInput(length);
  //       this.props.changeMacInput(val);
  //     }
  //   }
  // }

  onMacInputChange(value) {
    this.props.changeMacInput(value);
  }

  onAddMacToLocalList() {
    const macInputVal = this.props.macInput.get('macValue').replace(/-/g, ':');
    const selectedSsid = this.props.selectedSsid;
    const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
    const preList = this.props.store.getIn(['curData', 'radioList', radioId, 'aclConfList', selectedSsid, 'macList']);
    let afterList;
    this.props.validateAll().then((msg) => {
      if (msg.isEmpty()) {
        if (macInputVal === '') return;
        if (preList.includes(macInputVal)) {
          this.props.createModal({
            id: 'settings',
            role: 'alert',
            text: __('The MAC address already exists in the mac list !'),
          });
          return;
        }
        if (preList.size < 64) {
          afterList = preList.push(macInputVal);
          const listLen = afterList.size;
          const aclConfList = this.props.store.getIn(['curData', 'radioList', radioId, 'aclConfList'])
                            .setIn([selectedSsid, 'macList'], afterList);
          const radioList = this.props.store.getIn(['curData', 'radioList'])
                      .setIn([radioId, 'aclConfList'], aclConfList);
          this.props.updateItemSettings({ radioList });
          this.props.changePreLenInMacInput(0);
          this.props.changeMacInput('');
          this.props.initMacstatus(listLen);
          this.macListWrap.scrollIntoView();
        } else {
          this.props.createModal({
            id: 'settings',
            role: 'alert',
            text: __('The number of MAC list items can not exceed 64 !'),
          });
        }
      }
    });
  }

  onChangeRadio(data) {
    const radioType = this.props.product.getIn(['deviceRadioList', data.value, 'radioType']);
    const config = fromJS({
      radioId: data.value,
      radioType,
    });
    this.props.changeCurrRadioConfig(config);
  }

  onSave() {
    const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
    const saveData = this.props.store.getIn(['curData', 'radioList', radioId])
                      .set('radioId', radioId).toJS();
    this.props.save('goform/set_acl', saveData);
  }

  // 获取后台数据并跳转到指定的radioID设置页面
  switchToNewRadioPage(radioId) {
    this.props.fetch('goform/get_acl_info_forTestUse').then((json) => {
      if (json.state && json.state.code === 2000) {
        this.props.updateItemSettings(fromJS(json.data));
        const aclConfList = fromJS(json.data).getIn(['radioList', radioId, 'aclConfList']);
        ssidSelectOptions = [];
        for (let i = 0; i < aclConfList.size; i++) {
          const optionItem = {
            value: i,
            label: aclConfList.getIn([i, 'ssid']),
          };
          ssidSelectOptions.push(optionItem);
        }
        this.props.changeSsidSelectOptions(fromJS(ssidSelectOptions));
        this.props.changeSelectedSsid({
          selectedSsid: 0,
          macListLen: aclConfList.getIn([0, 'macList']).size,
        });
      }
    });
  }

  firstInAndRefresh() {
    this.props.initSettings({
      settingId: this.props.route.id,
      fetchUrl: this.props.route.fetchUrl,
      defaultData: {
        maclist: [
        ],
      },
    });
    // 初始化页面为第一个radio
    this.onChangeRadio({ value: '0' });
    // 获取后台数据并跳转到第一个radio设置页面
    this.switchToNewRadioPage('0');
    this.props.changeMacInput('');
  }

  updateAclMacList() {
    const macStatusList = this.props.macStatus;
    const selectedSsid = this.props.selectedSsid;
    const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
    const macList = this.props.store.getIn(['curData', 'radioList', radioId, 'aclConfList', selectedSsid, 'macList']);
    let newList = fromJS([]);
    macStatusList.forEach((val, index) => {
      if (!val) {
        newList = newList.push(macList.get(index));
      }
    });
    const aclConfList = this.props.store.getIn(['curData', 'radioList', radioId, 'aclConfList'])
                            .setIn([selectedSsid, 'macList'], newList);
    const radioList = this.props.store.getIn(['curData', 'radioList'])
                      .setIn([radioId, 'aclConfList'], aclConfList);
    this.props.updateItemSettings({ radioList });
    this.props.initMacstatus(newList.size);
  }

  render() {
    const store = this.props.store;
    const selectedSsid = this.props.selectedSsid;
    const { radioId, radioType } = this.props.selfState.get('currRadioConfig').toJS();
    let maclist = store.getIn(['curData', 'radioList', radioId, 'aclConfList', selectedSsid, 'macList']);
    if (maclist === undefined) return null;
    maclist = maclist.toJS();
    const macStatus = this.props.macStatus.toJS();
    const radioSelectOptions = this.props.product.get('radioSelectOptions');
    return (
      <div>
        {
          this.props.product.get('deviceRadioList').size > 1 ? (
            <FormInput
              type="switch"
              label={__('Radio Select')}
              value={this.props.selfState.getIn(['currRadioConfig', 'radioId'])}
              options={radioSelectOptions}
              minWidth="100px"
              onChange={(data) => {
                this.onChangeRadio(data);
                this.switchToNewRadioPage(data.value);
              }}
              style={{
                marginRight: '10px',
                marginBottom: '15px',
              }}
            />
          ) : null
        }
        <FormGroup
          label={__('Enable')}
          type="checkbox"
          checked={store.getIn(['curData', 'radioList', radioId, 'aclEnable']) === '1'}
          onChange={() => {
            const curState = store.getIn(['curData', 'radioList', radioId, 'aclEnable']);
            const radioList = store.getIn(['curData', 'radioList'])
                              .setIn([radioId, 'aclEnable'], curState === '1' ? '0' : '1');
            this.props.updateItemSettings({ radioList });
          }}
        />
        <FormGroup
          label={__('SSID')}
          type="select"
          size="min"
          options={this.props.selfState.get('ssidSelectOptions').toJS()}
          value={selectedSsid}
          disabled={store.getIn(['curData', 'radioList', radioId, 'aclEnable']) === '0'}
          onChange={data => this.props.changeSelectedSsid({
            selectedSsid: data.value,
            macListLen: store.getIn(['curData', 'radioList', radioId, 'aclConfList', data.value, 'macList']).size,
          })}
        />
        <FormGroup
          label={__('Filter Mode')}
        >
          <div
            style={{
              marginTop: '8px',
            }}
          >
            <FormInput
              name="filtermode"
              type="radio"
              text={__('Allow Only')}
              disabled={store.getIn(['curData', 'radioList', radioId, 'aclEnable']) === '0'}
              checked={store.getIn(['curData', 'radioList', radioId, 'aclConfList', selectedSsid, 'aclMode']) === 'allow'}
              onClick={() => {
                const radioList = store.getIn(['curData', 'radioList'])
                              .setIn([radioId, 'aclConfList', selectedSsid, 'aclMode'], 'allow');
                this.props.updateItemSettings({ radioList });
              }}
              style={{
                marginRight: '40px',
              }}
            />
            <FormInput
              name="filtermode"
              type="radio"
              text={__('Deny Only')}
              disabled={store.getIn(['curData', 'radioList', radioId, 'aclEnable']) === '0'}
              checked={store.getIn(['curData', 'radioList', radioId, 'aclConfList', selectedSsid, 'aclMode']) === 'deny'}
              onClick={() => {
                const radioList = store.getIn(['curData', 'radioList'])
                              .setIn([radioId, 'aclConfList', selectedSsid, 'aclMode'], 'deny');
                this.props.updateItemSettings({ radioList });
              }}
            />
          </div>
        </FormGroup>
        <FormGroup
          label={__('MAC List')}
          className="clearfix"
        >
          <div
            className="fl"
            style={{
              width: '200px',
              height: '222px',
              overflow: 'auto',
              marginRight: '20px',
              backgroundColor: '#eee',
              border: '1px solid #aaa',
              borderRadius: '5px',
              fontSize: '14px',
            }}

          >
            <MacList
              maclist={maclist}
              onMacClick={this.props.updateMacStatus}
              macStatusList={macStatus}
            />
            <div
              id="macListWrap"
              ref={(ref) => { this.macListWrap = ref; }}
            />
          </div>
          <Button
            className="fl"
            theme="primary"
            text={__('Remove')}
            disabled={store.getIn(['curData', 'radioList', radioId, 'aclEnable']) === '0'}
            onClick={this.updateAclMacList}
          />
        </FormGroup>
        <div className="clearfix">
          <FormGroup
            type="text"
            className="fl"
            form="macinput"
            disabled={store.getIn(['curData', 'radioList', radioId, 'aclEnable']) === '0'}
            value={this.props.macInput.get('macValue')}
            onChange={(data, e) => {
              const val = data.value.replace(/：/g, ':');
              this.onMacInputChange(val, e);
            }}
            {...this.props.validateOption.inputMac}
            style={{
              width: '387px',
            }}
          />
          <Button
            className="fl"
            theme="primary"
            text={__('Add')}
            disabled={store.getIn(['curData', 'radioList', radioId, 'aclEnable']) === '0'}
            onClick={this.onAddMacToLocalList}
          />
        </div>
        <FormGroup>
          <SaveButton
            theme="primary"
            text={__('Save')}
            loading={this.props.app.get('saving')}
            onClick={() => { this.onSave(); }}
          />
        </FormGroup>
      </div>
    );
  }
}

ACL.propTypes = propTypes;
ACL.defaultProps = defaultProps;

function mapStateToProps(state) {
  // console.log(state);
  const myState = state.acl;
  // console.log('myState', myState);
  return {
    app: state.app,
    store: state.settings,
    macStatus: myState.get('macstatus'),
    macInput: myState.get('macInput'),
    selectedSsid: myState.get('selectedSsid'),
    selfState: myState,
    product: state.product,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    utils.extend({}, appActions, sharedActions, actions),
    dispatch,
  );
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
  validator.mergeProps(validOptions),
)(ACL);

export const acl = reducer;
