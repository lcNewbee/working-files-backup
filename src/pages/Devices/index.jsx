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

const devicesTableOptions = fromJS([{
    'id': 'name',
    'text': 'MAC地址/设备名'
  }, {
    'id': 'addr',
    'text': '地址'
  }, {
    'id': 'status',
    'text': '状态'
  }, {
    'id': 'model',
    'text': '型号'
  }, {
    'id': 'version',
    'text': '版本号'
  }, {
    'id': 'channel',
    'text': '信道'
  }, {
    'id': 'runTime',
    'text': '运行时间'
  }, {
    id: 'op',
    text: '操作'
  }]);

// 原生的 react 页面
export const Device = React.createClass({
  mixins: [PureRenderMixin],

  componentWillMount() {
    this.handleSearch()
  },

  handleSearch() {
    this.props.fetchDevices('/api/devices');
  },

  onChangeSearchText(e) {
    var val = e.target.value;

    this.props.changeDevicesQuery({
      text: val
    });
  },

  onChangeType(i) {
    this.props.changeDevicesQuery({
      type: i
    });
    this.handleSearch()
  },

  onSearchKeyUp(e) {
    var which = e.which;

    if(which === 13) {
      this.handleSearch()
    }
  },

  onResetDevice(id, name) {
    if(confirm('你确定要复位设备：' + name + '？')) {
      utils.fetch('/api/resetDevice?id=' + id)
        .then(function(json) {
          this.handleSearch()
        }.bind(this));
    }
  },

  onRebootDevice(id, name) {
    if(confirm('你确定要重启设备：' + name + '？')) {
      utils.fetch('/api/rebootDevice?id=' + id)
        .then(function(json) {
          this.handleSearch()
        }.bind(this));
    }
  },

  onLocateDevice(id, name) {
    utils.fetch('/api/locateDevice?id=' + id)
      .then(function(json) {
        this.handleSearch()
      }.bind(this));
  },
  
  onChangeTableSize(option) {
    var val = '';
    
    if(option) {
      val = option.value;
    }
    
    this.props.changeDevicesQuery({
      size: val
    });
  },

  render() {
    // 添加操作项
    const options = devicesTableOptions.setIn([-1, 'transform'],
      function(item) {
        return (
          <div>
            <Button
              onClick={this.onRebootDevice.bind(this, item.get('id'), item.get('name'))}
              text="重启"
              role="recycle"
            />
            <Button
              onClick={this.onLocateDevice.bind(this, item.get('id'), item.get('name'))}
              text="定位"
              role="location-arrow"
            />
            <Button
              onClick={this.onResetDevice.bind(this, item.get('id'), item.get('name'))}
              text="复位"
              role="reply-all"
            />
          </div>
        )
      }.bind(this)
    )

    const typeArr = fromJS([
      'all',
      '室内接入点全部',
      '点对点网桥',
      '室外接入点'
    ]);
    
    const selectOptions = [
      { value: 20, label: '20' },
      { value: 50, label: '50' },
      { value: 100, label: '100' },
    ]
    

    return (
      <div className="page-device">
        <h2>设备信息</h2>
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

              if(this.props.query.get('type') === i) {
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

