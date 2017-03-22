import React from 'react';
import { fromJS } from 'immutable';
import { AppScreen, FormInput } from 'shared/components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import utils from 'shared/utils';
import * as appActions from 'shared/actions/app';
import * as screenActions from 'shared/actions/screens';

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

export default class View extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');
    const curListItem = store.getIn([curScreenId, 'curListItem']);
    const listOptions = fromJS([
      {
        id: 'id',
        type: 'text',
        text: __('Rule ID'),
        formProps: {
          noAdd: true,
        },
        notEditable: true,
      },
      {
        id: 'ruleName',
        text: __('Rule Name'),
        type: 'text',
      },
      {
        id: 'action',
        text: __('Action'),
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
        id: 'ipType',
        type: 'select',
        text: __('IP Type'),
        options: [
          { label: 'IPV4', value: 'ipv4' },
          { label: 'IPV6', value: 'ipv6' },
        ],
        formProps: {
          type: 'select',
        },
      },
      {
        id: 'protoType',
        type: 'select',
        text: __('Protocol'),
        options: protoTypeOptions,
        formProps: {
          type: 'select',
        },
      },
      {
        id: 'flowDirection',
        text: __('Flow Direction'),
        formProps: {
          type: 'select',
          options: flowDirectionOptions,
        },
      },
      {
        id: 'srcIp',
        text: __('Source IP'),
        formProps: {
          type: 'text',
        },
      },
      {
        id: 'srcIpMask',
        text: __('Source IP Mask'),
        formProps: {
          type: 'text',
        },
      },
      {
        id: 'destIp',
        text: __('Destination IP'),
        formProps: {
          type: 'text',
        },
      },
      {
        id: 'destIpMask',
        text: __('Destination IP Mask'),
        formProps: {
          type: 'text',
        },
      },
      {
        id: 'srcPortRange',
        text: __('Source Port'),
        transform: (val, item) => {
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
        text: __('Destination Port'),
        transform: (val, item) => {
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
        listOptions={listOptions}
        addable
        deleteable
        actionable
        editable
        selectable
      />
    );
  }
}

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
