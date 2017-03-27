import React from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { bindActionCreators } from 'redux';
import { fromJS, Map } from 'immutable';
import validator from 'shared/validator';
import Table from 'shared/components/Table';
import {
  Search, FormGroup, Button, Select, Modal, Switchs,
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

const labelPre = __('Items per page: ');

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
  { value: 20, label: labelPre + '20' },
  { value: 50, label: labelPre + '50' },
  { value: 100, label: labelPre + '100' },
];

// 原生的 react 页面
export const Device = React.createClass({
  mixins: [PureRenderMixin],

  componentWillMount() {
    this.handleSearch();
  },
  // 加载后如果app的refreshAt属性有更新则从后台抓取数据
  // 什么时候执行这个函数？
  componentDidUpdate(prevProps) {
    if (prevProps.app.get('refreshAt') !== this.props.app.get('refreshAt')) {
      this.handleSearch();
    }
  },
  // 离开页面时执行？
  componentWillUnmount() {
    this.props.resetVaildateMsg();
    this.props.leaveDevicesScreen();
  },
  // 从后台抓取数据
  handleSearch() {
    this.props.fetchDevices();
  },

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
  },

  // on Query changed
  onChangeSearchText(val) {
    this.props.changeDevicesQuery({
      search: val,
    });
  },
  onChangeTableSize(option) {
    this.props.changeDevicesQuery({
      size: option.value,
      page: 1,
    });
    this.handleSearch();
  },
  onChangeDevicesQuery(data) {
    this.props.changeDevicesQuery({
      devicetype: data.value,
    });
    this.handleSearch();
  },
  onPageChange(i) {
    this.props.changeDevicesQuery({
      page: i,
    });
    this.handleSearch();
  },

  /**
   *
   */
  onResetDevice(mac) {
    let msg_text = __('Are you sure reset device: %s?', mac);

    this.props.createModal({
      id: 'settings',
      role: 'confirm',
      text: msg_text,
      apply: function () {
        this.handleAction(mac, 'reset');
      }.bind(this),
    });
  },
  onRebootDevice(mac) {
    let msg_text = __('Are you sure reboot device: %s?', mac);

    this.props.createModal({
      id: 'settings',
      role: 'confirm',
      text: msg_text,
      apply: function () {
        this.handleAction(mac, 'reboot');
      }.bind(this),
    });
  },
  onLocateDevice(mac, isLocating) {
    let actionType = 'location';

    if (isLocating) {
      actionType = 'unlocation';
    }
    this.handleAction(mac, actionType);
  },
  onUpgradeDevice(mac) {
    let msg_text = __('Upgrade need reboot Device, are you sure upgrade device: %s?', mac);

    this.props.createModal({
      id: 'settings',
      role: 'confirm',
      text: msg_text,
      apply: function () {
        this.handleAction(mac, 'upgrade');
      }.bind(this),
    });
  },

  // onEdit
  showEditNetwork(mac) {
    return function (e) {
      this.props.fetchDeviceNetwork(mac);
    }.bind(this);
  },
  onChangeDeviceNetwork(name) {
    return function (data) {
      let editObj = {};

      editObj[name] = data.value;
      this.props.changeDeviceNetwork(editObj);
    }.bind(this);
  },

  // 组合验证
  combine() {
    const { ip, mask, gateway, connect_type } = this.props.store.get('edit').toJS();
    const oriMask = this.props.store.getIn(['oriEdit', 'mask']);
    const oriGateway = this.props.store.getIn(['oriEdit', 'gateway']);
    let ret;

    if (connect_type === 'static') {
      if (!ret && gateway) {
        ret = validator.combine.needStaticIP(ip, mask, gateway);
      }
    }

    return ret;
  },

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
          } else {
            if ((oriGateway && validator.combine.needStaticIP(ip, oriMask, oriGateway)) || oriMask !== mask) {
              this.props.createModal({
                title: __('DEVICES'),
                role: 'confirm',
                text: __('You might be unable to control the device after modifying its network segment, are you sure you want to modify it?'),
                apply: () => this.props.saveDeviceNetwork(),
              });
            } else {
              if (validator.combine.needStaticIP(ip, oriMask, oriGateway) || oriMask !== mask) {
                this.props.createModal({
                  title: __('DEVICES'),
                  role: 'confirm',
                  text: __('You might be unable to control the device after modifying its network segment, are you sure you want to modify it?'),
                  apply: function () {
                    this.props.saveDeviceNetwork();
                  }.bind(this),
                });
              } else {
                this.props.saveDeviceNetwork();
              }
            }
          }
        }
      });
  },

  getDevicesTableOptions() {
    const noControl = this.props.app.get('noControl');
    let ret = '';

    if (this.props.store.getIn(['query', 'devicetype']) === '4') {
      ret = fromJS([
        {
          id: 'devicename',
          text: __('MAC Address') + '/' + __('Name'),
          transform (val, item) {
              let deviceMac = item.get('mac');

              return val || deviceMac;
            },
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
          id: 'operate',
          text: __('Action'),
          filter: 'translate',
        },
      ]);
    } else {
      ret = fromJS([
        {
          id: 'devicename',
          text: __('MAC Address') + '/' + __('Name'),
          transform: function (val, item) {
            let deviceMac = item.get('mac');
            let name = item.get('devicename') || deviceMac;
            let deviceStatus = item.get('status');

            if (deviceStatus === 'disable' || noControl) {
              return <span>{name}</span>;
            }

            return (
              <span
                className="link-text"
                onClick={this.showEditNetwork(deviceMac)}
                value={deviceMac}
                title={__('MAC Address') + ': ' + deviceMac}
              >
                {name}
              </span>
            );
          }.bind(this),
        }, {
          id: 'ip',
          text: __('IP Address'),
          transform: function (val, item) {
            let deviceMac = item.get('mac');
            let deviceStatus = item.get('status');

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
          }.bind(this),
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
          width: '360',
          transform: function (val, item) {
            let deviceMac = item.get('mac');
            let deviceStatus = item.get('status');
            let isLocating = item.get('locatestatus') === 'location';
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
                onClick={this.onUpgradeDevice.bind(this, deviceMac) }
                text={__('Upgrade') }
                size="sm"
                icon="level-up"
                />);
            }

            return (
              <div className="action-btns">
                <Button
                  onClick={this.onRebootDevice.bind(this, deviceMac)}
                  text={__('Reboot')}
                  size="sm"
                  icon="recycle"
                />
                <Button
                  className={locationClassName}
                  onClick={this.onLocateDevice.bind(this, deviceMac, isLocating)}
                  text={__('Locate')}
                  size="sm"
                  icon="location-arrow"
                />
                <Button
                  onClick={this.onResetDevice.bind(this, deviceMac)}
                  text={__('Reset')}
                  size="sm"
                  icon="reply-all"
                />
                {upgradeBtn}
              </div>
            );
          }.bind(this),
        }]);
    }

    if (noControl) {
      ret = ret.delete(-1);
    }

    return ret;
  },

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
    const { text, devicetype, size } = this.props.store.get('query').toJS();

    return (
      <div>
        <h2>{__('Devices Info') }</h2>
        <div className="m-action-bar">
          <Search
            className="search fl"
            value={text}
            placeholder={__('IP or MAC Address')}
            onChange={this.onChangeSearchText}
            onSearch={this.handleSearch}
          />

          <Switchs
            options={typeArr}
            value={devicetype}
            onChange={this.onChangeDevicesQuery}
          />

          <Select
            className="fr"
            clearable={false}
            value={size}
            onChange={this.onChangeTableSize}
            options={selectOptions}
            searchable={false}
          />
        </div>

        <Table
          className="table"
          loading={this.props.store.get('fetching')}
          options={devicesTableOptions}
          list={this.props.store.getIn(['data', 'list'])}
          page={this.props.store.getIn(['data', 'page'])}
          onPageChange={this.onPageChange}
        />

        <Modal
          isShow={currData.isEmpty() ? false : true}
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
  },
});

function mapStateToProps(state) {
  return {
    store: state.devices,
    app: state.app,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    actions
  ), dispatch);
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
  validator.mergeProps(validOptions)
)(Device);

export const devices = reducer;

