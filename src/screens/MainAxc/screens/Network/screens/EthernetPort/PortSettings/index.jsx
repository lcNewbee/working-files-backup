import React from 'react';
import { fromJS } from 'immutable';
import { AppScreen, FormInput, Button, Select } from 'shared/components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { actions as appActions } from 'shared/containers/app';
import utils from 'shared/utils';

const exchangeOptions = [
  { label: 'access', value: 'access' },
  { label: 'trunk', value: 'trunk' },
  { label: 'QINQ(tunnel)', value: 'QINQ(tunnel)' },
  { label: 'QINQ(uplink)', value: 'QINQ(uplink)' },
];

const listOptions = fromJS([
  {
    id: 'name',
    text: __('Name'),
    type: 'text',
    notEditable: true,
  },
  {
    id: 'exchangeMode',
    text: __('Exchange Mode'),
    formProps: {
      type: 'select',
      options: exchangeOptions,
    },
  },
  {
    id: 'status',
    text: __('Status'),
    formProps: {
      options: [
        { label: __('ON'), value: '1' },
        { label: __('OFF'), value: '0' },
      ],
      type: 'select',
    },
  },
  {
    id: 'rate',
    text: __('Rate'),
    formProps: {
      options: [
        { label: '1G', value: '1g' },
        { label: '10G', value: '10g' },
        { label: __('Auto'), value: 'auto' },
      ],
      type: 'select',
    },
  },
  {
    id: 'workMode',
    text: __('Working Mode'),
    formProps: {
      options: [
        { label: __('Simplex'), value: 'simplex' },
        { label: __('Duplex'), value: 'duplex' },
        { label: __('Auto'), value: 'auto' },
      ],
      type: 'select',
    },
  },
  {
    id: 'maxPacket',
    text: __('Max Transfer Packet'),
    formProps: {
      type: 'number',
    },
  },
  {
    id: 'nativeVlan',
    text: __('Native VLAN'),
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

const customActionButton = [
  {
    actionName: 'reset',
    text: __('Reset'),
    icon: 'reply-all',
  },
];

const slotIdOptions = [
  { label: __('ALL'), value: 'all' },
];

const portTypeOptions = [
  { label: __('ALL'), value: 'all' },
];

export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.onClearSearchCondition = this.onClearSearchCondition.bind(this);
  }

  onClearSearchCondition() {
    const search = fromJS({
      slotId: 'all',
      portId: '',
      portType: 'all',
    });
    Promise.resolve().then(() => {
      this.props.changeScreenQuery(search);
    }).then(() => {
      this.props.fetchScreenData();
    });
  }

  render() {
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');
    return (
      <AppScreen
        {...this.props}
        listOptions={listOptions}
        actionable
        deleteable={false}
        selectable
        editable
        addable={false}
        actionBarButtons={customActionButton}
      >
        <div
          className="clearfix"
          style={{
            position: 'absolute',
            top: '0',
            right: '0',
          }}
        >
          <div className="fl">
            <label
              htmlFor="slotid"
              style={{
                marginTop: '7px',
                marginRight: '10px',
                fontWeight: 'bold',
              }}
            >
              {__('Slot Id')}
            </label>
            <Select
              id="slotid"
              onChange={data => this.props.changeScreenQuery({ slotId: data.value })}
              options={slotIdOptions}
              value={store.getIn([curScreenId, 'query', 'slotId'])}
              searchable={false}
              clearable={false}
            />
          </div>
          <div className="fl">
            <label
              htmlFor="porttype"
              style={{
                marginTop: '7px',
                marginRight: '10px',
                fontWeight: 'bold',
              }}
            >
              {__('Port Type')}
            </label>
            <Select
              id="porttype"
              onChange={data => this.props.changeScreenQuery({ portType: data.value })}
              value={store.getIn([curScreenId, 'query', 'portType'])}
              options={portTypeOptions}
              searchable={false}
              clearable={false}
            />
          </div>
          <div className="fl">
            <label
              htmlFor="portid"
              style={{
                marginTop: '7px',
                marginRight: '10px',
                fontWeight: 'bold',
              }}
            >
              {__('Port Id')}
            </label>
            <FormInput
              id="portid"
              type="text"
              value={store.getIn([curScreenId, 'query', 'portId'])}
              onChange={data => this.props.changeScreenQuery({ portId: data.value })}
            />
          </div>
          <div className="fl">
            <Button
              text={__('Search')}
              onClick={() => this.props.fetchScreenData()}
            />
            <Button
              text={__('Clear')}
              onClick={this.onClearSearchCondition}
            />
          </div>
        </div>
      </AppScreen>
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
