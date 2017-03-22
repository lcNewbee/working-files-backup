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

const natTypeOptions = [
  { label: __('Static IP Transform'), value: 'static' },
  { label: __('Source IP Transform'), value: 'src' },
  { label: __('Destination IP Transform'), value: 'dest' },
  { label: __('Src/Dest IP Transform'), value: 'src_dest' },
  { label: __('Public IP Passthrough'), value: 'public' },
];

function getListOptionsByNatType(fullOptions, natType) {
  let ret = fromJS([]);
  ret = fullOptions.map((item) => {
    const filter = item.get('filter');
    if (filter === 'all' || filter === natType) {
      return item;
    }
    return fromJS({});
  }).filter(item => !item.isEmpty());

  return ret;
}

export default class View extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      natType: 'src',
    };

    this.changeNatTypeInModal = this.changeNatTypeInModal.bind(this);
  }





  changeNatTypeInModal(natType) {
    this.setState({
      natType,
    });
    this.props.updateCurEditListItem({ natType });
  }

  render() {
    const fullSettingsOptions = fromJS([
      {
        id: 'id',
        filter: 'all',
        type: 'text',
        text: __('ID'),
        notEditable: true,
        formProps: {
          noAdd: true,
        },
      },
      {
        id: 'natType',
        text: __('NAT Type'),
        options: natTypeOptions,
        type: 'select',
        filter: 'all',
        formProps: {
          type: 'select',
          onChange: data => this.changeNatTypeInModal(data.value),
        },
      },
      { // 静态地址转换时可配
        id: 'externalIp',
        filter: 'static',
        text: __('External IP'),
        formProps: {
          type: 'text',
        },
      },
      { // 静态地址转换时可配
        id: 'internalIp',
        filter: 'static',
        text: __('Internal IP'),
        formProps: {
          type: 'text',
        },
      },
      { // 静态地址转换时可配
        id: 'interface',
        filter: 'static',
        text: __('Interface'),
        formProps: {
          type: 'select',
          options: portIdOptions,
        },
      },
      { // 源地址/目的地址转换时可配
        id: 'srcIp',
        filter: 'src_dest',
        text: __('Source IP'),
        formProps: {
          type: 'text',
        },
      },
      { // 源地址/目的地址转换时可配
        id: 'destIp',
        filter: 'src_dest',
        text: __('Destination IP'),
        formProps: {
          type: 'text',
        },
      },
      { // 源地址/目的地址转换时可配
        id: 'serve',
        filter: 'src_dest',
        text: __('Serve'),
        formProps: {
          type: 'select',
        },
      },
      { // 源地址转换时可配
        id: 'exitPort',
        filter: 'src',
        text: __('Exit Port'),
        formProps: {
          type: 'select',
          options: portIdOptions,
        },
      },
      { // 目的地址转换时可配
        id: 'entryPort',
        filter: 'dest',
        text: __('Entry Port'),
        formProps: {
          type: 'select',
          options: portIdOptions,
        },
      },
      { // 源地址转换时可配
        id: 'transferedScr',
        filter: 'src',
        text: __('Transferd Source IP '),
        formProps: {
          type: 'select',
        },
      },
      { // 目的地址转换时可配
        id: 'transferedDest',
        filter: 'dest',
        text: __('Transfered Destination IP'),
        formProps: {
          type: 'select',
        },
      },
      {
        id: 'logEnable',
        text: __('Log Enable'),
        options: [
          { label: __('ON'), value: '1' },
          { label: __('OFF'), value: '0' },
        ],
        filter: 'all',
        formProps: {
          type: 'checkbox',
        },
      },
      {
        id: 'description',
        filter: 'all',
        text: __('Description'),
        formProps: {
          type: 'textarea',
        },
      },
    ]);
    const listOptions = getListOptionsByNatType(fullSettingsOptions, this.state.natType);
    return (
      <AppScreen
        {...this.props}
        listOptions={listOptions}
        addable
        deleteable
        actionable
        editable
        selectable
      >
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '190px',
          }}
        >
          <span
            style={{
              fontWeight: 'bold',
              marginRight: '10px',
            }}
          >
            {__('NAT Type')}
          </span>
          <FormInput
            type="select"
            value={this.state.natType}
            options={natTypeOptions}
            onChange={(data) => {
              this.setState({ natType: data.value });
              Promise.resolve().then(() => {
                this.props.changeScreenQuery({ natType: data.value });
              }).then(() => {
                this.props.fetchScreenData();
              });
            }}
          />

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
