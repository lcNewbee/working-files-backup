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

const slotIdOptions = [
  { label: 'slot_0', value: '0' },
  { label: 'slot_1', value: '1' },
  { label: 'slot_2', value: '2' },
  { label: 'slot_3', value: '3' },
];

const balanceAlgthmOptions = [
  { label: _('Source MAC'), value: 'srcmac' },
  { label: _('Destiation MAc'), value: 'desmac' },
  { label: _('Source & Destination MAC'), value: 'mac' },
  { label: _('Source IP'), value: 'srcip' },
  { label: _('Destination IP'), value: 'desmac' },
  { label: _('Source & Destination IP'), value: 'ip' },
];

const listOptions = fromJS([
  {
    id: 'id',
    type: 'text',
    text: _('Group ID'),
    formProps: {
      noAdd: true,
    },
    notEditable: true,
  },
  {
    id: 'groupName',
    text: _('Group Name'),
    type: 'text',
  },
  {
    id: 'defaultAction',
    text: _('Default Action'),
    type: 'select',
    options: [
      { label: _('Accept'), value: 'accept' },
      { label: _('Reject'), value: 'reject' },
      { label: _('Redirect'), value: 'redirect' },
    ],
    formProps: {
      type: 'select',
    },
  },
  {
    id: 'description',
    text: _('Description'),
    formProps: {
      type: 'textarea',
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
