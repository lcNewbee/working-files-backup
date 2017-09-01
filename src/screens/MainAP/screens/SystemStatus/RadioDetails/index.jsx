import React from 'react'; import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Table from 'shared/components/Table';
import Button from 'shared/components/Button/Button';
import Icon from 'shared/components/Icon';
import { fromJS, Map } from 'immutable';
import utils from 'shared/utils';
import { actions as sharedActions } from 'shared/containers/settings';
import { actions as appActions } from 'shared/containers/app';
import * as selfActions from './actions';
import reducer from './reducer';

const flowRateFilter = utils.filter('flowRate');

const propTypes = {
  selfState: PropTypes.instanceOf(Map),
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
  initSettings: PropTypes.func,
  fetchSettings: PropTypes.func,
  route: PropTypes.object,
  product: PropTypes.instanceOf(Map),
  changeCurrRadioConfig: PropTypes.func,
  updateItemSettings: PropTypes.func,
  radioIdFromUpper: PropTypes.string,
};

const defaultProps = {
};

function changeUptimeToReadable(time) {
  let timeStr = '';
  const t = parseInt(time, 10);
  const days = Math.floor(t / (24 * 3600));
  const hours = Math.floor((t - (days * 24 * 3600)) / 3600);
  const minutes = Math.floor((t - (days * 24 * 3600) - (hours * 3600)) / 60);
  const seconds = Math.floor((t - (days * 24 * 3600) - (hours * 3600) - (minutes * 60)) % 60);
  if (days > 0) {
    timeStr = `${days}d ${hours}h ${minutes}m ${seconds}s `;
  } else if (hours > 0) {
    timeStr = `${hours}h ${minutes}m ${seconds}s `;
  } else if (minutes > 0) {
    timeStr = `${minutes}m ${seconds}s `;
  } else {
    timeStr = `${seconds}s`;
  }
  return timeStr;
}

// function wirelessModeShowStyle(wirelessMode) {
//   let ret = '';
//   switch (wirelessMode) {
//     case 'sta':
//       ret = 'Station'; break;
//     case 'repeater':
//       ret = 'Repeater'; break;
//     case 'ap':
//       ret = 'AP'; break;
//     default:
//   }
//   return ret;
// }

const vapInterfaceOptions = fromJS([
  {
    id: 'name',
    text: __('Name'),
    render(val, item) {
      const ssid = item.get('ssid');
      if (val === '') {
        return `--(${ssid})`;
      }
      return `${val}(${ssid})`;
    },
    width: '152px',
  }, {
    id: 'mac',
    text: __('MAC'),
    sortable: true,
    render(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
    width: '152px',
  }, {
    id: 'txBytes',
    text: __('Tx Data'),
    sortable: true,
    sortFun: (a, b) => {
      const aVal = parseInt(a, 10);
      const bVal = parseInt(b, 10);
      if (aVal - bVal < 0) return 1;
      return -1;
    },
    render(val) {
      if (val === '') {
        return '--';
      }
      return flowRateFilter.transform(val);
    },
    width: '144px',
  }, {
    id: 'rxBytes',
    text: __('Rx Data'),
    sortable: true,
    sortFun: (a, b) => {
      const aVal = parseInt(a, 10);
      const bVal = parseInt(b, 10);
      if (aVal - bVal < 0) return 1;
      return -1;
    },
    render(val) {
      if (val === '') {
        return '--';
      }
      return flowRateFilter.transform(val);
    },
    width: '144px',
  }, {
    id: 'txPackets',
    text: __('Tx Packets'),
    render(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
    width: '144px',
  }, {
    id: 'rxPackets',
    text: __('Rx Packets'),
    render(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
    width: '144px',
  }, {
    id: 'txErrorPackets',
    text: __('Tx Errors'),
    render(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
    width: '144px',
  }, {
    id: 'rxErrorPackets',
    text: __('Rx Errors'),
    render(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
    width: '144px',
  }, {
    id: 'ccq',
    text: __('CCQ'),
    render(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
  },
]);

export default class RadioDetails extends React.Component {
  constructor(props) {
    super(props);
    utils.binds(this, ['onChangeRadio', 'updateBlockStatus', 'refreshData']);
  }

  componentWillMount() {
    clearInterval(this.intervalAction);
    clearTimeout(this.timeoutAction);
    this.props.initSettings({
      settingId: this.props.route.id,
      fetchUrl: this.props.route.fetchUrl,
      defaultData: {},
    });
    Promise.resolve().then(() => {
      const id = this.props.radioIdFromUpper;
      this.onChangeRadio({ value: id });
    }).then(() => {
      this.refreshData();
    });
    this.intervalAction = setInterval(() => { this.refreshData(); }, 10000);
  }

  componentDidUpdate(prevProps) {
    if (this.props.app.get('refreshAt') !== prevProps.app.get('refreshAt')) {
      clearInterval(this.intervalAction);
      clearTimeout(this.timeoutAction);
      this.refreshData();
      this.intervalAction = setInterval(this.refreshData, 10000);
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalAction);
    clearTimeout(this.timeoutAction);
  }

  onChangeRadio(data) { // 注意参数实际是data的value属性，这里表示radio序号
    const radioType = this.props.product.getIn(['deviceRadioList', data.value, 'radioType']);
    const config = fromJS({
      radioId: data.value,
      radioType,
    });
    this.props.changeCurrRadioConfig(config);
  }

  refreshData() {
    this.props.fetchSettings().then(() => {
      const radioNum = this.props.product.get('deviceRadioList').size;
      for (let i = 0; i < radioNum; i++) {
        const staList = this.props.store.getIn(['curData', 'radioList', i, 'staList'])
                          .map((item, j) => item.set('block', false).set('num', j + 1));
        const radioList = this.props.store.getIn(['curData', 'radioList']).setIn([i, 'staList'], staList);
        this.props.updateItemSettings({ radioList });
      }
    });
  }

  updateBlockStatus(item) {
    const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
    const staList = this.props.store.getIn(['curData', 'radioList', radioId, 'staList']);
    const index = staList.indexOf(item);
    const radioList = this.props.store.getIn(['curData', 'radioList'])
                          .setIn([radioId, 'staList', index, 'block'], true);
    this.props.updateItemSettings({ radioList });
  }

  render() {
    const that = this;
    const clientOptions = fromJS([
      {
        id: 'mac',
        text: 'MAC',
        sortable: true,
      },
      {
        id: 'deviceName',
        text: __('Device Name'),
        render(val) {
          if (val === '' || val === undefined) {
            return '--';
          }
          return val;
        },
      },
      {
        id: 'ssid',
        text: __('Owner SSID'),
        sortable: true,
        render(val) {
          if (val === '' || val === undefined) {
            return '--';
          } else if (val.length > 12) {
            return `${val.slice(0, 6)}...${val.slice(-3)}`;
          }
          return val;
        },
        getTitle(val, item) {
          return item.get('ssid');
        },
      },
      {
        id: 'signal',
        text: __('Signal(dBm)'),
        render(val) {
          if (val === '' || val === undefined) {
            return '--';
          }
          return val;
        },
      },
      {
        id: 'noise',
        text: __('Noise(dBm)'),
        render(val) {
          if (val === '' || val === undefined) {
            return '--';
          }
          return val;
        },
      },
      {
        id: 'txRate',
        text: __('Tx Rate'),
        render(val) {
          if (val === '' || val === undefined) {
            return '--';
          }
          return `${val}Mbps`;
        },
      },
      {
        id: 'rxRate',
        text: __('Rx Rate'),
        render(val) {
          if (val === '' || val === undefined) {
            return '--';
          }
          return `${val}Mbps`;
        },
      },
      {
        id: 'txBytes',
        text: __('Tx Data'),
        sortFun: (a, b) => {
          const aVal = parseInt(a, 10);
          const bVal = parseInt(b, 10);
          if (aVal - bVal < 0) return 1;
          return -1;
        },
        sortable: true,
        render(val) {
          if (val === '' || val === undefined) {
            return '--';
          }
          return flowRateFilter.transform(val);
        },
      },
      {
        id: 'rxBytes',
        text: __('Rx Data'),
        sortFun: (a, b) => {
          const aVal = parseInt(a, 10);
          const bVal = parseInt(b, 10);
          if (aVal - bVal < 0) return 1;
          return -1;
        },
        sortable: true,
        render(val) {
          if (val === '' || val === undefined) {
            return '--';
          }
          return flowRateFilter.transform(val);
        },
      },
      {
        id: 'txPackets',
        text: __('Tx Packets'),
        render(val) {
          if (val === '' || val === undefined) {
            return '--';
          }
          return val;
        },
      },
      {
        id: 'rxPackets',
        text: __('Rx Packets'),
        render(val) {
          if (val === '' || val === undefined) {
            return '--';
          }
          return val;
        },
      },
      {
        id: 'connectTime',
        text: __('Connect Time'),
        render(val) {
          if (val === '' || val === undefined) {
            return '--';
          }
          return changeUptimeToReadable(val);
        },
      },
      {
        id: 'ipAddr',
        text: __('IP'),
        sortable: true,
        render(val) {
          if (val === '' || val === undefined) {
            return '--';
          }
          return val;
        },
      },
      {
        id: 'block',
        text: __('Block'),
        render(val, item) {
          return (
            val ? (
              <span>{__('offline')}</span>
            ) : (
              <Icon
                name="user-times"
                size="lg"
                style={{
                  cursor: 'pointer',
                }}
                onClick={() => {
                  const query = {
                    vapId: item.get('vapId'),
                    radioId: that.props.selfState.getIn(['currRadioConfig', 'radioId']),
                    mac: item.get('mac'),
                  };
                  that.props.save('goform/kick_user_offline', query).then((json) => {
                    if (json.state && json.state.code === 2000) {
                      that.updateBlockStatus(item);
                      clearInterval(this.intervalAction);
                      clearTimeout(this.timeoutAction);
                      this.timeoutAction = setTimeout(() => { // 停止10秒再刷新，留足时间让用户下线
                        this.intervalAction = setInterval(that.refreshData, 10000);
                      }, 10000);
                    }
                  });
                }}
              />
            )
          );
        },
      },
    ]);
    const { radioId /* , radioType */ } = this.props.selfState.get('currRadioConfig').toJS();
    if (!this.props.store.getIn(['curData', 'radioList', radioId, 'staList'])) return null;
    const staList = this.props.store.getIn(['curData', 'radioList', radioId, 'staList']).toJS();
    // const radioList = this.props.store.getIn(['curData', 'radioList']);
    const { wirelessMode, vapList } = this.props.store.getIn(['curData', 'radioList', radioId]).toJS();
    const vapInterfacesList = (wirelessMode === 'sta') ? [vapList[0]] : vapList;
    return (
      <div className="o-box">
        <Button
          text={__('Back')}
          theme="primary"
          style={{
            marginBottom: '15px',
          }}
          onClick={() => {
            window.location.href = '#/main/status/overview';
          }}
        />
        <div className="o-box__cell">
          <h3>
            {`${__('Wireless Interfaces')} (${this.props.product.getIn(['radioSelectOptions', radioId, 'label'])})`}
            {/* {__('Wireless Interfaces')}*/}
          </h3>
        </div>
        <div className="o-box__cell">
          <Table
            options={vapInterfaceOptions}
            list={vapInterfacesList}
          />
        </div>

        <div className="o-box__cell">
          <h3>
            {`${__('Clients')} (${this.props.product.getIn(['radioSelectOptions', radioId, 'label'])})`}
          </h3>
        </div>
        <div className="o-box__cell">
          <Table
            options={clientOptions}
            list={staList}
          />
        </div>
      </div>
    );
  }
}

RadioDetails.propTypes = propTypes;
RadioDetails.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    selfState: state.ssiddetails,
    app: state.app,
    store: state.settings,
    product: state.product,
    radioIdFromUpper: state.systemstatus.getIn(['currRadioConfig', 'radioId']),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    utils.extend({}, appActions, sharedActions, selfActions),
    dispatch,
  );
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(RadioDetails);

export const radiodetails = reducer;
