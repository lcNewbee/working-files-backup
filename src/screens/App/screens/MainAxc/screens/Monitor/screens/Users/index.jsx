import React from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import utils from 'shared/utils';

// components
import PureComponent from 'shared/components/Base/PureComponent';
import ListInfo from 'shared/components/Template/ListInfo';
import Button from 'shared/components/Button/Button';

// custom
import * as screenActions from 'shared/actions/screens';

const flowRateFilter = utils.filter('flowRate:["KB"]');

const clientsTableOptions = fromJS([
  {
    id: 'devicename',
    text: `${_('MAC')}/${_('Name')}`,
    transform(val, item) {
      return item.get('devicename') || item.get('mac');
    },
  }, {
    id: 'ip',
    text: _('IP'),
  }, {
    id: 'manufacturer',
    text: _('Manufacturer'),
  }, {
    id: 'terminalType',
    text: _('Terminal Type'),
  }, {
    id: 'type',
    text: _('User Type'),
  }, {
    id: 'ssid',
    text: 'SSID',
  }, {
    id: 'authType',
    text: _('Auth Type'),
  }, {
    id: 'connectap',
    text: _('Associated AP'),
    transform(val, item) {
      return item.get('connectap') || item.get('apmac');
    },
  }, {
    id: 'bandwidth',
    text: _('Up/Down Speed'),
    transform(val, item) {
      const upRate = flowRateFilter.transform(item.get('upstream'));
      const downRate = flowRateFilter.transform(item.get('downstream'));

      return `${upRate}/${downRate}`;
    },
  }, {
    id: 'rssi',
    text: _('RSSI'),
    transform(val, item) {
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

      return (
        <span
          title={`-${intVal}db`}
          style={{ cursor: 'pointer' }}
          className={classNames}
        />
      );
      // return val;
    },
  }, {
    id: 'operationhours',
    text: _('Connect Time'),
    filter: 'connectTime',
  }, {
    id: 'op',
    width: '220',
    text: _('Actions'),
  },
]);

const msg = {
  TITLE: _('User List'),
  reconnect: _('Reconnect'),
  wireless: _('WIRELESS'),
  lock: _('Lock'),
  unlock: _('Unlock'),
  perPage: _('Items per page: '),
};

const styles = {
  actionButton: {
    minWidth: '90px',
  },
};

// 原生的 react 页面
export default class Clients extends PureComponent {
  constructor(props) {
    super(props);

    utils.binds(
      this,
      [
        'onAction',
      ],
    );
  }
  render() {
    // 添加操作项
    const options = clientsTableOptions.setIn([-1, 'transform'],
      (val, item) => {
        const mac = item.get('mac');
        const isLock = item.get('islock') === 'lock';

        return (
          <div className="action-btns">
            {
              isLock ? (
                <Button
                  icon="unlock"
                  size="sm"
                  text={msg.unlock}
                  style={styles.actionButton}
                  onClick={() => this.onAction(mac, 'unlock')}
                />
              ) : (
                <Button
                  icon="lock"
                  size="sm"
                  text={msg.lock}
                  style={styles.actionButton}
                  onClick={() => this.onAction(mac, 'lock')}
                />
              )
            }
            <Button
              icon="repeat"
              size="sm"
              text={msg.reconnect}
              style={styles.actionButton}
              onClick={() => this.onAction(mac, 'reconnect')}
            />
          </div>
        );
      }
    );
    const tableOptions = options;

    return (
      <ListInfo
        {...this.props}
        tableOptions={tableOptions}
        searchable
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    app: state.app,
    groupid: state.product.getIn(['group', 'selected', 'id']),
    store: state.screens,
  };
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  screenActions
)(Clients);

