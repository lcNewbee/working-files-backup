import React from 'react';
import { fromJS } from 'immutable';
import { AppScreen, FormInput, Button, Select } from 'shared/components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';
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
    text: _('Name'),
    type: 'text',
    notEditable: true,
  },
  {
    id: 'exchangeMode',
    text: _('Exchange Mode'),
    formProps: {
      type: 'select',
      options: exchangeOptions,
    },
  },
  {
    id: 'status',
    text: _('Status'),
    formProps: {
      options: [
        { label: _('ON'), value: '1' },
        { label: _('OFF'), value: '0' },
      ],
      type: 'select',
    },
  },
  {
    id: 'rate',
    text: _('Rate'),
    formProps: {
      options: [
        { label: '1G', value: '1g' },
        { label: '10G', value: '10g' },
        { label: _('Auto'), value: 'auto' },
      ],
      type: 'select',
    },
  },
  {
    id: 'workMode',
    text: _('Working Mode'),
    formProps: {
      options: [
        { label: _('Simplex'), value: 'simplex' },
        { label: _('Duplex'), value: 'duplex' },
        { label: _('Auto'), value: 'auto' },
      ],
      type: 'select',
    },
  },
  {
    id: 'maxPacket',
    text: _('Max Transfer Packet'),
    formProps: {
      type: 'number',
    },
  },
  {
    id: 'nativeVlan',
    text: _('Native VLAN'),
    formProps: {
      type: 'number',
    },
  },
  {
    id: 'vlanList',
    text: _('VLAN List'),
    formProps: {
      type: 'text',
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

const customActionButton = [
  {
    actionName: 'reset',
    text: _('Reset'),
    icon: 'reply-all',
  },
];

const cardIdOptions = [
  { label: _('ALL'), value: 'all' },
];

const portTypeOptions = [
  { label: _('ALL'), value: 'all' },
];

const portIdOptions = [
  { label: _('ALL'), value: 'all' },
];

export default class View extends React.Component {
  constructor(props) {
    super(props);
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
              htmlFor="cardid"
              style={{
                marginTop: '7px',
                marginRight: '10px',
                fontWeight: 'bold',
              }}
            >
              {_('Card Id')}
            </label>
            <Select
              // value={query.get('size')}
              id="cardid"
              onChange={this.onChangeTableSize}
              options={cardIdOptions}
              searchable={false}
              clearable={false}
            />
          </div>
          <div className="fl">
            <label
              htmlFor="cardtype"
              style={{
                marginTop: '7px',
                marginRight: '10px',
                fontWeight: 'bold',
              }}
            >
              {_('Port Type')}
            </label>
            <Select
              // value={query.get('size')}
              id="cardtype"
              onChange={this.onChangeTableSize}
              options={portTypeOptions}
              searchable={false}
              clearable={false}
            />
          </div>
          <div className="fl">
            <label
              htmlFor="cardtype"
              style={{
                marginTop: '7px',
                marginRight: '10px',
                fontWeight: 'bold',
              }}
            >
              {_('Port Id')}
            </label>
            <Select
              // value={query.get('size')}
              id="cardtype"
              // onChange={this.onChangeTableSize}
              options={portTypeOptions}
              searchable={false}
              clearable={false}
            />
          </div>
          <div className="fl">
            <Button
              text={_('Search')}
            />
            <Button
              text={_('Clear')}
              // onClick={this.onClearSearchCondition}
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
