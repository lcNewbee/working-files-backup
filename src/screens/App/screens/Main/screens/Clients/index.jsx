import React from 'react';
import { connect } from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {fromJS} from 'immutable';
import utils from 'utils';

// components
import {Table} from 'components/Table';
import Button from 'components/Button';
import {Search} from 'components/Form';
import Select from 'components/Select';
import Switchs from 'components/Switchs';

// custom 
import * as actions from './actions';
import reducer from './reducer';

const flowRateFilter = utils.filter('flowRate');

const clientsTableOptions = fromJS([
  {
    id: 'devicename',
    text: _('MAC Address') + '/' + _('Name'),
    transform: function(val, item) {
      return item.get('devicename') || item.get('mac');
    }
  }, {
    id: 'ip',
    text: _('IP Address')
  }, {
    id: 'ssid',
    text: 'SSID'
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
      
      return <span className={classNames}></span>;
    }
  }, {
    id: 'authtype',
    text: _('Authentication'),
    transform(val, item) {
      var ret = val;

      if(val == '0') {
        ret = 'None';
      } else if (val === 'portal') {
        ret = 'Portal';
      }
      ret = _(ret);
      
      return ret;
    }
  }, {
    id: 'operationhours',
    text: _('Connect Time'),
    filter: 'connectTime',
    width: '160',
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
  _('LOCKED'),
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
  
  onAction(mac, action) {
    this.handleActions({
      action,
      macs: [
        mac
      ]
    }, true);
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
    // 添加操作项
    const options = clientsTableOptions.setIn([-1, 'transform'],
      function(val, item) {
        var deviceMac = item.get('mac');
        var isLock = item.get('islock') === 'lock' ? true : false;
         
        return (
          <div>
            {
              isLock ? (
                <Button
                  icon="unlock"
                  size="sm"
                  text={msg.unlock}
                  style={styles.actionButton}
                  onClick={this.onAction.bind(this, deviceMac, 'unlock')}
                />
              ) : (
                <Button
                  icon="lock"
                  size="sm"
                  text={msg.lock}
                  style={styles.actionButton}
                  onClick={this.onAction.bind(this, deviceMac, 'lock')}
                />
              )
            }
            
            <Button
              icon="repeat"
              size="sm"
              text={msg.reconnect}
              style={styles.actionButton}
              onClick={this.onAction.bind(this, deviceMac, 'reconnect')}
            />
          </div>
        )
      }.bind(this)
    );
    
    const blockOption = fromJS([
      {
        id: 'devicename',
        text: _('MAC Address') + '/' + _('Name')
      }, {
        id: 'ssid',
        text: 'SSID'
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
              onClick={this.onAction.bind(this, deviceMac, 'unlock')}
            />
          );
        }.bind(this)
      }
    ]);
    let tableOptions = options;
    
    if(this.props.query.get('type') == '4') {
      tableOptions = blockOption;
    }

    return (
      <div className="page-device">
        <h2>{msg.TITLE}</h2>
        <div className="clearfix">

          <Search
            value={this.props.query.get('text')}
            updater={this.onChangeSearchText}
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

export const clients = reducer;

