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
  { label: _('Static IP Transform'), value: 'static' },
  { label: _('Source IP Transform'), value: 'src' },
  { label: _('Destination IP Transform'), value: 'dest' },
  { label: _('Src/Dest IP Transform'), value: 'src_dest' },
  { label: _('Public IP Passthrough'), value: 'public' },
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
        text: _('ID'),
        notEditable: true,
        formProps: {
          noAdd: true,
        },
      },
      {
        id: 'natType',
        text: _('NAT Type'),
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
        text: _('External IP'),
        formProps: {
          type: 'text',
        },
      },
      { // 静态地址转换时可配
        id: 'internalIp',
        filter: 'static',
        text: _('Internal IP'),
        formProps: {
          type: 'text',
        },
      },
      { // 静态地址转换时可配
        id: 'interface',
        filter: 'static',
        text: _('Interface'),
        formProps: {
          type: 'select',
          options: portIdOptions,
        },
      },
      { // 源地址/目的地址转换时可配
        id: 'srcIp',
        filter: 'src_dest',
        text: _('Source IP'),
        formProps: {
          type: 'text',
        },
      },
      { // 源地址/目的地址转换时可配
        id: 'destIp',
        filter: 'src_dest',
        text: _('Destination IP'),
        formProps: {
          type: 'text',
        },
      },
      { // 源地址/目的地址转换时可配
        id: 'serve',
        filter: 'src_dest',
        text: _('Serve'),
        formProps: {
          type: 'select',
        },
      },
      { // 源地址转换时可配
        id: 'exitPort',
        filter: 'src',
        text: _('Exit Port'),
        formProps: {
          type: 'select',
          options: portIdOptions,
        },
      },
      { // 目的地址转换时可配
        id: 'entryPort',
        filter: 'dest',
        text: _('Entry Port'),
        formProps: {
          type: 'select',
          options: portIdOptions,
        },
      },
      { // 源地址转换时可配
        id: 'transferedScr',
        filter: 'src',
        text: _('Transferd Source IP '),
        formProps: {
          type: 'select',
        },
      },
      { // 目的地址转换时可配
        id: 'transferedDest',
        filter: 'dest',
        text: _('Transfered Destination IP'),
        formProps: {
          type: 'select',
        },
      },
      {
        id: 'logEnable',
        text: _('Log Enable'),
        options: [
          { label: _('ON'), value: '1' },
          { label: _('OFF'), value: '0' },
        ],
        filter: 'all',
        formProps: {
          type: 'checkbox',
        },
      },
      {
        id: 'description',
        filter: 'all',
        text: _('Description'),
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
            {_('NAT Type')}
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
