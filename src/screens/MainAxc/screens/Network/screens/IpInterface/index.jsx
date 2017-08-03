import React from 'react';
import PropTypes from 'prop-types';
import utils from 'shared/utils';
import { fromJS, Map } from 'immutable';
import { Button, Modal, Table } from 'shared/components';
import validator from 'shared/validator';
import {
  createContainer,
  AppScreen,
} from 'shared/containers/appScreen';

const sizeOptions = [
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 30, label: '30' },
];

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
    id: 'ipv4Ip',
    text: __('IPv4 IP'),
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
    noTable: true,
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
    id: 'ipv4Gateway',
    text: __('IPv4 Gateway'),
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
      required: true,
    },
  },
  {
    id: 'pppoeUser',
    noTable: true,
    text: __('PPPoE User Name'),
    formProps: {
      visible: item => item.get('ipType') === 'pppoe',
      required: true,
      type: 'text',
    },
  },
  {
    id: 'pppoePassword',
    noTable: true,
    text: __('PPPoE Password'),
    formProps: {
      visible: item => item.get('ipType') === 'pppoe',
      required: true,
      type: 'password',
    },
  },
  /* ***PPPoE over***DHCP Server Start** */
  {
    id: 'dhcpServerEnable',
    text: __('DHCP Server'),
    defaultValue: '0',
    render(val) {
      return val === '1' ? __('Enabled') : __('Disabled');
    },
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
      required: true,
      type: 'text',
      visible: item => item.get('ipType') === 'static' && item.get('dhcpServerEnable') === '1',
    },
  },
  {
    id: 'dhcpPoolEnd',
    text: __('DHCP Pool End'),
    noTable: true,
    formProps: {
      required: true,
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
      required: true,
      type: 'text',
    },
  },
  {
    id: 'brandId',
    text: __('Brand ID'),
    noTable: true,
    formProps: {
      visible: item => item.get('dhcpServerEnable') === '1',
      required: true,
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
  {
    id: 'ipv6Ip',
    text: __('IPv6 IP'),
    fieldset: 'ipv6settings',
    render: val => (!val ? '--' : val),
    formProps: {
      type: 'text',
    },
  },
  {
    id: 'prefix',
    text: __('Prefix'),
    noTable: true,
    fieldset: 'ipv6settings',
    formProps: {
      type: 'text',
    },
  },
  {
    id: 'ipv6Gateway',
    text: __('IPv6 Gateway'),
    fieldset: 'ipv6settings',
    render: val => (!val ? '--' : val),
    formProps: {
      type: 'text',
    },
  },
  {
    id: '__action__',
    width: '50px',
    noForm: true,
  },
]);


const propTypes = {
  store: PropTypes.instanceOf(Map),
  route: PropTypes.object,
  fetch: PropTypes.func,
};
const defaultProps = {};

export default class IpInterface extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showDhcpList: false,
      dhcpClientList: fromJS([
        {
          name: 'name1',
          mac: '11:22:33:44:55:66',
          ip: '192.168.0.123',
        },
      ]),
      pageQuery: fromJS({
        total: '40',
        currPage: '2',
        totalPage: '4',
        search: '',
        page: '1',
        size: '10',
      }),
    };
    this.initListOptions = this.initListOptions.bind(this);
    this.renderModalChildren = this.renderModalChildren.bind(this);
    this.onModalOkClick = this.onModalOkClick.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.onPageSizeChange = this.onPageSizeChange.bind(this);
  }

  onShowClientBtnClick(item) {
    this.setState({ showDhcpList: true });
    this.name = item.get('name');
    this.fetchClientListByName(this.name);
  }


  onPageChange(page) {
    const pageQuery = this.state.pageQuery.set('page', page);
    this.setState({ pageQuery }, () => {
      this.fetchClientListByName(this.name);
    });
  }

  onPageSizeChange(size) {
    const pageQuery = this.state.pageQuery.set('size', size.value);
    this.setState({ pageQuery }, () => {
      this.fetchClientListByName(this.name);
    });
  }

  onModalOkClick() {
    const pageQuery = this.state.pageQuery.delete('total').delete('totalPage')
      .set('search', '').set('page', '1').set('currPage', '1');
    this.setState({
      showDhcpList: false,
      dhcpClientList: fromJS([]),
      pageQuery,
    });
  }

  initListOptions() {
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');
    const ipv6Enable = store.getIn([curScreenId, 'data', 'ipv6Enable']);
    const ipv6FormStatus = ipv6Enable !== '1';
    // 确定是否要显示ipv6的内容
    let listOptions = $$listOptions.map((item) => {
      let itemcp = item;
      if (item.get('fieldset') === 'ipv6settings') {
        if (!item.has('noForm')) {
          itemcp = item.set('noForm', ipv6FormStatus);
        }
        if (!item.has('noTable')) {
          itemcp = item.set('noTable', ipv6FormStatus);
        }
        return itemcp;
      }
      return item;
    });
    listOptions = listOptions.setIn([-1, 'render'], (val, item) => item.get('dhcpServerEnable') === '1' && (
      <Button
        text={__('DHCP Clients')}
        onClick={() => { this.onShowClientBtnClick(item); }}
      />
    ));
    return listOptions;
  }

  // 根据接口名称获取dhcp客户端列表，同时也更新了列表
  fetchClientListByName(name) {
    const query = { ...this.state.pageQuery.toJS(), name };
    this.props.fetch(this.props.route.formUrl, query).then((json) => {
      if (json.state && json.state.code === '2000') {
        const list = fromJS(json.data.list) || fromJS([]);
        const page = this.state.pageQuery.merge(fromJS(json.data.page));
        this.setState({ dhcpClientList: list, pageQuery: page });
      }
    });
  }

  renderModalChildren() {
    const options = [
      {
        id: 'name',
        text: __('Name'),
      },
      {
        id: 'ip',
        text: __('IP'),
      },
      {
        id: 'mac',
        text: __('MAC'),
      },
    ];
    return (
      <Table
        options={options}
        list={this.state.dhcpClientList}
        page={this.state.pageQuery}
        size={this.state.pageQuery.get('size')}
        pageQuery={this.state.pageQuery}
        sizeOptions={sizeOptions}
        paginationType="default"
        onPageChange={this.onPageChange}
        onPageSizeChange={this.onPageSizeChange}
      />
    );
  }

  render() {
    return (
      <AppScreen
        {...this.props}
        listOptions={this.initListOptions()}
        listKey="allKeys"
        maxListSize="24"
        deleteable
        editable
        selectable
        actionable
      >
        <Modal
          isShow={this.state.showDhcpList}
          okText={__('OK')}
          cancelButton={false}
          onOk={this.onModalOkClick}
        >
          {this.renderModalChildren()}
        </Modal>
      </AppScreen>
    );
  }
}

IpInterface.propTypes = propTypes;
IpInterface.defaultProps = defaultProps;

export const Screen = createContainer(IpInterface);
