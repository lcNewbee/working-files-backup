import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, SaveButton } from 'shared/components/Button';
import { fromJS, Map, List } from 'immutable';
import { FormInput, FormGroup } from 'shared/components/Form';
import validator from 'shared/validator';
import { actions as sharedActions } from 'shared/containers/settings';
import { actions as appActions } from 'shared/containers/app';
import utils from 'shared/utils';
import * as actions from './actions.js';
import reducer from './reducer.js';
import MacList from './MacList.jsx';

const propTypes = {
  store: PropTypes.instanceOf(Map),
  route: PropTypes.object,
  initSettings: PropTypes.func,
  fetchSettings: PropTypes.func,
  saveSettings: PropTypes.func,
  app: PropTypes.instanceOf(Map),

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
    const macInputVal = this.props.macInput.get('macValue');
    const selectedSsid = this.props.selectedSsid;
    const preList = this.props.store.getIn(['curData', 'aclConfList', selectedSsid, 'macList']);
    let afterList;
    this.props.validateAll().then((msg) => {
      if (msg.isEmpty()) {
        if (preList.includes(macInputVal)) {
          this.props.createModal({
            id: 'settings',
            role: 'alert',
            text: '该MAC地址已经在列表中存在！',
          });
        } else {
          afterList = preList.push(macInputVal);
          const listLen = afterList.size;
          const aclConfList = this.props.store.getIn(['curData', 'aclConfList'])
                              .setIn([selectedSsid, 'macList'], afterList);
          this.props.updateItemSettings({ aclConfList });
          this.props.changePreLenInMacInput(0);
          this.props.changeMacInput('');
          this.props.initMacstatus(listLen);
        }
        }
    });
  }

  updateAclMacList() {
    const macStatusList = this.props.macStatus;
    const selectedSsid = this.props.selectedSsid;
    const macList = this.props.store.getIn(['curData', 'aclConfList', selectedSsid, 'macList']);
    let newList = fromJS([]);
    macStatusList.forEach((val, index) => {
      if (!val) {
        newList = newList.push(macList.get(index));
      }
    });
    const aclConfList = this.props.store.getIn(['curData', 'aclConfList'])
                            .setIn([selectedSsid, 'macList'], newList);
    this.props.updateItemSettings({
      aclConfList,
    });
    this.props.initMacstatus(newList.size);
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
    this.props.fetchSettings().then(() => {
      const aclConfList = this.props.store.getIn(['curData', 'aclConfList']);
      ssidSelectOptions = [];
      for (let i = 0; i < aclConfList.size; i++) {
        const optionItem = {
          value: i,
          label: aclConfList.getIn([i, 'ssid']),
        };
        ssidSelectOptions.push(optionItem);
      }
      this.props.changeSelectedSsid({
        selectedSsid: 0,
        macListLen: aclConfList.getIn([0, 'macList']).size,
      });
    });
    this.props.changeMacInput('');
  }

  render() {
    const store = this.props.store;
    const selectedSsid = this.props.selectedSsid;
    let maclist = store.getIn(['curData', 'aclConfList', selectedSsid, 'macList']);
    if (maclist === undefined) {
      return null;
    }
    maclist = maclist.toJS();
    const macStatus = this.props.macStatus.toJS();
    return (
      <div>
        <FormGroup
          label={__('Enable')}
          type="checkbox"
          checked={store.getIn(['curData', 'aclEnable']) === '1'}
          onChange={() => {
            const curState = store.getIn(['curData', 'aclEnable']);
            this.props.updateItemSettings({
              aclEnable: curState === '1' ? '0' : '1',
            });
          }}
        />
        <FormGroup
          label={__('SSID')}
          type="select"
          size="min"
          options={ssidSelectOptions}
          value={selectedSsid}
          disabled={store.getIn(['curData', 'aclEnable']) === '0'}
          onChange={(data) => this.props.changeSelectedSsid({
            selectedSsid: data.value,
            macListLen: store.getIn(['curData', 'aclConfList', data.value, 'macList']).size,
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
              disabled={store.getIn(['curData', 'aclEnable']) === '0'}
              checked={store.getIn(['curData', 'aclConfList', selectedSsid, 'aclMode']) === 'allow'}
              onClick={() => {
                const aclConfList = store.getIn(['curData', 'aclConfList'])
                                        .setIn([selectedSsid, 'aclMode'], 'allow');
                this.props.updateItemSettings({
                  aclConfList,
                });
              }}
              style={{
                marginRight: '40px',
              }}
            />
            <FormInput
              name="filtermode"
              type="radio"
              text={__('Block Only')}
              disabled={store.getIn(['curData', 'aclEnable']) === '0'}
              checked={store.getIn(['curData', 'aclConfList', selectedSsid, 'aclMode']) === 'deny'}
              onClick={() => {
                const aclConfList = store.getIn(['curData', 'aclConfList'])
                                        .setIn([selectedSsid, 'aclMode'], 'deny');
                this.props.updateItemSettings({
                  aclConfList,
                });
              }}
            />
          </div>
        </FormGroup>
        <FormGroup
          label={__('Station List')}
          className="clearfix"
        >
          <div
            className="fl"
            style={{
              width: '200px',
              height: '222px',
              border: '1px solid #ccc',
              overflow: 'auto',
              marginRight: '20px',

            }}
          >
            <MacList
              maclist={maclist}
              onMacClick={this.props.updateMacStatus}
              macStatusList={macStatus}

            />
          </div>
          <Button
            className="fl"
            theme="primary"
            text={__('Remove')}
            disabled={store.getIn(['curData', 'aclEnable']) === '0'}
            onClick={this.updateAclMacList}
          />
        </FormGroup>
        <div className="clearfix">
          <FormGroup
            type="text"
            className="fl"
            form="macinput"
            disabled={store.getIn(['curData', 'aclEnable']) === '0'}
            value={this.props.macInput.get('macValue')}
            onChange={(data, e) => this.onMacInputChange(data.value, e)}
            {...this.props.validateOption.inputMac}
          />
          <Button
            className="fl"
            theme="primary"
            text={__('Add')}
            disabled={store.getIn(['curData', 'aclEnable']) === '0'}
            onClick={this.onAddMacToLocalList}
            style={{
              marginTop: '2px',
              marginLeft: '20px',
            }}
          />
        </div>
        <FormGroup>
          <SaveButton
            theme="primary"
            text={__('Save')}
            loading={this.props.app.get('saving')}
            onClick={() => this.props.saveSettings('goform/set_acl')}
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
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    utils.extend({}, appActions, sharedActions, actions),
    dispatch
  );
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
  validator.mergeProps(validOptions)
)(ACL);

export const acl = reducer;
