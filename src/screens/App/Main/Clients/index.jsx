import React from 'react';
import { connect } from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {fromJS} from 'immutable';

// components
import {Table} from 'components/Table';
import Button from 'components/Button';
import {Search} from 'components/Form/Input';
import Select from 'components/Select';

// custom 
import * as actions from './actions';
import reducer from './reducer';

const clientsTableOptions = fromJS([
  {
    'id': 'devicename',
    'text': _('MAC Address') + '/' + _('Name')
  }, {
    'id': 'ip',
    'text': _('IP Address')
  }, {
    'id': 'ssid',
    'text': 'SSID'
  }, {
    'id': 'connectap',
    'text': _('Associated AP')
  }, {
    'id': 'bandwidth',
    'text': _('Up/Down Speed'),
    transform: function(item) {
      return item.get('upstream') + 'KB/' + item.get('downstream');
    }
  }, {
    'id': 'rssi',
    'text': _('RSSI')
  }, {
    'id': 'authtype',
    'text': _('Authentication')
  }, {
    'id': 'operationhours',
    'text': _('Uptime')
  }, {
    id: 'op',
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

const typeArr = fromJS([
  _('ALL'),
  _('WIRELESS'),
  _('WIRED'),
  _('GUEST')
]);

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

  onChangeSearchText(e) {
    var val = e.target.value;

    this.handleChangeQuery({
      search: val
    });
  },

  onChangeType(i) {
    this.handleChangeQuery({
      type: i
    }, true);
  },

  onChangeTableSize(option) {
    var val = '';

    if(option) {
      val = option.value;
    }

    this.handleChangeQuery({
      size: val,
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
      function(item) {
        var deviceMac = item.get('devicename').split('/')[0];
        var isLock = item.get('islock') === 'lock' ? true : false;
         
        return (
          <div>
            {
              isLock ? (
                <Button
                  role="unlock"
                  size="sm"
                  text={msg.unlock}
                  style={styles.actionButton}
                  onClick={this.onAction.bind(this, deviceMac, 'unlock')}
                />
              ) : (
                <Button
                  role="lock"
                  size="sm"
                  text={msg.lock}
                  style={styles.actionButton}
                  onClick={this.onAction.bind(this, deviceMac, 'lock')}
                />
              )
            }
            
            <Button
              role="repeat"
              size="sm"
              text={msg.reconnect}
              style={styles.actionButton}
              onClick={this.onAction.bind(this, deviceMac, 'reconnect')}
            />
          </div>
        )
      }.bind(this)
    )

    return (
      <div className="page-device">
        <h2>{msg.TITLE}</h2>
        <div className="clearfix">

          <Search
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
                  key={'btnGroup' + i}
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
  var myState = state.clients;

  return {
    fetching: myState.get('fetching'),
    query: myState.get('query'),
    updateAt: myState.get('updateAt'),
    data: myState.get('data'),
    page: myState.get('page')
  };
}

// 添加 redux 属性的 react 页面
export const View = connect(
  mapStateToProps,
  actions
)(Clients);

export const clients = reducer;

