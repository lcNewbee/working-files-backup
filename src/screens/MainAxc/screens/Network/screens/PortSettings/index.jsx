import React from 'react';
import { fromJS } from 'immutable';
import { FormInput, Button, Select } from 'shared/components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { actions as appActions } from 'shared/containers/app';
import utils from 'shared/utils';
import validator from 'shared/validator';

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
    render(val) { return val.toUpperCase(); },
  },
  {
    id: 'status',
    text: __('Status'),
    options: [
      { label: __('ON'), value: '1' },
      { label: __('OFF'), value: '0' },
    ],
    formProps: {
      type: 'checkbox',
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
      { label: '100M', value: '100m' },
      { label: '1000M', value: '1000m' },
      { label: __('Auto'), value: 'auto' },
    ],
    formProps: {
      type: 'select',
      defaultValue: 'auto',
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
    text: __('Native VLAN'),
    render: (val, item) => {
      if (item.get('exchangeMode') === 'access') return '--';
      return val;
    },
    formProps: {
      type: 'number',
      required: true,
      visible(item) {
        return item.get('exchangeMode') === 'trunk';
      },
      validator: validator({
        rules: 'num:[1, 4094]',
      }),
    },
  },
  {
    id: 'vlanId',
    text: __('VLAN Id'),
    render: (val, item) => {
      if (item.get('exchangeMode') === 'trunk') return '--';
      return val;
    },
    formProps: {
      type: 'number',
      required: true,
      visible(item) {
        return item.get('exchangeMode') === 'access';
      },
      validator: validator({
        rules: 'num:[1, 4094]',
      }),
    },
  },
  {
    id: 'vlanList',
    text: __('VLAN List'),
    render: (val, item) => {
      if (item.get('exchangeMode') === 'access') return '--';
      return val;
    },
    formProps: {
      type: 'text',
      help: `${__('Example')}: 2,5-10,15`,
      visible(item) {
        return item.get('exchangeMode') === 'trunk';
      },
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

