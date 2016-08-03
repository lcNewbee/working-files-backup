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

const clientsTableOptions = fromJS([
  {
    id: 'devicename',
    text: _('MAC Address') + '/' + _('Name'),
    transform: function(val, item) {
      return item.get('devicename') || item.get('mac');
    }
  }, {
    id: 'ip',
    text: _('IP Address'),
  }, {
    id: 'vendor',
    text: _('Manufacturer')
  }, {
    id: 'type',
    text: _('User Type'),
  }, {
    id: 'ssid',
    text: 'SSID',
  }, {
    id: 'connectap',
    text: _('Associated AP'),
    transform: function(val, item) {
      return item.get('connectap') || item.get('apmac');
    }
  }, {
    id: 'bandwidth',
    text: _('Up/Down Speed'),
    transform: function(val, item) {
      var upRate = flowRateFilter.transform(item.get('upstream'));
      var downRate = flowRateFilter.transform(item.get('downstream'));

      return upRate + '/' + downRate;
    }
  }, {
    id: 'rssi',
    text: _('RSSI'),
    transform: function(val, item) {
      var intVal = parseInt(val, 10);
      var classNames = 'Icon Icon-block Icon-wifi';

      // 判断加密范式
      if(item.get('encryption') === 'none') {
        classNames += '-nopass';
      } else {
        classNames += '-pass';
      }

      if(intVal > 85) {
        classNames += '-0';
      } else if(intVal > 75) {
        classNames += '-1';
      } else if(intVal > 65) {
        classNames += '-2';
      } else {
        classNames += '-3';
      }

      //return <span className={classNames}></span>;
      return val;
    }
  }, {
    id: 'operationhours',
    text: _('Connect Time'),
    filter: 'connectTime'
  }, {
    id: 'op',
    width: '220',
    text: _('Actions')
  }
]);

const msg = {
  TITLE: _('Clients Info'),
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
  _('ALL'),
  _('WIRELESS'),
  _('WIRED'),
  _('GUEST'),
  _('BLOCKED/LAST APPEARED'),
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
    this.props.leaveClientsScreen();
  },

  handleSearch() {
    this.props.fetchClients();
  },

  handleChangeQuery(data, needSearch) {
    this.props.changeClientsQuery(data);

    if(needSearch) {
      this.handleSearch();
    }
  },

  handleActions(actionQuery, needSave) {
    this.props.changeClientActionQuery(actionQuery);

    if(needSave) {
      this.props.saveClientsAction();
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
    let options = clientsTableOptions.setIn([-1, 'transform'],
      function(val, item) {
        var mac = item.get('mac');
        var status = item.get('status');
        var isLock = item.get('islock') === 'lock' ? true : false;

        if (status === 'disable' || noControl) {
          return null;
        }

        return (
          <div className="action-btns">
            {
              isLock ? (
                <Button
                  icon="unlock"
                  size="sm"
                  text={msg.unlock}
                  style={styles.actionButton}
                  onClick={this.onAction.bind(this, mac, 'unlock')}
                />
              ) : (
                <Button
                  icon="lock"
                  size="sm"
                  text={msg.lock}
                  style={styles.actionButton}
                  onClick={this.onAction.bind(this, mac, 'lock')}
                />
              )
            }

            <Button
              icon="repeat"
              size="sm"
              text={msg.reconnect}
              style={styles.actionButton}
              onClick={this.onAction.bind(this, mac, 'reconnect')}
            />
          </div>
        )
      }.bind(this)
    );

    const blockOption = fromJS([
      {
        id: 'devicename',
        text: _('MAC Address') + '/' + _('Name'),
        transform: function(val, item) {
          return item.get('devicename') || item.get('mac');
        }
      }, {
        id: 'vendor',
        text: _('Manufacturer')
      }, {
        id: 'wirelessType',
        text: _('Type'),
        transform: function(val, item) {
          var typeMap = {
            main: _('Main SSID'),
            guest: _('Guest SSID')
          };

          return typeMap[val] || _('Main Wireless');
        }
      }, {
        id: 'bandwidth',
        text: _('Up/Down Speed'),
        transform: function(val, item) {
          var upRate = flowRateFilter.transform(item.get('upstream'));
          var downRate = flowRateFilter.transform(item.get('downstream'));

          return upRate + '/' + downRate;
        }
      }, {
        id: "lasttime",
        text: _('Last Seen')
      }, {
        id: 'op',
        text: _('Actions'),
        transform: function(val, item) {
          var deviceMac = item.get('mac');
          var isLock = item.get('islock') === 'lock' ? true : false;

          return (
            <Button
              icon="unlock"
              size="sm"
              text={msg.unlock}
              style={styles.actionButton}
              onClick={this.onAction.bind(this, deviceMac, 'unlock', item.get('wirelessType'))}
            />
          );
        }.bind(this)
      }
    ]);
    let tableOptions = options;

    if(this.props.query.get('type') == '4') {
      tableOptions = blockOption;
    }

    if(noControl) {
      options = options.delete(-1);
      tableOptions = tableOptions.delete(-1);
    }

    return (
      <div className="page-device">
        <h2>{msg.TITLE}</h2>
        <div className="m-action-bar clearfix">

          <Search
            value={this.props.query.get('text')}
            onChange={this.onChangeSearchText}
            onSearch={this.handleSearch}
            placeholder={_('IP or MAC Address')}
          />
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
  var myState = state.clients;

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

