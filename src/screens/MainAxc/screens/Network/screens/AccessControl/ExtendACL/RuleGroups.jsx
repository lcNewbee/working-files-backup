import React from 'react';
import PropTypes from 'prop-types';
import { fromJS, Map } from 'immutable';
import { Button, Icon, FormInput } from 'shared/components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import utils from 'shared/utils';
import { actions as appActions } from 'shared/containers/app';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import SlideViewer from './SlideViewer';
import Exchange from './Exchange';
import './style.scss';

const protoTypeOptions = [
  { label: 'any', value: 'any' },
  { label: 'icmp', value: 'icmp' },
  { label: 'tcp', value: 'tcp' },
  { label: 'udp', value: 'udp' },
  { label: 'icmpv6', value: 'icmpv6' },
];

const flowDirectionOptions = [
  { label: 'IN', value: 'in' },
  { label: 'OUT', value: 'out' },
  { label: 'FORWARD', value: 'forward' },
];

const propTypes = {
  store: PropTypes.instanceOf(Map),
  save: PropTypes.func,
  fetchScreenData: PropTypes.func,
  route: PropTypes.object,
};

const defaultProps = {
};

function getLeftBoxList(ruleNameListInGroup, allRules) {
  if (typeof allRules === 'undefined') return fromJS([]);
  const ruleDetailListInGroup = allRules.filter((item) => {
    const name = item.get('ruleName');
    if (ruleNameListInGroup.includes(name)) return true;
    return false;
  });
  return ruleDetailListInGroup;
}

function getRightBoxList(ruleNameListInGroup, allRules) {
  if (typeof allRules === 'undefined') return fromJS([]);
  const ruleDetailListNotInGroup = allRules.filter((item) => {
    const name = item.get('ruleName');
    if (!ruleNameListInGroup.includes(name)) return true;
    return false;
  });
  return ruleDetailListNotInGroup;
}


export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.groupOnEdit = '';
    this.state = {
      leftboxlist: fromJS([]),
      rightboxlist: fromJS([]),
    };

    utils.binds(this, [
      'onSlideBtnClick', 'saveGroupRulesChange',
    ]);
  }

  componentWillReceiveProps(newProps) {
    const curScreenId = newProps.store.get('curScreenId');
    const allRules = newProps.store.getIn([curScreenId, 'data', 'rulesList']);
    const allGroups = newProps.store.getIn([curScreenId, 'data', 'groupList']);
    // if there is no group has the same name as this.groupOnEdit, set this.groupOnEdit value to first group name.


    let ruleNameListInGroup = '';
    // 这里要修改，改成显示当前组的列表
    if (this.groupOnEdit === '') {
      // first time come into this page, this.groupOnEdit has no value, give the first group as default.
      ruleNameListInGroup = newProps.store.getIn([curScreenId, 'data', 'groupList', '0', 'ruleNameList']);
    } else {
      // this.groupOnEdit has value already

    }

    const ruleDetailListInFirstGroup = getLeftBoxList(ruleNameListInGroup, allRules);
    const ruleDetailListNotInFirstGroup = getRightBoxList(ruleNameListInGroup, allRules);
    this.setState({
      leftboxlist: ruleDetailListInFirstGroup,
      rightboxlist: ruleDetailListNotInFirstGroup,
    });
  }

  onSlideBtnClick(item) {
    const curScreenId = this.props.store.get('curScreenId');
    const allRules = this.props.store.getIn([curScreenId, 'data', 'rulesList']);
    const ruleNameListInGroup = item.get('ruleNameList');
    const ruleDetailListInGroup = getLeftBoxList(ruleNameListInGroup, allRules);
    const ruleDetailListNotInGroup = getRightBoxList(ruleNameListInGroup, allRules);
    this.setState({
      leftboxlist: ruleDetailListInGroup,
      rightboxlist: ruleDetailListNotInGroup,
    });
  }

  onLeftListDoubleClick(item) {
    const curScreenId = this.props.store.get('curScreenId');
    const data = this.props.store.getIn([curScreenId, 'data']);
    const groupList = data.get('groupList');
    const groupOnEditIndex = groupList.findIndex(groupItem => groupItem.get('groupName') === this.groupOnEdit);
    const ruleNameListOnEdit = groupList.getIn([groupOnEditIndex, 'ruleNameList']);
    const newRuleNameList = ruleNameListOnEdit.filter(name => name !== item.get('ruleName'));
    const newData = data.setIn(['groupList', groupOnEditIndex, 'ruleNameList'], newRuleNameList);
    this.saveGroupRulesChange(newData);
  }

  onRightListDoubleClick(item) {
    const curScreenId = this.props.store.get('curScreenId');
    const data = this.props.store.getIn([curScreenId, 'data']);
    const groupList = data.get('groupList');
    const groupOnEditIndex = groupList.findIndex(groupItem => groupItem.get('groupName') === this.groupOnEdit);
    const ruleNameListOnEdit = groupList.getIn([groupOnEditIndex, 'ruleNameList']);
    const newRuleNameList = ruleNameListOnEdit.push(item.get('ruleName'));
    const newData = data.setIn(['groupList', groupOnEditIndex, 'ruleNameList'], newRuleNameList);
    this.saveGroupRulesChange(newData);
  }

  saveGroupRulesChange(data) {
    this.props.save(this.props.route.saveUrl, data.toJS()).then((json) => {
      if (json.state && json.state.code === 2000) {
        this.props.fetchScreenData();
      }
    });
  }

  render() {
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');
    const curListItem = store.getIn([curScreenId, 'curListItem']);
    const listOptions = fromJS([
      {
        id: 'id',
        type: 'text',
        label: __('Rule ID'),
        formProps: {
          noAdd: true,
        },
        notEditable: true,
        showInBox: true,
      },
      {
        id: 'ruleName',
        label: __('Rule Name'),
        type: 'text',
        showInBox: true,
      },
      {
        id: 'action',
        label: __('Action'),
        type: 'select',
        options: [
          { label: __('Accept'), value: 'accept' },
          { label: __('Reject'), value: 'reject' },
          { label: __('Redirect'), value: 'redirect' },
        ],
        formProps: {
          type: 'select',
        },
      },
      {
        id: 'protoType',
        type: 'select',
        label: __('Protocol'),
        options: protoTypeOptions,
        formProps: {
          type: 'select',
        },
      },
      {
        id: 'flowDirection',
        label: __('Flow Direction'),
        formProps: {
          type: 'select',
          options: flowDirectionOptions,
        },
      },
      {
        id: 'srcIp',
        label: __('Source IP'),
        formProps: {
          type: 'text',
        },
      },
      {
        id: 'srcIpMask',
        label: __('Source IP Mask'),
        formProps: {
          type: 'text',
        },
      },
      {
        id: 'destIp',
        label: __('Destination IP'),
        formProps: {
          type: 'text',
        },
      },
      {
        id: 'destIpMask',
        label: __('Destination IP Mask'),
        formProps: {
          type: 'text',
        },
      },
      {
        id: 'srcPortRange',
        label: __('Source Port'),
        render: (val, item) => {
          const srcStartPort = item.get('srcStartPort');
          const srcEndPort = item.get('srcEndPort');
          return `${srcStartPort} - ${srcEndPort}`;
        },
        formProps: {
          children: [
            <FormInput
              type="number"
              className="fl"
              style={{ width: '93px' }}
              value={curListItem.get('srcStartPort')}
            />,
            <span
              className="fl"
              style={{ marginTop: '5px' }}
            >
              {'-- '}
            </span>,
            <FormInput
              type="number"
              className="fl"
              style={{ width: '93px' }}
              value={curListItem.get('srcEndPort')}
            />,
          ],
        },
      },
      {
        id: 'destPortRange',
        label: __('Destination Port'),
        render: (val, item) => {
          const destStartPort = item.get('srcStartPort');
          const destEndPort = item.get('srcEndPort');
          return `${destStartPort} - ${destEndPort}`;
        },
        formProps: {
          children: [
            <FormInput
              type="number"
              className="fl"
              style={{ width: '93px' }}
              value={curListItem.get('destStartPort')}
            />,
            <span
              className="fl"
              style={{ marginTop: '5px' }}
            >
              {'-- '}
            </span>,
            <FormInput
              type="number"
              className="fl"
              style={{ width: '93px' }}
              value={curListItem.get('destEndPort')}
            />,
          ],
        },
      },
    ]);

    return (
      <AppScreen
        {...this.props}
      >
        <SlideViewer
          slidedirection="horizontal"
          slidekey="groupName"
          contentwidth="150"
          slidelist={this.props.store.getIn([curScreenId, 'data', 'groupList'])}
          onSlideBtnClick={(item) => {
            this.groupOnEdit = item.get('groupName');
            this.onSlideBtnClick(item);
          }}
        />
        <Exchange
          leftboxtitle="Left Box"
          rightboxtitle="Right Box"
          rightaddbutton
          listOptions={listOptions}
          onEditModalOk={(list) => { console.log(list.toJS()); }}
          onAddModalOk={(list) => { console.log(list.toJS()); }}
          onDeleteBtnClick={(list) => { console.log(list.toJS()); }}
          onRightListDoubleClick={(list) => { this.onRightListDoubleClick(list); }}
          onLeftListDoubleClick={(list) => { this.onLeftListDoubleClick(list); }}
          leftboxlist={this.state.leftboxlist}
          rightboxlist={this.state.rightboxlist}
        />
      </AppScreen>
    );
  }
}

View.propTypes = propTypes;
View.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    store: state.screens,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    screenActions,
  ), dispatch);
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(View);
