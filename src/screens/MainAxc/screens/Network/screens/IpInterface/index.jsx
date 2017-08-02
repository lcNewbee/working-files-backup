import React from 'react';
import PropTypes from 'prop-types';
import utils from 'shared/utils';
import { fromJS, Map } from 'immutable';
import validator from 'shared/validator';
import {
  createContainer,
  AppScreen,
} from 'shared/containers/appScreen';

const $$listOptions = fromJS([
  {
    id: 'name',
    text: __('Port Name'),
    formProps: {
      type: 'text',
      notEditable: true,
      required: true,
    },
  },
  {
    id: 'vlanId',
    text: __('VLAN ID'),
    type: 'select',
    options: [ // 选择已经配置好的vlan
      { label: 'VLAN 1', value: '1' },
      { label: 'VLAN 2', value: '2' },
      { label: 'VLAN 3', value: '3' },
      { label: 'VLAN 4', value: '4' },
    ],
    formProps: {
      type: 'select',
      searchable: true,
      required: true,
    },
  },
  {
    id: 'ipType',
    text: __('IP Type'),
    noTable: true,
    defaultValue: 'static',
    formProps: {
      minWidth: '66px',
      type: 'switch',
      options: [
        { label: 'Static', value: 'static' },
        { label: 'DHCP', value: 'dhcp' },
        { label: 'PPPoE', value: 'pppoe' },
      ],
    },
  },
  /* *************Static IP************** */
  { //  Qst:ip地址保存时，是否需要后台做检测，通过和已经存在的接口IP对比确定是否能够保存？
    id: 'ip',
    text: __('IP Address'),
    formProps: {
      visible: item => item.get('ipType') === 'static',
      type: 'text',
      required: true,
      validator: validator({
        rules: 'ip',
      }),
    },
  },
  {
    id: 'mask',
    text: __('Subnet Mask'),
    formProps: {
      type: 'text',
      visible: item => item.get('ipType') === 'static',
      required: true,
      validator: validator({
        rules: 'mask',
      }),
    },
  },
  {
    id: 'gateway',
    text: __('Gateway'),
    noTable: true,
    formProps: {
      type: 'text',
      visible: item => item.get('ipType') === 'static',
    },
  },
  /* **Static IP over**PPPoE start***** */
  {
    id: 'pppoeServer',
    text: __('PPPoE Server'),
    noTable: true,
    formProps: {
      visible: item => item.get('ipType') === 'pppoe',
      type: 'text',
    },
  },
  {
    id: 'pppoeUser',
    noTable: true,
    text: __('PPPoE User Name'),
    formProps: {
      visible: item => item.get('ipType') === 'pppoe',
      type: 'text',
    },
  },
  {
    id: 'pppoePassword',
    noTable: true,
    text: __('PPPoE Password'),
    formProps: {
      visible: item => item.get('ipType') === 'pppoe',
      type: 'password',
    },
  },
  /* ***PPPoE over***DHCP Server Start** */
  {
    id: 'dhcpServerEnable',
    text: __('DHCP Server'),
    defaultValue: '0',
    render(val) { return val === '1' ? __('Enabled') : __('Disabled'); },
    formProps: {
      type: 'checkbox',
      options: [
        { label: __('ON'), value: '1' },
        { label: __('OFF'), value: '0' },
      ],
    },
  },
  {
    id: 'dhcpPoolStart',
    text: __('DHCP Pool Start'),
    noTable: true,
    formProps: {
      type: 'text',
      visible: item => item.get('ipType') === 'static' && item.get('dhcpServerEnable') === '1',
    },
  },
  {
    id: 'dhcpPoolEnd',
    text: __('DHCP Pool End'),
    noTable: true,
    formProps: {
      type: 'text',
      visible: item => item.get('ipType') === 'static' && item.get('dhcpServerEnable') === '1',
    },
  },
  {
    id: 'dhcpPoolMask',
    text: __('Subnet Mask'),
    noTable: true,
    formProps: {
      visible: item => item.get('ipType') === 'static' && item.get('dhcpServerEnable') === '1',
      type: 'text',
    },
  },
  {
    id: 'brandId',
    text: __('Brand ID'),
    noTable: true,
    formProps: {
      visible: item => item.get('dhcpServerEnable') === '1',
      type: 'text',
    },
  },
  /* ***DHCP Server Over******* */
  {
    id: 'natEnable',
    text: __('NAT Enable'),
    defaultValue: '1',
    render(val) { return val === '1' ? __('Enabled') : __('Disabled'); },
    formProps: {
      type: 'checkbox',
    },
  },
  {
    id: 'interVlanRouting',
    text: __('Inter-Vlan Routing'),
    defaultValue: '0',
    render(val) { return val === '1' ? __('Enabled') : __('Disabled'); },
    formProps: {
      type: 'checkbox',
    },
  },
  {
    id: 'authentication',
    text: __('Authentication'),
    formProps: {
      type: 'select',
      options: [],
    },
  },
]);


const propTypes = {};
const defaultProps = {};

export default class IpInterface extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {

  }


  render() {
    return (
      <AppScreen
        {...this.props}
        listOptions={$$listOptions}
        listKey="allKeys"
        maxListSize="24"
        deleteable
        editable
        selectable
        actionable
      />
    );
  }
}

IpInterface.propTypes = propTypes;
IpInterface.defaultProps = defaultProps;

export const Screen = createContainer(IpInterface);
