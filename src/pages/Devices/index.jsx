import React from 'react';
import utils from 'utils';
import { connect } from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import * as actions from './actions';
import reducer from './reducer';
import {fromJS} from 'immutable';
import {Table} from '../../components/Table';
import {Search} from '../../components/Form/Input';
import Button from 'comlan/components/Button';
import Select from 'comlan/components/Select';

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

const devicesTableOptions = fromJS([{
    'id': 'devicename',
    'text': _('MAC Address') + '/' + _('Name')
  }, {
    'id': 'ip',
    'text': _('IP Address')
  }, {
    'id': 'status',
    'text': _('Online Status')
  }, {
    'id': 'model',
    'text': _('Model')
  }, {
    'id': 'softversion',
    'text':  _('Version')
  }, {
    'id': 'channel',
    'text': _('Channel')
  }, {
    'id': 'operationhours',
    'text': _('Uptime')
  }, {
    id: 'op',
    text: _('Actions')
  }]);

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
    let url = `/goform/locateDevice?mac=${mac}&action=${action}`;
    
    utils.fetch(url)
      .then(function(json) {
        this.handleSearch()
      }.bind(this));
  },

  onChangeSearchText(e) {
    var val = e.target.value;

    this.props.changeDevicesQuery({
      text: val
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

  render() {
    // 添加操作项
    const options = devicesTableOptions.setIn([-1, 'transform'],
      function(item) {
        var deviceMac = item.get('devicename').split('/')[0];
      
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
    )
    
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
          options={options}
          list={this.props.data.get('list')}
          page={this.props.data.get('page')}
          onPageChange={this.onPageChange}
        />

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
    data: myState.get('data')
  };
}

// 添加 redux 属性的 react 页面
export const View = connect(
  mapStateToProps,
  actions
)(Device);

export const devices = reducer;

