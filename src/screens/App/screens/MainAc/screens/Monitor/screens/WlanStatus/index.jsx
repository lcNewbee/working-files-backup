import React from 'react';
import { connect } from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {fromJS} from 'immutable';
import utils from 'shared/utils';

// components
import {Table} from 'shared/components/Table';
import Button from 'shared/components/Button';
import {Search} from 'shared/components/Form';
import Select from 'shared/components/Select';
import Switchs from 'shared/components/Switchs';

// custom
import * as actions from './actions';
import myReducer from './reducer';

const flowRateFilter = utils.filter('flowRate:["KB"]');

const flowTableOptions = fromJS([
  {
    id: 'ssid',
    text: 'SSID',
    width: '180',
  }, {
    id: 'type',
    width: '140',
    text: _('Online Nnmbers'),
  }, {
    id: 'connectap',
    width: '140',
    text: _('AP Nnmbers'),
  }, {
    id: 'bandwidth',
    text: _('Up/Down Speed'),
    transform: function(val, item) {
      var upRate = flowRateFilter.transform(item.get('upstream'));
      var downRate = flowRateFilter.transform(item.get('downstream'));

      return upRate + '/' + downRate;
    }
  }
]);
const apWlanOption = fromJS([
  {
    id: 'devicename',
    width: '180',
    text: _('MAC Address') + '/' + _('Name'),
    transform: function(val, item) {
      return item.get('devicename') || item.get('mac');
    }
  }, {
    id: 'ip',
    width: '160',
    text: _('IP Address'),
  }, {
    id: 'mac',
    width: '160',
    text: _('MAC Address'),
  }, {
    id: 'type',
    width: '140',
    text: _('Connected Nnmbers'),
  }, {
    id: 'bandwidth',
    text: _('Up/Down Speed'),
    transform: function(val, item) {
      var upRate = flowRateFilter.transform(item.get('upstream'));
      var downRate = flowRateFilter.transform(item.get('downstream'));

      return upRate + '/' + downRate;
    }
  }
]);

const msg = {
  TITLE: _('WLAN Status'),
  reconnect: _('Reconnect'),
  lock: _('Lock'),
  unlock: _('Unlock'),
  perPage: _('Items per page: ')
};

const selectOptions = [
  { value: 20, label: msg.perPage + '20' },
  { value: 50, label: msg.perPage + '50' },
  { value: 100, label: msg.perPage + '100' },
];

const typeArr = [
  _('SSID'),
  _('AP'),
];

const styles = {
  actionButton: {
    minWidth: "90px"
  }
}

// 原生的 react 页面
export const Clients = React.createClass({
  mixins: [PureRenderMixin],

  componentWillMount() {
    this.handleSearch()
  },

  componentDidUpdate(prevProps) {
    if(prevProps.app.get('refreshAt') !== this.props.app.get('refreshAt')) {
      this.handleSearch();
    }
  },

  componentWillUnmount() {
    this.props.leaveFlowScreen();
  },

  handleSearch() {
    this.props.fetchFlow();
  },

  handleChangeQuery(data, needSearch) {
    this.props.changeFlowQuery(data);

    if(needSearch) {
      this.handleSearch();
    }
  },

  handleActions(actionQuery, needSave) {
    this.props.changeClientActionQuery(actionQuery);

    if(needSave) {
      this.props.saveFlowAction();
    }
  },

  onAction(mac, action, wirelessType) {
    var subData = {
      action,
      macs: [
        mac
      ]
    };

    if(typeof wirelessType === 'string') {
      subData.wirelessType = wirelessType;
    }

    this.handleActions(subData, true);
  },

  onChangeSearchText(val, e) {
    this.handleChangeQuery({
      search: val
    });
  },

  onChangeType(data) {
    this.handleChangeQuery({
      type: data.value
    }, true);
  },

  onChangeTableSize(data) {
    this.handleChangeQuery({
      size: data.value,
      page: 1
    }, true);
  },

  onPageChange(i) {
    this.handleChangeQuery({
      page: i
    }, true);
  },

  render() {
    const noControl = this.props.app.get('noControl');
    // 添加操作项
    let options = flowTableOptions;
    let tableOptions = options;

    if(this.props.query.get('type') == '1') {
      tableOptions = apWlanOption;
    }

    if(noControl) {
      options = options.delete(-1);
      tableOptions = tableOptions.delete(-1);
    }

    return (
      <div className="page-device">
        <h2>{msg.TITLE}</h2>
        <div className="m-action-bar clearfix">

          <Switchs
            value={this.props.query.get('type')}
            options={typeArr}
            onChange={this.onChangeType}
          />
          <Select
            className="fr"
            clearable={false}
            value={this.props.query.get('size')}
            onChange={this.onChangeTableSize}
            options={selectOptions}
            searchable={false}
          />
        </div>

        <Table
          className="table"
          options={tableOptions}
          list={this.props.data.get('list')}
          page={this.props.data.get('page')}
          onPageChange={this.onPageChange}
          loading={this.props.fetching}
        />

      </div>
    );
  }
});

function mapStateToProps(state) {
  var myState = state.wlanStatus;

  return {
    app: state.app,
    fetching: myState.get('fetching'),
    query: myState.get('query'),
    updateAt: myState.get('updateAt'),
    data: myState.get('data'),
    page: myState.get('page'),
    edit: myState.get('edit'),
  };
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  actions
)(Clients);

export const reducer = myReducer;

