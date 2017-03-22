import React from 'react';
import { fromJS } from 'immutable';
import { AppScreen } from 'shared/components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import utils from 'shared/utils';
import * as appActions from 'shared/actions/app';
import * as screenActions from 'shared/actions/screens';

const portIdOptions = [
  { label: 'GE0/0', value: '0' },
  { label: 'GE0/1', value: '1' },
  { label: 'GE0/2', value: '2' },
  { label: 'GE0/3', value: '3' },
  { label: 'GE0/4', value: '4' },
  { label: 'GE0/5', value: '5' },
  { label: 'GE0/6', value: '6' },
  { label: 'GE0/7', value: '7' },
  { label: 'GE0/8', value: '8' },
  { label: 'GE0/9', value: '9' },
  { label: 'GE0/10', value: '10' },
  { label: 'GE0/11', value: '11' },
  { label: 'GE0/12', value: '12' },
  { label: 'GE0/13', value: '13' },
];

const ipTypeOptions = [
  { label: 'IPV4', value: 'ipv4' },
  { label: 'IPV6', value: 'ipv6' },
];

const listOptions = fromJS([
  {
    id: 'id',
    type: 'text',
    text: __('ID'),
    notEditable: true,
    formProps: {
      noAdd: true,
    },
  },
  {
    id: 'ipType',
    text: __('IP Type'),
    type: 'select',
    options: ipTypeOptions,
    formProps: {
      type: 'select',
      options: ipTypeOptions,
    },
  },
  {
    id: 'destIP',
    text: __('Destination IP'),
    formProps: {
      type: 'text',
    },
  },
  {
    id: 'destMask',
    text: __('Destination Mask'),
    formProps: {
      type: 'text',
    },
  },
  {
    id: 'nextHopIp',
    text: __('Next Hop IP'),
    formProps: {
      type: 'text',
    },
  },
  {
    id: 'interface',
    type: 'select',
    text: __('Interface'),
    options: portIdOptions,
    formProps: {
      type: 'select',
      options: portIdOptions,
    },
  },
]);

export default class View extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <AppScreen
        {...this.props}
        listOptions={listOptions}
        actionable
        deleteable
        addable
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
