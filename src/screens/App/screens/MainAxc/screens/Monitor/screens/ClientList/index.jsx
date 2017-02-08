import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import utils from 'shared/utils';
import validator from 'shared/validator';

// components
import AppScreen from 'shared/components/Template/AppScreen';
import Button from 'shared/components/Button/Button';

// custom
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';
import { getActionable } from 'shared/axc';

const flowRateFilter = utils.filter('flowRate:["KB"]');

const listOptions = fromJS([
  {
    id: 'devicename',
    text: _('Client'),
    transform(val, item) {
      return item.get('devicename') || item.get('mac');
    },
    validator: validator({
      rules: 'utf8Len:[1, 31]',
    }),
  }, {
    id: 'ip',
    text: _('IP Address'),
  }, {
    id: 'vendor',
    text: _('Vendor'),
  }, {
    id: 'terminalType',
    text: _('OS'),
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
    text: _('Data'),
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
    text: _('Online Time'),
    filter: 'connectTime',
  }, {
    id: '__action__',
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
const propTypes = {
  changeScreenActionQuery: PropTypes.func,
  onListAction: PropTypes.func,
};
const defaultProps = {};

// 原生的 react 页面
export default class Clients extends React.Component {
  constructor(props) {
    super(props);

    utils.binds(
      this, [
        'onAction',
        'initListOptions',
      ],
    );
  }

  componentWillMount() {
    this.initListOptions(this.props);
  }

  onAction(mac, actionType) {
    this.props.changeScreenActionQuery({
      action: actionType,
      operate: actionType,
      mac,
    });
    this.props.onListAction();
  }
  initListOptions(props) {
    const actionable = getActionable(props);

    // 所有组
    if (props.groupid === -100 || !actionable) {
      this.listOptions = listOptions.delete(-1);

    //
    } else {
      this.listOptions = listOptions.setIn([-1, 'transform'],
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
              {/*
              <Button
                icon="repeat"
                size="sm"
                text={msg.reconnect}
                style={styles.actionButton}
                onClick={() => this.onAction(mac, 'reconnect')}
              />
              */}
            </div>
          );
        },
      );
    }
  }
  render() {
    return (
      <AppScreen
        {...this.props}
        listOptions={this.listOptions}
        searchable
      />
    );
  }
}

Clients.propTypes = propTypes;
Clients.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    store: state.screens,
    groupid: state.product.getIn(['group', 'selected', 'id']),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    screenActions,
  ), dispatch);
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Clients);

