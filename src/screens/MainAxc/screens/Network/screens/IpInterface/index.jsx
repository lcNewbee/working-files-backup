import React from 'react'; import PropTypes from 'prop-types';
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
    id: 'ipType',
    text: __('IP Type'),
    noTable: true,
    formProps: {
      type: 'switch',
      options: [
        { label: 'Static', value: 'static' },
        { label: 'DHCP', value: 'dhcp' },
        { label: 'PPPoE', value: 'pppoe' },
      ],
    },
  },
  /* *************Static IP************** */
  {
    id: 'ip',
    text: __('IP Address'),
    noForm: (val, item) => item.get('ipType') !== 'static',
    formProps: {
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
    noForm: (val, item) => item.get('ipType') !== 'static',
    formProps: {
      type: 'text',
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
    noForm: (val, item) => item.get('ipType') !== 'static',
    formProps: {
      type: 'text',
    },
  },
  /* **Static IP over**PPPoE start***** */
  {
    id: 'pppoeServer',
    text: __('PPPoE Server'),
    noTable: true,
    noForm: (val, item) => item.get('ipType') !== 'pppoe',
    formProps: {
      type: 'text',
    },
  },
  {
    id: 'pppoeUser',
    noTable: true,
    noForm: (val, item) => item.get('ipType') !== 'pppoe',
    text: __('PPPoE User Name'),
    formProps: {
      type: 'text',
    },
  },
  {
    id: 'pppoePassword',
    noTable: true,
    noForm: (val, item) => item.get('ipType') !== 'pppoe',
    text: __('PPPoE Password'),
    formProps: {
      type: 'password',
    },
  },
  /* ***PPPoE over***DHCP Server Start** */
  {
    id: 'dhcpServerEnable',
    text: __('DHCP Server'),
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
    noForm: (val, item) => item.get('ipType') !== 'static' && item.get('dhcpServerEnable') !== '1',
    formProps: {
      type: 'text',
    },
  },
  {
    id: 'dhcpPoolEnd',
    text: __('DHCP Pool End'),
    noTable: true,
    noForm: (val, item) => item.get('ipType') !== 'static' && item.get('dhcpServerEnable') !== '1',
    formProps: {
      type: 'text',
    },
  },
  {
    id: 'dhcpPoolMask',
    text: __('Subnet Mask'),
    noTable: true,
    noForm: (val, item) => item.get('ipType') !== 'static' && item.get('dhcpServerEnable') !== '1',
    formProps: {
      type: 'text',
    },
  },
  {
    id: 'dhcpOption',
    text: __('Options'),
    noTable: true,
    noForm: (val, item) => item.get('dhcpServerEnable') !== '1',
    formProps: {
      type: 'text',
    },
  },
  /* ***DHCP Server Over******* */
  {
    id: 'natEnable',
    text: __('NAT Enable'),
    formProps: {
      type: 'checkbox',
    },
  },
  {
    id: 'interVlanRouting',
    text: __('Inter-Vlan Routing'),
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


const propTypes = {
  store: PropTypes.instanceOf(Map),
  route: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
};
const defaultProps = {};

export default class IpInterface extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <AppScreen
        {...this.props}
        listOptions={$$listOptions}
        listKey="allKeys"
        maxListSize="24"
        paginationType="none"
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
