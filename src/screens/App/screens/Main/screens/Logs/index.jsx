import React from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {fromJS} from 'immutable';

// components
import {Table} from 'shared/components/Table';
import Button from 'shared/components/Button';
import {Search} from 'shared/components/Form';
import Select from 'shared/components/Select';
import Switchs from 'shared/components/Switchs';

// custom
import * as actions from './actions';
import * as appActions from 'shared/actions/app';
import reducer from './reducer';

const logsTableOptions = fromJS([
  {
    id: 'time',
    text: _('Time'),
    width: '200'
  }, {
    id: 'type',
    text: _('Type'),
    width: '180',
    transform: function(val, item) {
      const typeMap = {
        ap: _('DEVICES'),
        client: _('CLIENTS'),
        group: _('Groups'),
        wireless: _('Wireless'),
        portal: _('Portal Settings'),
        guest: _('Guest Settings'),
        admin: _('Admin')
      };

      return typeMap[val] || val;
    }
  }, {
    id: 'loginfo',
    text: _('Describe'),
    transform: function(val, item) {
      var ret = _(utils.toCamel(item.get('logaction')));
      var logType = item.get('type');
      var groupname;
      var statusMap = {
        0: _('start'),
        1: _('success'),
        2: _('failed')
      }

      if(val && val.get) {

        if(val.get('groupname') === 'Default') {
          groupname = _('Ungrouped Devices');
        }

        ret += ': ' + (val.get('name') || groupname || val.get('mac') || '');

        if(val.get('status') !== undefined) {
          ret += ' ' + statusMap[val.get('status')];
        }
      }

      return ret;
    }
  }
]);

const msg = {
  TITLE: _('Logs Info'),
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
  _('DEVICES'),
  _('CLIENTS'),
  _('SETTINGS')
]);

const styles = {
  actionButton: {
    minWidth: "90px"
  }
}

// 原生的 react 页面
export const Logs = React.createClass({
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
    this.props.leaveLogsScreen();
  },


  handleSearch() {
    this.props.fetchLogs();
  },

  handleChangeQuery(data, needSearch) {
    this.props.changeLogsQuery(data);

    if(needSearch) {
      this.handleSearch();
    }
  },

  cleanAllLog() {
    var msg_text = _('Are you sure to clean all logs?');

    this.props.createModal({
      id: 'Logs',
      role: 'comfirm',
      title: _('CONFIRM'),
      text: msg_text,
      apply: function() {
        this.props.cleanAllLog();
      }.bind(this)
    });
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
    const options = logsTableOptions;
    const { query, data, fetching } = this.props;
    const {
      onChangeSearchText,
      handleSearch,
      onChangeType,
      onChangeTableSize,
      onPageChange
    } = this;

    return (
      <div className="page-device">
        <h2>{msg.TITLE}</h2>
        <div className="clearfix">
          <Switchs
            className="fl"
            options={typeArr}
            value={this.props.query.get('type')}
            onChange={this.onChangeType}
          />

          <Button
            className="fl"
            text={_("Clean All Logs")}
            icon="trash"
            role="danger"
            onClick={this.cleanAllLog}
          />
          <Select
            className="fr"
            clearable={false}
            value={query.get('size')}
            onChange={onChangeTableSize}
            options={selectOptions}
            searchable={false}
          />

        </div>

        <Table
          className="table"
          options={options}
          list={data.get('list')}
          page={data.get('page')}
          onPageChange={onPageChange}
          loading={fetching}
        />

      </div>
    );
  }
});

function mapStateToProps(state) {
  var myState = state.logs;

  return {
    app: state.app,
    fetching: myState.get('fetching'),
    query: myState.get('query'),
    updateAt: myState.get('updateAt'),
    data: myState.get('data'),
    page: myState.get('page')
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    actions
  ), dispatch)
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(Logs);

export const logs = reducer;

