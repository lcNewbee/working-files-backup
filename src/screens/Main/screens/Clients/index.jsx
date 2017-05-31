import React from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import utils from 'shared/utils';

// components
import Table from 'shared/components/Table';
import Button from 'shared/components/Button/Button';
import { Search } from 'shared/components/Form';
import Select from 'shared/components/Select';
import Switchs from 'shared/components/Switchs';
import PureComponent from 'shared/components/Base/PureComponent';

// custom
import * as actions from './actions';
import reducer from './reducer';

const flowRateFilter = utils.filter('flowRate:["KB"]');

const clientsTableOptions = fromJS([
  {
    id: 'devicename',
    text: __('MAC Address') + '/' + __('Name'),
    render(val, item) {
      return item.get('devicename') || item.get('mac');
    },
  }, {
    id: 'ip',
    text: __('IP Address'),
  }, {
    id: 'ssid',
    text: 'SSID',
  }, {
    id: 'connectap',
    text: __('Associated AP'),
    render(val, item) {
      return item.get('connectap') || item.get('apmac');
    },
  }, {
    id: 'bandwidth',
    text: __('Up/Down Flow'),
    render(val, item) {
      const upRate = flowRateFilter.transform(item.get('upstream'));
      const downRate = flowRateFilter.transform(item.get('downstream'));

      return upRate + '/' + downRate;
    },
  }, {
    id: 'rssi',
    text: __('RSSI'),
    render(val, item) {
      const intVal = parseInt(val, 10);
      let classNames = 'Icon Icon-block Icon-wifi';

      // 判断加密范式
      if (item.get('encryption') === 'none') {
        classNames += '-nopass';
      } else {
        classNames += '-pass';
      }

      if (intVal > 85) {
        classNames += '-0';
      } else if (intVal > 75) {
        classNames += '-1';
      } else if (intVal > 65) {
        classNames += '-2';
      } else {
        classNames += '-3';
      }

      // return <span className={classNames}></span>;
      return val;
    },
  },
  // {
  //   id: 'authtype',
  //   text: __('Authentication'),
  //   render(val, item) {
  //     var ret = val;

  //     if(val == '0') {
  //       ret = 'None';
  //     } else if (val === 'portal') {
  //       ret = 'Portal';
  //     }
  //     ret = __(ret);

  //     return ret;
  //   }
  // },
  {
    id: 'operationhours',
    text: __('Connect Time'),
    filter: 'connectTime',
  }, {
    id: 'op',
    width: 220,
    text: __('Actions'),
  },
]);

const msg = {
  TITLE: __('Clients Info'),
  reconnect: __('Reconnect'),
  lock: __('Lock'),
  unlock: __('Unlock'),
  perPage: __('Items per page: '),
};

const selectOptions = [
  { value: 20, label: msg.perPage + '20' },
  { value: 50, label: msg.perPage + '50' },
  { value: 100, label: msg.perPage + '100' },
];

const typeArr = [
  __('ALL'),
  __('WIRELESS'),
  __('WIRED'),
  __('GUEST'),
  __('BLOCKED/LAST APPEARED'),
];

const styles = {
  actionButton: {
    minWidth: '90px',
  },
};

// 原生的 react 页面
export class Clients extends PureComponent {
  constructor(props) {
    super(props);

    utils.binds(this, [
      'onAction',
      'onChangeSearchText',
      'onChangeType',
      'onChangeTableSize',
      'onPageChange',
      'handleSearch',
      'handleChangeQuery',
      'handleActions',
    ]);
  }

  componentWillMount() {
    this.handleSearch();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.app.get('refreshAt') !== this.props.app.get('refreshAt')) {
      this.handleSearch();
    }
  }

  componentWillUnmount() {
    this.props.leaveClientsScreen();
  }

  onAction(mac, action, wirelessType) {
    const subData = {
      action,
      macs: [
        mac,
      ],
    };

    if (typeof wirelessType === 'string') {
      subData.wirelessType = wirelessType;
    }

    this.handleActions(subData, true);
  }

  onChangeSearchText(val, e) {
    this.handleChangeQuery({
      search: val,
    });
  }

  onChangeType(data) {
    this.handleChangeQuery({
      type: data.value,
    }, true);
  }

  onChangeTableSize(data) {
    this.handleChangeQuery({
      size: data.value,
      page: 1,
    }, true);
  }

  onPageChange(i) {
    this.handleChangeQuery({
      page: i,
    }, true);
  }

  handleSearch() {
    this.props.fetchClients();
  }

  handleChangeQuery(data, needSearch) {
    this.props.changeClientsQuery(data);

    if (needSearch) {
      this.handleSearch();
    }
  }

  handleActions(actionQuery, needSave) {
    this.props.changeClientActionQuery(actionQuery);

    if (needSave) {
      this.props.saveClientsAction();
    }
  }

  render() {
    const noControl = this.props.app.get('noControl');
    // 添加操作项
    let options = clientsTableOptions.setIn([-1, 'render'],
      function (val, item) {
        const mac = item.get('mac');
        const status = item.get('status');
        const isLock = item.get('islock') === 'lock' ? true : false;

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
        );
      }.bind(this)
    );

    const blockOption = fromJS([
      {
        id: 'devicename',
        text: __('MAC Address') + '/' + __('Name'),
        render(val, item) {
          return item.get('devicename') || item.get('mac');
        },
      }, {
        id: 'vendor',
        text: __('Manufacturer'),
      }, {
        id: 'wirelessType',
        text: __('Type'),
        render(val, item) {
          const typeMap = {
            main: __('Main SSID'),
            guest: __('Guest SSID'),
          };

          return typeMap[val] || __('Main Wireless');
        },
      }, {
        id: 'apmac',
        text: __('Associated AP'),
      }, {
        id: 'bandwidth',
        text: __('Up/Down Speed'),
        render(val, item) {
          const upRate = flowRateFilter.transform(item.get('upstream'));
          const downRate = flowRateFilter.transform(item.get('downstream'));

          return upRate + '/' + downRate;
        },
      }, {
        id: 'lasttime',
        text: __('Last Seen'),
      }, {
        id: 'op',
        text: __('Actions'),
        render: function (val, item) {
          const deviceMac = item.get('mac');
          const status = item.get('status');
          const isLock = item.get('islock') === 'lock' ? true : false;

          if (status === 'disable' || noControl) {
            return null;
          }
          return (
            <Button
              icon="unlock"
              size="sm"
              text={msg.unlock}
              style={styles.actionButton}
              onClick={this.onAction.bind(this, deviceMac, 'unlock', item.get('wirelessType'))}
            />
          );
        }.bind(this),
      },
    ]);
    let tableOptions = options;

    if (this.props.query.get('type') == '4') {
      tableOptions = blockOption;
    }

    if (noControl) {
      options = options.delete(-1);
      tableOptions = tableOptions.delete(-1);
    }

    return (
      <div>
        <h2>{msg.TITLE}</h2>
        <div className="m-action-bar">
          <Search
            value={this.props.query.get('text')}
            onChange={this.onChangeSearchText}
            onSearch={this.handleSearch}
            placeholder={__('IP or MAC Address')}
          />
          <Switchs
            value={this.props.query.get('type')}
            options={typeArr}
            onChange={this.onChangeType}
          />
        </div>

        <Table
          className="table"
          options={tableOptions}
          list={this.props.data.get('list')}
          page={this.props.data.get('page')}
          size={this.props.query.get('size')}
          onPageChange={this.onPageChange}
          onPageSizeChange={this.onChangeTableSize}
          loading={this.props.fetching}
        />

      </div>
    );
  }
}

function mapStateToProps(state) {
  const myState = state.clients;

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
  actions,
)(Clients);

export const clients = reducer;

