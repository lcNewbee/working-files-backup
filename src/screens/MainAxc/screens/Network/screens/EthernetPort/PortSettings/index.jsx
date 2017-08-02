import React from 'react';
import { fromJS } from 'immutable';
import { FormInput, Button, Select } from 'shared/components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { actions as appActions } from 'shared/containers/app';
import utils from 'shared/utils';

const exchangeOptions = [
  { label: 'Access', value: 'access' },
  { label: 'Trunk', value: 'trunk' },
];

const listOptions = fromJS([
  {
    id: 'name',
    text: __('Name'),
    type: 'text',
    notEditable: true,
  },
  {
    id: 'status',
    text: __('Status'),
    formProps: {
      type: 'checkbox',
      options: [
        { label: __('ON'), value: '1' },
        { label: __('OFF'), value: '0' },
      ],
    },
  },
  {
    id: 'exchangeMode',
    text: __('Exchange Mode'),
    type: 'select',
    options: exchangeOptions,
    formProps: {
      type: 'select',
    },
  },
  {
    id: 'rate',
    text: __('Rate'),
    type: 'select',
    options: [
      { label: '1G', value: '1g' },
      { label: '10G', value: '10g' },
      { label: __('Auto'), value: 'auto' },
    ],
    formProps: {
      type: 'select',
    },
  },
  {
    id: 'workMode',
    text: __('Working Mode'),
    type: 'select',
    options: [
      { label: __('Simplex'), value: 'simplex' },
      { label: __('Duplex'), value: 'duplex' },
      { label: __('Auto'), value: 'auto' },
    ],
    formProps: {
      type: 'select',
    },
  },
  {
    id: 'nativeVlan',
    text: __('(Native)VLAN'),
    formProps: {
      type: 'number',
    },
  },
  {
    id: 'vlanList',
    text: __('VLAN List'),
    formProps: {
      type: 'text',
    },
  },
  {
    id: 'description',
    text: __('Description'),
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
        actionable
        deleteable={false}
        editable
        addable={false}
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

