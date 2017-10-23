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

import startValidFun from 'shared/utils/lib/chain';
/*
// 设计模式：职责链模式 用于数据保存前的组合验证
const Chain = function (fn) {
  this.fn = fn;
  this.successor = null;
};

Chain.prototype.setNextSuccessor = function (successor) {
  this.successor = successor;
};

Chain.prototype.passRequest = function () {
  const ret = this.fn.apply(this, arguments);
  if (ret === 'nextSuccessor') {
    return this.successor && this.successor.passRequest.apply(this.successor, arguments);
  }
  return ret;
};

// ipv4 IP地址和网关是否在同一网段
function isIpAndGatewayInTheSameNet(actionQury, currList) {
  const { ipv4Gateway, ipv4Ip, mask } = currList.toJS();
  if (ipv4Gateway) {
    const msgOption = { ipLabel: __('IP Address'), ip2Label: __('Gateway') };
    const msg = validator.combine.needSameNet(ipv4Ip, mask, ipv4Gateway, msgOption);
    if (msg) return msg;
  }
  return 'nextSuccessor';
}

// dhcp地址池起始和终止地址是否在同一个网段
function isDhcpPoolInTheSameNet(actionQury, currList) {
  const { dhcpPoolStart, dhcpPoolEnd, dhcpPoolMask, dhcpServerEnable, ipType } = currList.toJS();
  if (ipType === 'static' && dhcpServerEnable === '1') {
    const msgOption = { ipLabel: __('DHCP Start IP'), ip2Label: __('DHCP End IP') };
    const msg = validator.combine.needSameNet(dhcpPoolStart, dhcpPoolMask, dhcpPoolEnd, msgOption);
    if (msg) return msg;
  }
  return 'nextSuccessor';
}

// 终止IP地址是否小于起始IP地址
function isDhcpEndIpBiggerThanStart(actionQury, currList) {
  const { dhcpPoolStart, dhcpPoolEnd, dhcpPoolMask, dhcpServerEnable, ipType } = currList.toJS();
  if (ipType === 'static' && dhcpServerEnable === '1') {
    let maskBinaryStr = '';
    dhcpPoolMask.split('.').forEach((element) => {
      maskBinaryStr += Number(element).toString(2);
    });
    const netNum = maskBinaryStr.match(/^[1]+/)[0].length;
    const hostMask = (((2 ** 32) - 1) >>> netNum);
    const startIpArr = dhcpPoolStart.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
    const endIpArr = dhcpPoolEnd.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);

    const startIpNum = (+startIpArr[1] << 24) + (+startIpArr[2] << 16) + (+startIpArr[3] << 8) + (+startIpArr[4]);
    const endIpNum = (+endIpArr[1] << 24) + (+endIpArr[2] << 16) + (+endIpArr[3] << 8) + (+endIpArr[4]);
    console.log((startIpNum & hostMask), (endIpNum & hostMask));
    if ((startIpNum & hostMask) > (endIpNum & hostMask)) return __('DHCP end IP address must be greater than start IP!');
    return '';
  }
  return 'nextSuccessor';
}

// 还有待判断的错误：
// 1. ipv6的IP地址和网关不能相同。注意一个地址可能写法上并不相同
// 2. ipv6的IP地址和网关应该在同一网段。

const chainIpAndGatewayInTheSameNet = new Chain(isIpAndGatewayInTheSameNet);
const chainDhcpPoolInTheSameNet = new Chain(isDhcpPoolInTheSameNet);
const chainDhcpEndIpBiggerThanStart = new Chain(isDhcpEndIpBiggerThanStart);

// 指定职责链
chainIpAndGatewayInTheSameNet.setNextSuccessor(chainDhcpPoolInTheSameNet);
chainDhcpPoolInTheSameNet.setNextSuccessor(chainDhcpEndIpBiggerThanStart);
function onBeforeSync(actionQury, currList) {
  return chainIpAndGatewayInTheSameNet.passRequest(actionQury, currList);
}
*/

function isIpAndGatewayInTheSameNet(actionQury, currList) {
  const { ipv4Gateway, ipv4Ip, mask } = currList.toJS();
  if (ipv4Gateway) {
    const msgOption = { ipLabel: __('IP Address'), ip2Label: __('Gateway') };
    const msg = validator.combine.needSameNet(ipv4Ip, mask, ipv4Gateway, msgOption);
    if (msg) return msg;
  }
  return '';
}

function isDhcpPoolInTheSameNet(actionQury, currList) {
  const { dhcpPoolStart, dhcpPoolEnd, dhcpPoolMask, dhcpServerEnable, ipType } = currList.toJS();
  if (ipType === 'static' && dhcpServerEnable === '1') {
    const msgOption = { ipLabel: __('DHCP Start IP'), ip2Label: __('DHCP End IP') };
    const msg = validator.combine.needSameNet(dhcpPoolStart, dhcpPoolMask, dhcpPoolEnd, msgOption);
    if (msg) return msg;
  }
  return '';
}

function isDhcpEndIpBiggerThanStart(actionQury, currList) {
  const { dhcpPoolStart, dhcpPoolEnd, dhcpPoolMask, dhcpServerEnable, ipType } = currList.toJS();
  if (ipType === 'static' && dhcpServerEnable === '1') {
    let maskBinaryStr = '';
    dhcpPoolMask.split('.').forEach((element) => {
      maskBinaryStr += Number(element).toString(2);
    });
    const netNum = maskBinaryStr.match(/^[1]+/)[0].length;
    const hostMask = (((2 ** 32) - 1) >>> netNum);
    const startIpArr = dhcpPoolStart.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
    const endIpArr = dhcpPoolEnd.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);

    const startIpNum = (+startIpArr[1] << 24) + (+startIpArr[2] << 16) + (+startIpArr[3] << 8) + (+startIpArr[4]);
    const endIpNum = (+endIpArr[1] << 24) + (+endIpArr[2] << 16) + (+endIpArr[3] << 8) + (+endIpArr[4]);
    if ((startIpNum & hostMask) > (endIpNum & hostMask)) return __('DHCP end IP address must be greater than start IP!');
    return '';
  }
  return '';
}

const funArr = [isIpAndGatewayInTheSameNet, isDhcpPoolInTheSameNet, isDhcpEndIpBiggerThanStart];
function onBeforeSync(actionQury, currList) {
  const validateFun = startValidFun(funArr);
  return validateFun(actionQury, currList);
}

const sizeOptions = [
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 30, label: '30' },
];

function generateListOptions() {
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
      options: this.vlanList,
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
        onChange: this.onDhcpServerEnableChange,
      },
    },
    {
      id: 'dhcpSnoopingEnable',
      text: __('DHCP Snooping'),
      noTable: true,
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
        visible: item => item.get('ipType') === 'static' && item.get('dhcpServerEnable') === '1',
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
      id: 'dhcpGateway',
      text: __('Gateway'),
      noTable: true,
      formProps: {
        required: true,
        type: 'text',
        visible: item => item.get('ipType') === 'static' && item.get('dhcpServerEnable') === '1',
      },
    },
    {
      id: 'acIp',
      text: __('AC IP'),
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
      id: 'leaseTime',
      text: __('Lease Time'),
      noTable: true,
      formProps: {
        required: true,
        type: 'number',
        visible: item => item.get('ipType') === 'static' && item.get('dhcpServerEnable') === '1',
      },
    },
    {
      id: 'dns',
      text: __('DNS'),
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
        visible: item => item.get('ipType') === 'static' && item.get('dhcpServerEnable') === '1',
        type: 'text',
      },
    },
    /* ***DHCP Server Over***DHCP Relay Start**** */
    {
      id: 'dhcpRelayEnable',
      text: __('DHCP Relay'),
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
        onChange: this.onDhcpRelayEnableChange,
      },
    },
    {
      id: 'relayDhcpServer',
      text: __('DHCP Server'),
      noTable: true,
      formProps: {
        required: true,
        type: 'text',
        visible: item => item.get('dhcpRelayEnable') === '1',
      },
    },
    {
      id: 'referralServer',
      text: __('Referral Server'),
      noTable: true,
      formProps: {
        type: 'text',
        visible: item => item.get('dhcpRelayEnable') === '1',
      },
    },
    {
      id: 'option82_1',
      text: __('Option82 field1'),
      noTable: true,
      formProps: {
        required: true,
        type: 'text',
        visible: item => item.get('dhcpRelayEnable') === '1',
      },
    },
    {
      id: 'option82_2',
      text: __('Option82 field2'),
      noTable: true,
      formProps: {
        required: true,
        type: 'text',
        visible: item => item.get('dhcpRelayEnable') === '1',
      },
    },
    /* ***DHCP Relay Over*** */
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
        options: this.aaaPolicy,
      },
    },
    {
      id: 'ipv6Ip',
      text: __('IPv6 IP'),
      fieldset: 'ipv6settings',
      render: val => (!val ? '--' : val),
      formProps: {
        type: 'text',
        validator: validator({
          rules: 'ipv6Ip',
        }),
      },
    },
    {
      id: 'prefix',
      text: __('Prefix'),
      noTable: true,
      fieldset: 'ipv6settings',
      formProps: {
        type: 'text',
        validator: validator({
          rules: 'num:[1,128]',
        }),
      },
    },
    {
      id: 'ipv6Gateway',
      text: __('IPv6 Gateway'),
      fieldset: 'ipv6settings',
      render: val => (!val ? '--' : val),
      formProps: {
        type: 'text',
        validator: validator({
          rules: 'ipv6Ip',
        }),
      },
    },
    {
      id: '__action__',
      width: '50px',
      noForm: true,
      render: (val, item) => item.get('dhcpServerEnable') === '1' && (
        <Button
          text={__('DHCP Clients')}
          onClick={() => { this.onShowClientBtnClick(item); }}
        />
      ),
    },
  ]);
  return $$listOptions;
}

const propTypes = {
  store: PropTypes.instanceOf(Map),
  route: PropTypes.object,
  fetch: PropTypes.func,
  updateCurListItem: PropTypes.func,
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
    this.generateListOptions = generateListOptions.bind(this);
    this.onDhcpRelayEnableChange = this.onDhcpRelayEnableChange.bind(this);
    this.onDhcpServerEnableChange = this.onDhcpServerEnableChange.bind(this);
  }

  componentWillMount() {
    this.props.fetch('goform/portal/aaa').then((json) => {
      if (json.state && json.state.code === 2000) {
        this.aaaPolicy = json.data.list.map(item => ({ label: item.name, value: item.name }));
      }
    });
    this.props.fetch('goform/network/vlanlist?size=1000&page=1').then((json) => {
      if (json.state && json.state.code === 2000) {
        this.vlanList = json.data.list.map(item => ({ label: item.vlanId, value: item.vlanId }));
      }
    });
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
    // 为什么这里使用了函数的形式更新state，更新后立即取用state，state仍然是更新前的数据呢？
    // this.setState((state) => {
    //   console.log('state', state);
    //   return { pageQuery: state.pageQuery.set('page', page) };
    // });
    // console.log('out setState', this.state.pageQuery.toJS());
    // this.fetchClientListByName(this.name);
  }

  onDhcpRelayEnableChange(obj, item) {
    const dhcpRelayEnable = obj.value;
    if (dhcpRelayEnable === '0') {
      this.props.updateCurListItem({ dhcpRelayEnable });
    } else if (dhcpRelayEnable === '1' && item.dhcpServerEnable === '1') {
      this.props.updateCurListItem({
        dhcpServerEnable: '0',
        dhcpRelayEnable,
      });
    }
  }

  onDhcpServerEnableChange(obj, item) {
    const dhcpServerEnable = obj.value;
    if (dhcpServerEnable === '0') {
      this.props.updateCurListItem({ dhcpServerEnable });
    } else if (dhcpServerEnable === '1' && item.dhcpRelayEnable === '1') {
      this.props.updateCurListItem({
        dhcpServerEnable,
        dhcpRelayEnable: '0',
      });
    }
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
    const listOptions = this.generateListOptions().map((item) => {
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
        onBeforeSync={onBeforeSync}
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
