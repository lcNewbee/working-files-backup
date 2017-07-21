import React from 'react';
import utils from 'shared/utils';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fromJS, Map } from 'immutable';
import validator from 'shared/validator';
import Table from 'shared/components/Table';
import {
  Search, FormGroup, Button, Modal, Switchs, PureComponent,
} from 'shared/components';
import { actions as appActions } from 'shared/containers/app';
import * as actions from './actions';
import reducer from './reducer';


// css
import './_index.scss';

/**
 *
 */
const typeArr = [
  {
    value: '0',
    label: __('ALL'),
  }, {
    value: '1',
    label: __('INDOOR'),
  }, {
    value: '3',
    label: __('OUTDOOR'),
  }, {
    value: '4',
    label: __('IN OPERATION...'),
  },
];

const validOptions = Map({
  ip: validator({
    rules: 'ip',
  }),

  mask: validator({
    rules: 'mask',
  }),

  gateway: validator({
    rules: 'ip',
  }),

  main_dns: validator({
    rules: 'dns',
  }),

  second_dns: validator({
    rules: 'dns',
  }),
});

const selectOptions = [
  { value: 20, label: '20' },
  { value: 50, label: '50' },
  { value: 100, label: '100' },
];

const propTypes = {
  changeDevicesQuery: PropTypes.func,
  selectRow: PropTypes.func,
  fetchDevices: PropTypes.func,
  createModal: PropTypes.func,
  resetVaildateMsg: PropTypes.func,
  saveDevicesAction: PropTypes.func,
  leaveDevicesScreen: PropTypes.func,
  validateOption: PropTypes.object,
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
};

// 原生的 react 页面
export class Device extends PureComponent {
  constructor(props) {
    super(props);
    utils.binds(this, [
      'onAction',
      'onChangeSearchText',
      'onChangeType',
      'onChangeTableSize',
      'onPageChange',
      'onChangeDevicesQuery',
      'onResetDevice',
      'onRebootDevice',
      'onUpgradeDevice',
      'onLocateDevice',
      'onSaveDeviceNetWork',
      'getDevicesTableOptions',
      'showEditNetwork',
      'onChangeDeviceNetwork',
      'combine',
      'handleSearch',
      'handleAction',
      'onSelectDevice',
      'onRowSelect',
      'onMultiOptionAction',
      'onMultiUpgradeDevice',
      'onMultiRebootDevice',
      'onMultiResetDevice',
      'onMultiLocateDevice',
    ]);
  }

  componentWillMount() {
    this.handleSearch();
  }
  // 加载后如果app的refreshAt属性有更新则从后台抓取数据
  // 什么时候执行这个函数？
  componentDidUpdate(prevProps) {
    if (prevProps.app.get('refreshAt') !== this.props.app.get('refreshAt')) {
      this.handleSearch();
    }
  }

  // 离开页面时执行？
  componentWillUnmount() {
    this.props.resetVaildateMsg();
    this.props.leaveDevicesScreen();
  }
  onRowSelect(index) {
    //  index {index: 0, selected: true, unselectableList: Array(0)};
    this.props.selectRow(index);
  }
  // on Query changed
  onChangeSearchText(val) {
    this.props.changeDevicesQuery({
      search: val,
    });
  }
  onChangeTableSize(option) {
    this.props.changeDevicesQuery({
      size: option.value,
      page: 1,
    });
    this.handleSearch();
  }
  onChangeDevicesQuery(data) {
    this.props.changeDevicesQuery({
      devicetype: data.value,
    });
    this.handleSearch();
  }
  onPageChange(i) {
    this.props.changeDevicesQuery({
      page: i,
    });
    this.handleSearch();
  }

  /**
   *
   */

  onResetDevice(mac) {
    const msgText = __('Are you sure reset device: %s?', mac);
    this.props.createModal({
      id: 'settings',
      role: 'confirm',
      text: msgText,
      apply: () => {
        this.handleAction(mac, 'reset');
      },
    });
  }
  onRebootDevice(mac) {
    const msgText = __('Are you sure reboot device: %s?', mac);
    this.props.createModal({
      id: 'settings',
      role: 'confirm',
      text: msgText,
      apply: () => {
        this.handleAction(mac, 'reboot');
      },
    });
  }
  onLocateDevice(mac, isLocating) {
    let actionType = 'location';
    if (isLocating) {
      actionType = 'unlocation';
    }
    this.handleAction(mac, actionType);
  }
  onUpgradeDevice(mac) {
    const msgText = __('Upgrade need reboot Device, are you sure upgrade device: %s?', mac);

    this.props.createModal({
      id: 'settings',
      role: 'confirm',
      text: msgText,
      apply: () => {
        this.handleAction(mac, 'upgrade');
      },
    });
  }


  onMultiOptionAction(a, b) {
    const warningMsgText = __('Please choose devices to %s!', __(b));
    const $$selectedListIndex = this.props.store.getIn(['actionQuery', 'selectedList']);
    const selectedListSize = $$selectedListIndex.size;
    const confirmMsgText = __('%s need reboot Device, are you sure %s selected %s devices?', __(a), __(b), selectedListSize);
    const macs = [];
    const data = {
      action: b,
      macs,
    };
    if (b === 'upgrade') {
      $$selectedListIndex.forEach((index) => {
        // 不是最新版本才需要升级
        if (this.props.store.getIn(['data', 'list', index, 'newest']) === '0') {
          macs.push(this.props.store.getIn(['data', 'list', index, 'mac']));
        }
      });
    } else {
      $$selectedListIndex.forEach((index) => {
        macs.push(this.props.store.getIn(['data', 'list', index, 'mac']));
      });
    }
    if (selectedListSize === 0) {
      this.props.createModal({
        id: 'settings',
        role: 'confirm',
        text: warningMsgText,
      });
    } else {
      this.props.createModal({
        id: 'settings',
        role: 'confirm',
        text: confirmMsgText,
        apply: () => {
          this.props.saveDevicesAction(data);
        },
      });
    }
  }

  onMultiUpgradeDevice() {
    const a = 'Upgrade';
    const b = 'upgrade';
    this.onMultiOptionAction(a, b);
  }
  onMultiRebootDevice() {
    const a = 'Reboot';
    const b = 'reboot';
    this.onMultiOptionAction(a, b);
  }

  onMultiResetDevice() {
    const a = 'Reset';
    const b = 'reset';
    this.onMultiOptionAction(a, b);
  }

  onChangeDeviceNetwork(name) {
    return (data) => {
      const editObj = {};

      editObj[name] = data.value;
      this.props.changeDeviceNetwork(editObj);
    };
  }

  onSaveDeviceNetWork() {
    this.props.validateAll()
      .then((invalid) => {
        const combineResult = this.combine();
        const { ip, mask, gateway, connect_type } = this.props.store.get('edit').toJS();
        const oriMask = this.props.store.getIn(['oriEdit', 'mask']);
        const oriGateway = this.props.store.getIn(['oriEdit', 'gateway']);

        if (invalid.isEmpty()) {
          if (combineResult) {
            this.props.createModal({
              title: __('DEVICES'),
              role: 'alert',
              text: combineResult,
            });
          } else if ((oriGateway && validator.combine.needStaticIP(ip, oriMask, oriGateway)) || oriMask !== mask) {
            this.props.createModal({
              title: __('DEVICES'),
              role: 'confirm',
              text: __('You might be unable to control the device after modifying its network segment, are you sure you want to modify it?'),
              apply: () => this.props.saveDeviceNetwork(),
            });
          } else if (validator.combine.needStaticIP(ip, oriMask, oriGateway) || oriMask !== mask) {
            this.props.createModal({
              title: __('DEVICES'),
              role: 'confirm',
              text: __('You might be unable to control the device after modifying its network segment, are you sure you want to modify it?'),
              apply: () => {
                this.props.saveDeviceNetwork();
              },
            });
          } else {
            this.props.saveDeviceNetwork();
          }
        }
      });
  }

  getDevicesTableOptions() {
    const noControl = this.props.app.get('noControl');
    let ret = '';

    if (this.props.store.getIn(['query', 'devicetype']) === '4') {
      ret = fromJS([
        {
          id: 'index',
          width: '50px',
          text: __('Index'),
        }, {
          id: 'devicename',
          text: __('Name'),
        }, {
          id: 'mac',
          text: __('MAC Address'),
        }, {
          id: 'model',
          text: __('Model'),
        }, {
          id: 'softversion',
          text: __('Version'),
        }, {
          id: 'channel2.4G',
          text: __('Channel2.4G'),
        }, {
          id: 'channel5.8G',
          text: __('Channel5.8G'),
        }, {
          id: 'operationhours',
          text: __('Uptime'),
          filter: 'connectTime',
        }, {
          id: 'operate',
          text: __('Action'),
          filter: 'translate',
        },
      ]);
    } else {
      ret = fromJS([
        /* {
          id: 'select',
          text: (() => {
            return (
              <div className="action-btns">
                <input
                  type="checkbox"
                />
              </div>
            );
          })(),
          width: 50,
          render: function (val, item) {
            const deviceMac = item.get('mac');
            const selectedDevices = this.props.store.getIn(['selectedList', 'list']);
            return (
              <div className="action-btns">
                <input
                  type="checkbox"
                  value={deviceMac}
                  onChange={this.onSelectDevice}
                  checked={selectedDevices.indexOf(deviceMac) !== -1}
                />
              </div>
            );
          }.bind(this),
        },*/
        {
          id: 'index',
          text: __('Index'),
          width: '50px',
        },
        {
          id: 'devicename',
          text: __('Name'),
          render: (val, item) => {
            const deviceMac = item.get('mac');
            const name = item.get('devicename');
            const deviceStatus = item.get('status');
            if (deviceStatus === 'disable' || noControl) {
              return <span>{name}</span>;
            }
            return (
              <span
                className="link-text"
                onClick={this.showEditNetwork(deviceMac)}
                value={deviceMac}
                title={`${__('MAC Address')}: ${deviceMac}`}
              >
                {name}
              </span>
            );
          },
        }, {
          id: 'mac',
          text: __('MAC Address'),
          render: (val, item) => {
            const deviceMac = item.get('mac');
            const name = deviceMac;
            const deviceStatus = item.get('status');

            if (deviceStatus === 'disable' || noControl) {
              return <span>{name}</span>;
            }
            return (
              <span
                className="link-text"
                onClick={this.showEditNetwork(deviceMac)}
                value={deviceMac}
                title={`${__('MAC Address')}: ${deviceMac}`}
              >
                {name}
              </span>
            );
          },
        }, {
          id: 'ip',
          text: __('IP Address'),
          render: (val, item) => {
            const deviceMac = item.get('mac');
            const deviceStatus = item.get('status');

            if (deviceStatus === 'disable' || noControl) {
              return <span>{item.get('ip') }</span>;
            }
            return (
              <span
                className="link-text"
                onClick={this.showEditNetwork(deviceMac)}
                value={deviceMac}
              >
                {item.get('ip') }
              </span>
            );
          },
        }, {
          id: 'channel2.4G',
          text: __('Channel2.4G'),
        }, {
          id: 'channel5.8G',
          text: __('Channel5.8G'),
        }, {
          id: 'status',
          text: __('Status'),
          filter: 'translate',
        }, {
          id: 'model',
          text: __('Model'),
        }, {
          id: 'softversion',
          text: __('Version'),
        }, {
          id: 'operationhours',
          text: __('Uptime'),
          filter: 'connectTime',
        }, {
          id: 'op',
          text: __('Actions'),
          width: 360,
          render: (val, item) => {
            const deviceMac = item.get('mac');
            const deviceStatus = item.get('status');
            const isLocating = item.get('locatestatus') === 'location';
            let upgradeBtn = null;
            let locationClassName = '';

            if (deviceStatus === 'disable' || noControl) {
              return null;
            }

            if (isLocating) {
              locationClassName = 'animated infinite flash';
            }

            if (item.get('newest') === '0') {
              upgradeBtn = (<Button
                onClick={() => this.onUpgradeDevice(deviceMac)}
                text={__('Upgrade')}
                size="sm"
                icon="level-up"
              />);
            }

            return (
              <div className="action-btns">
                <Button
                  onClick={() => this.onRebootDevice(deviceMac)}
                  text={__('Reboot')}
                  size="sm"
                  icon="recycle"
                />
                <Button
                  className={locationClassName}
                  onClick={() => this.onLocateDevice(deviceMac, isLocating)}
                  text={__('Locate')}
                  size="sm"
                  icon="location-arrow"
                />
                <Button
                  onClick={() => this.onResetDevice(deviceMac)}
                  text={__('Reset')}
                  size="sm"
                  icon="reply-all"
                />
                {upgradeBtn}
              </div>
            );
          },
        }]);
    }

    if (noControl) {
      ret = ret.delete(-1);
    }

    return ret;
  }
  // onEdit
  showEditNetwork(mac) {
    return () => {
      this.props.fetchDeviceNetwork(mac);
    };
  }
  // 组合验证
  combine() {
    const { ip, mask, gateway, connect_type } = this.props.store.get('edit').toJS();
    let ret;

    if (connect_type === 'static') {
      if (!ret && gateway) {
        ret = validator.combine.needStaticIP(ip, mask, gateway);
      }
    }

    return ret;
  }

  // 从后台抓取数据
  handleSearch() {
    clearTimeout(this.fetchTimeout);
    this.fetchTimeout = setTimeout(() => {
      this.props.fetchDevices();
    }, 200);
  }

  /**
   * action: reboot | reset | locate
   */
  handleAction(mac, action) {
    const data = {
      action,
      macs: [
        mac,
      ],
    };

    this.props.saveDevicesAction(data);
  }
  render() {
    const devicesTableOptions = this.getDevicesTableOptions();
    const typeOptions = fromJS([
      {
        value: 'dhcp',
        label: 'DHCP',
      }, {
        value: 'static',
        label: __('Static IP'),
      },
    ]);
    const currData = this.props.store.get('edit') || Map({});
    const { ip, mask, gateway, main_dns, second_dns } = this.props.validateOption;
    const { search, devicetype, size } = this.props.store.get('query').toJS();
    return (
      <div>
        <h2>{__('Devices Info') }</h2>
        <div className="m-action-bar">
          <Search
            className="search fl"
            value={search}
            placeholder={__('IP or MAC Address')}
            onChange={this.onChangeSearchText}
            onSearch={this.handleSearch}
          />
          <Switchs
            options={typeArr}
            value={devicetype}
            onChange={this.onChangeDevicesQuery}
          />
          {
            devicetype !== '4' ? (
              <span>
                <Button
                  text={__('Upgrade')}
                  style={{
                    marginLeft: '12px',
                  }}
                  theme="primary"
                  icon="level-up"
                  onClick={this.onMultiUpgradeDevice}
                />
                <Button
                  text={__('Reboot')}
                  theme="primary"
                  size="sm"
                  icon="recycle"
                  onClick={this.onMultiRebootDevice}
                />
                <Button
                  text={__('Reset')}
                  theme="primary"
                  size="sm"
                  icon="reply-all"
                  onClick={this.onMultiResetDevice}
                />
              </span>
            ) : null
          }
        </div>
        <Table
          className="table"
          loading={this.props.store.get('fetching')}
          options={devicesTableOptions}
          list={this.props.store.getIn(['data', 'list'])}
          page={this.props.store.getIn(['data', 'page'])}
          pageQuery={{
            size,
          }}
          onPageSizeChange={this.onChangeTableSize}
          sizeOptions={selectOptions}
          onPageChange={this.onPageChange}
          onRowSelect={this.onRowSelect}
          selectable
        />

        <Modal
          isShow={!currData.isEmpty()}
          title={currData.get('mac')}
          onClose={this.props.closeDeviceEdit}
          onOk={this.onSaveDeviceNetWork}
          draggable
        >
          <FormGroup
            label={__('Nickname')}
            maxLength="24"
            value={currData.get('nickname')}
            onChange={this.onChangeDeviceNetwork('nickname')}
          />

          <div className="form-group">
            <label htmlFor="">{__('Connect Type') }</label>
            <div className="form-control">
              <Switchs
                options={typeOptions}
                clearable={false}
                onChange={this.onChangeDeviceNetwork('connect_type')}
                value={currData.get('connect_type')}
              />
            </div>
          </div>
          {
            currData.get('connect_type') === 'static' ? (
              <div>
                <FormGroup
                  label={__('Static IP')}
                  required
                  maxLength="15"
                  value={currData.get('ip')}
                  onChange={this.onChangeDeviceNetwork('ip')}

                  {...ip}
                />

                <FormGroup
                  {...mask}
                  label={__('Subnet Mask')}
                  required
                  maxLength="15"
                  value={currData.get('mask')}
                  onChange={this.onChangeDeviceNetwork('mask')}
                />

                <FormGroup
                  label={__('Default Gateway')}
                  maxLength="15"
                  value={currData.get('gateway')}
                  onChange={this.onChangeDeviceNetwork('gateway')}
                  {...gateway}
                />
                <FormGroup
                  label={__('DNS 1')}
                  maxLength="15"
                  value={currData.get('main_dns')}
                  onChange={this.onChangeDeviceNetwork('main_dns')}
                  {...main_dns}
                />
                <FormGroup
                  label={__('DNS 2')}
                  maxLength="15"
                  value={currData.get('second_dns')}
                  onChange={this.onChangeDeviceNetwork('second_dns')}
                  {...second_dns}
                />
              </div>
            ) : null
          }

        </Modal>
      </div>
    );
  }
}

Device.propTypes = propTypes;
function mapStateToProps(state) {
  return {
    store: state.devices,
    app: state.app,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    actions,
  ), dispatch);
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
  validator.mergeProps(validOptions),
)(Device);

export const devices = reducer;

