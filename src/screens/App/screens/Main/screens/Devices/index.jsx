import React from 'react';
import utils from 'utils';
import { connect } from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import * as actions from './actions';
import reducer from './reducer';
import {fromJS, Map} from 'immutable';
import validator from 'utils/lib/validator';

import {Table} from 'components/Table';
import {Search, FormGruop} from 'components/Form/Input';
import Button from 'components/Button';
import Select from 'components/Select';
import Modal from 'components/Modal';
import Switchs from 'components/Switchs';

// css
import './_index.scss';

const typeArr = fromJS([
      _('All'),
    _('INSIDE'),
    _('PIONT TO PIONT'),
    _('OUTSIDE')
  ]);
const labelPre = _('Items per page: ');

const selectOptions = [
  { value: 20, label: labelPre + '20' },
  { value: 50, label: labelPre + '50' },
  { value: 100, label: labelPre + '100' },
];

// 原生的 react 页面
export const Device = React.createClass({
  mixins: [PureRenderMixin],

  componentWillMount() {
    this.handleSearch()
  },

  handleSearch() {
    this.props.fetchDevices('/goform/devices');
  },
  
  /**
   * action: reboot | reset | locate
   */
  handleAction(mac, action) {
    const data = {
      action,
      macs: [
        mac
      ]
    }
    
    this.props.saveDevicesAction(data)
  },

  onChangeSearchText(e) {
    var val = e.target.value;
    
    this.props.changeDevicesQuery({
      search: val
    });
  },

  onChangeType(i) {
    this.props.changeDevicesQuery({
      devicetype: i
    });
    this.handleSearch()
  },

  onSearchKeyUp(e) {
    var which = e.which;

    if(which === 13) {
      this.handleSearch()
    }
  },

  onResetDevice(mac) {
    var msg_text = _('Are you sure reset device: %s?', mac);
    
    if(confirm(msg_text)) {
      this.handleAction(mac, 'reboot');
    }
  },

  onRebootDevice(mac) {
    var msg_text = _('Are you sure reboot device: %s?', mac);
    
    if(confirm(msg_text)) {
      this.handleAction(mac, 'reboot');
    }
  },

  onLocateDevice(mac) {
    this.handleAction(mac, 'locate');
  },
  
  onChangeTableSize(option) {
    var val = '';
    
    if(option) {
      val = option.value;
    }
    
    this.props.changeDevicesQuery({
      size: val,
      page: 1
    });
    this.handleSearch()
  },
  
  onPageChange(i) {
    this.props.changeDevicesQuery({
      page: i
    });
    this.handleSearch()
  },
  
  showEditNetwork(mac) {
    
    return function(e) {
      this.props.fetchDeviceNetwork(mac)
    }.bind(this);
  },
  
  onChangeConnectType(data) {
    this.props.changeDeviceNetwork({
      connect_type: data.value
    });
  },
  
  onChangeDeviceNetwork(name) {
     return function(e) {
       var val = e.target.value;
       var data = {};
       
       data[name] = val;
       
       this.props.changeDeviceNetwork(data);
     }.bind(this)
  },
  
  onSaveDeviceNetWork() {
    this.props.saveDeviceNetwork();
  },

  render() {
    const devicesTableOptions = fromJS([{
      id: 'devicename',
      text: _('MAC Address') + '/' + _('Name'),
      transform: function(item) {
        var deviceMac = item.get('mac');
        var name = item.get('devicename') || deviceMac;
        
        return (
          <span
            className="link-text"
            onClick={this.showEditNetwork(deviceMac)}
            value={deviceMac}
          >
            {name}
          </span>
        )
      }.bind(this)
    }, {
      id: 'ip',
      text: _('IP Address'),
      transform: function(item) {
        var deviceMac = item.get('mac');
        
        return (
          <span
            className="link-text"
            onClick={this.showEditNetwork(deviceMac)}
            value={deviceMac}
          >
            {item.get('ip')}
          </span>
        )
      }.bind(this)
    }, {
      id: 'status',
      text: _('Online Status')
    }, {
      id: 'model',
      text: _('Model')
    }, {
      id: 'softversion',
      text:  _('Version')
    }, {
      id: 'channel',
      text: _('Channel')
    }, {
      id: 'operationhours',
      text: _('Uptime')
    }, {
      id: 'op',
      text: _('Actions'),
      transform: function(item) {
        var deviceMac = item.get('mac');
      
        return (
          <div>
            <Button
              onClick={this.onRebootDevice.bind(this, deviceMac)}
              text="重启"
              size="sm"
              role="recycle"
            />
            <Button
              onClick={this.onLocateDevice.bind(this, deviceMac)}
              text="定位"
              size="sm"
              role="location-arrow"
            />
            <Button
              onClick={this.onResetDevice.bind(this, deviceMac)}
              text="复位"
              size="sm"
              role="reply-all"
            />
          </div>
        )
      }.bind(this)
    }]);
    
    const currData = this.props.edit || Map({});
    const typeOptions = fromJS([
      {
        value: 'dhcp',
        label: 'DHCP'
      }, {
        value: 'static',
        label: _('Static IP')
      }
    ]);
   
    
    return (
      <div className="page-device">
        <h2>{_('Devices Info')}</h2>
        <div className="clearfix">
          <Search
            className="search fl"
            value={this.props.query.get('text')}
            updater={this.onChangeSearchText}
            onSearch={this.handleSearch}
          />
          <div className="btn-group fl">
            {
            typeArr.map(function(val, i){
              var classNameVal = 'btn';

              if(this.props.query.get('devicetype') === i) {
                classNameVal += ' active';
              }

              return (
                <button
                  className={classNameVal}
                  key={'device_type' + i}
                  id="all"
                  onClick={this.onChangeType.bind(this, i)}
                >
                  {val}
                </button>
              )
            }.bind(this))
          }
          </div>
          <Select
            className="fr"
            clearable={false}
            value={this.props.query.get('size')}
            onChange={this.onChangeTableSize}
            options={selectOptions}
          />
        </div>

        <Table
          className="table"
          options={devicesTableOptions}
          list={this.props.data.get('list')}
          page={this.props.data.get('page')}
          onPageChange={this.onPageChange}
        />
        
        <Modal
          isShow={this.props.edit ? true : false}
          title={currData.get('mac')}
          onClose={this.props.closeDeviceEdit}
          onOk={this.onSaveDeviceNetWork}
        >
          <FormGruop
            label={_('Nickname')}
            maxLength="24"
            value={currData.get('nickname')}
            updater={this.onChangeDeviceNetwork('nickname')}
          />
                
          <div className="form-group">
            <label htmlFor="">{_('Connect Type')}</label>
            <div className="form-control">
              <Switchs
                options={typeOptions}
                clearable={false}
                onChange={this.onChangeConnectType}
                value={currData.get('connect_type')}
              />
            </div>
          </div>
          {
            currData.get('connect_type') === 'static' ? (
              <div>
                <FormGruop
                  label={_('IP Address')}
                  value={currData.get('ip')}
                  updater={this.onChangeDeviceNetwork('ip')}
                  validator={validator({
                    rules: 'ip'
                  })}
                />
               
                <FormGruop
                  label={_('Subnet Mask')}
                  value={currData.get('mask')}
                  updater={this.onChangeDeviceNetwork('mask')}
                  validator={validator({
                    rules: 'mask'
                  })}
                />
               
                <FormGruop
                  label={_('Gateway')}
                  value={currData.get('gateway')}
                  updater={this.onChangeDeviceNetwork('gateway')}
                />
                <FormGruop
                  label={_('DNS 1')}
                  value={currData.get('main_dns')}
                  updater={this.onChangeDeviceNetwork('main_dns')}
                />
                <FormGruop
                  label={_('DNS 2')}
                  value={currData.get('second_dns')}
                  updater={this.onChangeDeviceNetwork('second_dns')}
                />
              </div>
             ) : null
          }
          
        </Modal>
      </div>
    );
  }
});

function mapStateToProps(state) {
  var myState = state.devices;
  
  return {
    fetching: myState.get('fetching'),
    query: myState.get('query'),
    updateAt: myState.get('updateAt'),
    data: myState.get('data'),
    edit: myState.get('edit'),
  };
}

// 添加 redux 属性的 react 页面
export const View = connect(
  mapStateToProps,
  actions
)(Device);

export const devices = reducer;

