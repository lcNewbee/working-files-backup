import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Table from 'shared/components/Table';
import Button from 'shared/components/Button/Button';
import Icon from 'shared/components/Icon';
import FormGroup from 'shared/components/Form/FormGroup';
import { fromJS, Map } from 'immutable';
import utils from 'shared/utils';
import * as sharedActions from 'shared/actions/settings';
import * as appActions from 'shared/actions/app';
import * as selfActions from './actions';
import reducer from './reducer';

let intervalAction;
let timeoutAction;
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

function wirelessModeShowStyle(wirelessMode) {
  let ret = '';
  switch (wirelessMode) {
    case 'sta':
      ret = 'Station'; break;
    case 'repeater':
      ret = 'Repeater'; break;
    case 'ap':
      ret = 'AP'; break;
    default:
  }
  return ret;
}

const vapInterfaceOptions = fromJS([
  {
    id: 'name',
    text: _('Name'),
    transform(val, item) {
      const ssid = item.get('ssid');
      if (val === '') {
        return `--(${ssid})`;
      }
      return `${val}(${ssid})`;
    },
    width: '152px',
  }, {
    id: 'mac',
    text: _('MAC'),
    sortable: true,
    transform(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
    width: '152px',
  }, {
    id: 'txBytes',
    text: _('Tx Data'),
    sortable: true,
    sortFun: (a, b) => {
      const aVal = parseInt(a, 10);
      const bVal = parseInt(b, 10);
      if (aVal - bVal < 0) return 1;
      return -1;
    },
    transform(val) {
      if (val === '') {
        return '--';
      }
      return flowRateFilter.transform(val);
    },
    width: '144px',
  }, {
    id: 'rxBytes',
    text: _('Rx Data'),
    sortable: true,
    sortFun: (a, b) => {
      const aVal = parseInt(a, 10);
      const bVal = parseInt(b, 10);
      if (aVal - bVal < 0) return 1;
      return -1;
    },
    transform(val) {
      if (val === '') {
        return '--';
      }
      return flowRateFilter.transform(val);
    },
    width: '144px',
  }, {
    id: 'txPackets',
    text: _('Tx Packets'),
    transform(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
    width: '144px',
  }, {
    id: 'rxPackets',
    text: _('Rx Packets'),
    transform(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
    width: '144px',
  }, {
    id: 'txErrorPackets',
    text: _('Tx Errors'),
    transform(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
    width: '144px',
  }, {
    id: 'rxErrorPackets',
    text: _('Rx Errors'),
    transform(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
    width: '144px',
  }, {
    id: 'ccq',
    text: _('CCQ'),
    transform(val) {
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
    this.onChangeRadio = this.onChangeRadio.bind(this);
    this.updateBlockStatus = this.updateBlockStatus.bind(this);
    this.refreshData = this.refreshData.bind(this);
  }

  componentWillMount() {
    clearInterval(intervalAction);
    clearTimeout(timeoutAction);
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
    intervalAction = setInterval(() => { this.refreshData(); }, 10000);
  }

  componentDidUpdate(prevProps) {
    if (this.props.app.get('refreshAt') !== prevProps.app.get('refreshAt')) {
      clearInterval(intervalAction);
      clearTimeout(timeoutAction);
      this.refreshData();
      intervalAction = setInterval(this.refreshData, 10000);
    }
  }

  componentWillUnmount() {
    clearInterval(intervalAction);
    clearTimeout(timeoutAction);
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
                          .map(item => item.set('block', false));
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
        text: _('Device Name'),
        transform(val) {
          if (val === '' || val === undefined) {
            return '--';
          }
          return val;
        },
      },
      {
        id: 'ssid',
        text: _('Owner SSID'),
        sortable: true,
        transform(val) {
          if (val === '' || val === undefined) {
            return '--';
          }
          return val;
        },
      },
      {
        id: 'signal',
        text: _('Signal(dBm)'),
        transform(val) {
          if (val === '' || val === undefined) {
            return '--';
          }
          return val;
        },
      },
      {
        id: 'noise',
        text: _('Noise(dBm)'),
        transform(val) {
          if (val === '' || val === undefined) {
            return '--';
          }
          return val;
        },
      },
      {
        id: 'txRate',
        text: _('Tx Rate'),
        transform(val) {
          if (val === '' || val === undefined) {
            return '--';
          }
          return `${val}Mbps`;
        },
      },
      {
        id: 'rxRate',
        text: _('Rx Rate'),
        transform(val) {
          if (val === '' || val === undefined) {
            return '--';
          }
          return `${val}Mbps`;
        },
      },
      {
        id: 'txBytes',
        text: _('Tx Data'),
        sortFun: (a, b) => {
          const aVal = parseInt(a, 10);
          const bVal = parseInt(b, 10);
          if (aVal - bVal < 0) return 1;
          return -1;
        },
        sortable: true,
        transform(val) {
          if (val === '' || val === undefined) {
            return '--';
          }
          return flowRateFilter.transform(val);
        },
      },
      {
        id: 'rxBytes',
        text: _('Rx Data'),
        sortFun: (a, b) => {
          const aVal = parseInt(a, 10);
          const bVal = parseInt(b, 10);
          if (aVal - bVal < 0) return 1;
          return -1;
        },
        sortable: true,
        transform(val) {
          if (val === '' || val === undefined) {
            return '--';
          }
          return flowRateFilter.transform(val);
        },
      },
      {
        id: 'txPackets',
        text: _('Tx Packets'),
        transform(val) {
          if (val === '' || val === undefined) {
            return '--';
          }
          return val;
        },
      },
      {
        id: 'rxPackets',
        text: _('Rx Packets'),
        transform(val) {
          if (val === '' || val === undefined) {
            return '--';
          }
          return val;
        },
      },
      {
        id: 'connectTime',
        text: _('Connect Time'),
        transform(val) {
          if (val === '' || val === undefined) {
            return '--';
          }
          return changeUptimeToReadable(val);
        },
      },
      {
        id: 'ipAddr',
        text: _('IP'),
        sortable: true,
        transform(val) {
          if (val === '' || val === undefined) {
            return '--';
          }
          return val;
        },
      },
      {
        id: 'block',
        text: _('Block'),
        transform(val, item) {
          return (
            val ? (
              <span>{_('offline')}</span>
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
                      clearInterval(intervalAction);
                      clearTimeout(timeoutAction);
                      timeoutAction = setTimeout(() => { // 停止10秒再刷新，留足时间让用户下线
                        intervalAction = setInterval(that.refreshData, 10000);
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
    const { radioId, radioType } = this.props.selfState.get('currRadioConfig').toJS();
    if (!this.props.store.getIn(['curData', 'radioList', radioId, 'staList'])) return null;
    // const { wirelessMode, vapList } = this.props.store.getIn(['curData', 'radioList', radioId]).toJS();
    const staList = this.props.store.getIn(['curData', 'radioList', radioId, 'staList']).toJS();
    // const radioList = this.props.store.getIn(['curData', 'radioList']);
    const { wirelessMode, vapList } = this.props.store.getIn(['curData', 'radioList', radioId]).toJS();
    const vapInterfacesList = (wirelessMode === 'sta') ? [vapList[0]] : vapList;
    return (
      <div className="o-box">
        <Button
          text={_('Back')}
          theme="primary"
          style={{
            marginBottom: '15px',
          }}
          onClick={() => {
            window.location.href = '#/main/status/overview';
          }}
        />
        <div className="row">
          {/*
            <div className="o-box__cell">
              <h3>{`${_('Radio')} (${this.props.product.getIn(['radioSelectOptions', radioId, 'label'])})`}</h3>
            </div>
            <div className="o-box__cell">
              <div className="cols col-6">
                <FormGroup
                  label={_('Wireless Mode :')}
                  type="plain-text"
                  value={wirelessModeShowStyle(radioList.getIn([radioId, 'wirelessMode']))}
                />
                <FormGroup
                  label={_('Protocol :')}
                  type="plain-text"
                  value={radioList.getIn([radioId, 'radioMode'])}
                />
                <FormGroup
                  label={_('Channel/Frequency :')}
                  type="plain-text"
                  value={`${radioList.getIn([radioId, 'channel'])}/${radioList.getIn([radioId, 'frequency'])}`}
                />
                <FormGroup
                  label={_('Channel Width :')}
                  type="plain-text"
                  value={radioList.getIn([radioId, 'channelWidth'])}
                />
              </div>
              <div className="cols col-6">
                <FormGroup
                  label={_('Distance :')}
                  type="plain-text"
                  value={radioList.getIn([radioId, 'distance'])}
                  help="km"
                />
                <FormGroup
                  label={_('Tx Power :')}
                  type="plain-text"
                  value={radioList.getIn([radioId, 'txPower'])}
                  help="dBm"
                />
                <FormGroup
                  label={_('Signal :')}
                  type="plain-text"
                  value={radioList.getIn([radioId, 'signal'])}
                  help="dBm"
                />
                <FormGroup
                  label={_('Noise :')}
                  type="plain-text"
                  value={radioList.getIn([radioId, 'noise'])}
                  help="dBm"
                />
                <FormGroup
                  label={_('Channel Utilization :')}
                  type="plain-text"
                  value={radioList.getIn([radioId, 'chutil'])}
                />
              </div>
            </div>
          */}

        </div>

        <div className="o-box__cell">
          <h3>
            {_('Wireless Interfaces')}
          </h3>
        </div>
        <div className="o-box__cell">
          <Table
            className="table"
            options={vapInterfaceOptions}
            list={vapInterfacesList}
          />
        </div>

        <div className="o-box__cell">
          <h3>
            {`${_('Clients')} (${this.props.product.getIn(['radioSelectOptions', radioId, 'label'])})`}
          </h3>
        </div>
        <div className="o-box__cell">
          <Table
            className="table"
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
