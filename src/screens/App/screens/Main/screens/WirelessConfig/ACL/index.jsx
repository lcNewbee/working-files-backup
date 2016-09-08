import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button } from 'shared/components/Button';
import { fromJS, Map, List } from 'immutable';
import { FormInput, FormGroup } from 'shared/components/Form';
import validator from 'shared/utils/lib/validator';
import * as sharedActions from 'shared/actions/settings';
import * as appActions from 'shared/actions/app';
import utils from 'shared/utils';
import * as actions from './actions.js';
import reducer from './reducer.js';
import MacList from './MacList.jsx';

const propTypes = {
  store: PropTypes.instanceOf(Map),
  route: PropTypes.object,
  initSettings: PropTypes.func,
  fetchSettings: PropTypes.func,

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
};
const macValidator = validator({
  rules: 'mac',
});

const defaultProps = fromJS({
  maclist: [
  ],
  macstatus: [
  ],
});

export default class ACL extends React.Component {

  constructor(props) {
    super(props);
    // this.showListToPage = this.showListToPage.bind(this);
    // this.getMacStatusValue = this.getMacStatusValue.bind(this);
    this.updateAclMacList = this.updateAclMacList.bind(this);
    this.onMacInputChange = this.onMacInputChange.bind(this);
    this.onAddMacToLocalList = this.onAddMacToLocalList.bind(this);
  }

  componentWillMount() {
    this.props.initSettings({
      settingId: this.props.route.id,
      fetchUrl: this.props.route.fetchUrl,
      defaultData: {
        maclist: [
        ],
      },
    });
    this.props.fetchSettings()
        .then(() => {
          const maclist = this.props.store.getIn(['curData', 'maclist']);
          if (maclist !== undefined) {
            console.log('len2', maclist.toJS().length);
            this.props.initMacstatus(maclist.size);
          }
        });
    this.props.changeMacInput('');
  }

  onMacInputChange(value) {
    // 还可以再智能一些，处理在用户复制字符串到输入框时，只截取合法部分，舍去多余部分（正则）
    let val = value;
    const lastChar = value.charAt(value.length - 1);
    const preLen = this.props.macInput.get('preLen');
    const afterLen = val.length;
    console.log(preLen, afterLen);
    if (preLen < afterLen) { // 添加
      if (lastChar.match(/[0-9a-fA-F]/) !== null) {
        console.log('match', value.charAt(value.length - 1).match(/[0-9a-fA-F]/));
        // console.log('value', value);
        const macArr = val.split(':');
        const len = macArr.length;
        // console.log('macArr', macArr);
        if (macArr[len - 1].length <= 2) {
          console.log(preLen, afterLen);
          if (macArr[len - 1].length === 2 && len < 6) {
            val += ':';
          }
        } else { // 删除超过MAC地址长度限制的字符，不在输入框显示
          val = val.slice(0, -1);
        }
        this.props.changePreLenInMacInput(val.length);
        this.props.changeMacInput(val);
      } else if (lastChar.match(/[:]/) !== null) {
        val = value.slice(0, -1);
        this.props.changePreLenInMacInput(val.length);
        this.props.changeMacInput(val);
      }
    } else if (preLen >= afterLen) { // 删除
      if (val.slice(val.length - 1) === ':') {
        val = val.slice(0, -1);
        this.props.changePreLenInMacInput(val.length);
        this.props.changeMacInput(val);
      } else {
        const length = (val.length === 1) ? 0 : val.length;
        this.props.changePreLenInMacInput(length);
        this.props.changeMacInput(val);
      }
    }
  }

  onAddMacToLocalList() {
    const macInputVal = this.props.macInput.get('macValue');
    const str = macValidator.check(macInputVal);
    const preList = this.props.store.getIn(['curData', 'maclist']);
    let afterList;
    if (preList.includes(macInputVal)) {
      window.alert('该MAC地址已经在列表中存在！');
    } else {
      afterList = preList.push(macInputVal);
      const listLen = afterList.size;
      if (str === undefined) {
        this.props.updateItemSettings({
          maclist: afterList,
        });
        this.props.changePreLenInMacInput(0);
        this.props.changeMacInput('');
        this.props.initMacstatus(listLen);
      } else {
        window.alert(str);
      }
    }
  }

  updateAclMacList() {
    const macStatusList = this.props.macStatus;
    const macList = this.props.store.getIn(['curData', 'maclist']);
    let newList = fromJS([]);
    // let i = 0;
    macStatusList.forEach((val, index) => {
      if (!val) {
        newList = newList.push(macList.get(index));
      }
    });
    this.props.updateItemSettings({
      maclist: newList,
    });
    this.props.initMacstatus(newList.size);
  }

  render() {
    const store = this.props.store;
    const maclist = store.getIn(['curData', 'maclist']);
    if (maclist === undefined) {
      return null;
    }
    const macStatus = this.props.macStatus.toJS();
    return (
      <div>
        <FormGroup
          label={_('Filter Mode')}
        >
          <FormInput
            name="filtermode"
            type="radio"
            text="Allow only stations in list"
          />
          <FormInput
            name="filtermode"
            type="radio"
            text="Block all stations in list"
          />
        </FormGroup>
        <FormGroup
          label={_('Station List')}
          className="clearfix"
        >
          <div
            className="fl"
            style={{
              width: '318px',
              height: '222px',
              border: '1px solid #000',
              overflow: 'auto',
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
            text={_('Remove')}
            onClick={this.updateAclMacList}
          />
        </FormGroup>
        <div className="clearfix">
          <FormGroup
            type="text"
            className="fl"
            value={this.props.macInput.get('macValue')}
            onChange={(data, e) => this.onMacInputChange(data.value, e)}
          />
          <Button
            className="fl"
            theme="primary"
            text={_('Add')}
            onClick={this.onAddMacToLocalList}
          />
        </div>
        <FormGroup>
          <Button
            theme="primary"
            text={_('Save')}
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
  console.log('myState', myState);
  return {
    app: state.app,
    store: state.settings,
    macStatus: myState.get('macstatus'),
    macInput: myState.get('macInput'),
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
  mapDispatchToProps
)(ACL);

export const acl = reducer;
