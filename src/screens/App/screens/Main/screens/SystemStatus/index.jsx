import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { fromJS, Map } from 'immutable';
import { connect } from 'react-redux';
import { FormGroup, Button } from 'shared/components';
import Table from 'shared/components/Table';
import utils from 'shared/utils';
import * as sharedActions from 'shared/actions/settings';
import * as appActions from 'shared/actions/app';
import reducer from './reducer.js';

const flowRateFilter = utils.filter('flowRate');
const propTypes = {
  store: PropTypes.instanceOf(Map),
  route: PropTypes.object,
  initSettings: PropTypes.func,
  fetchSettings: PropTypes.func,

  updateItemSettings: PropTypes.func,
  leaveSettingsScreen: PropTypes.func,
  app: PropTypes.instanceOf(Map),
};
let a;

const defaultProps = {};

const interfaceOptions = fromJS([
  {
    id: 'name',
    text: _('Name'),
    transform(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
  }, {
    id: 'txBytes',
    text: _('Tx Bytes'),
    transform(val) {
      if (val === '') {
        return '--';
      }
      return flowRateFilter.transform(val);
    },
  }, {
    id: 'rxBytes',
    text: _('Rx Bytes'),
    transform(val) {
      if (val === '') {
        return '--';
      }
      return flowRateFilter.transform(val);
    },
  }, {
    id: 'txPackets',
    text: _('Tx Packets'),
    transform(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
  }, {
    id: 'rxPackets',
    text: _('Rx Packets'),
    transform(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
  }, {
    id: 'txErrorPackets',
    text: _('Tx Error'),
    transform(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
  }, {
    id: 'rxErrorPackets',
    text: _('Rx Error'),
    transform(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
  },
]);

export default class SystemStatus extends React.Component {

  constructor(props) {
    super(props);
    this.changeSystemTimeToReadable = this.changeSystemTimeToReadable.bind(this);
    this.changeUptimeToReadable = this.changeUptimeToReadable.bind(this);
  }


  componentWillMount() {
    clearInterval(a);
    // 必须要有初始化，因为要在settings中插入一个由该页面id命名的对象
    this.props.initSettings({
      settingId: this.props.route.id,
      fetchUrl: this.props.route.fetchUrl,
      defaultData: {},
    });
    this.props.fetchSettings();
    a = setInterval(this.props.fetchSettings, 10000);
  }

  componentDidUpdate(prevProps) {
    // console.log('app.refreshAt', this.props.app.get('refreshAt'));
    // console.log('prevProps.app.refreshAt', prevProps.app.get('refreshAt'));
    if (this.props.app.get('refreshAt') !== prevProps.app.get('refreshAt')) {
      // console.log('refresh');
      clearInterval(a);
      this.props.fetchSettings();
      a = setInterval(this.props.fetchSettings, 10000);
    }
  }

  componentWillUnmount() {
    // console.log('interval', a);
    clearInterval(a);
    this.props.leaveSettingsScreen();
  }

  changeSystemTimeToReadable(time) {
    return new Date(parseInt(time, 10))
            .toLocaleString()
            .replace(/年|月/g, '-')
            .replace(/日/g, ' ');
  }

  changeUptimeToReadable(time) {
    let timeStr = '';
    const t = parseInt(time, 10);
    const days = Math.floor(t / (24 * 3600));
    const hours = Math.floor((t - (days * 24 * 3600)) / 3600);
    const minutes = Math.floor((t - (days * 24 * 3600) - (hours * 3600)) / 60);
    const seconds = Math.floor((t - (days * 24 * 3600) - (hours * 3600) - (minutes * 60)) % 60);
    if (days > 0) {
      timeStr = days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's ';
    } else if (hours > 0) {
      timeStr = hours + 'h ' + minutes + 'm ' + seconds + 's ';
    } else if (minutes > 0) {
      timeStr = minutes + 'm ' + seconds + 's ';
    }
    return timeStr;
  }

  render() {
    const that = this;
    const clientOptions = fromJS([
      {
        id: 'mac',
        text: 'Mac',
      },
      {
        id: 'deviceName',
        text: _('Device Name'),
        transform(val) {
          if (val === '') {
            return '--';
          }
          return val;
        },
      },
      {
        id: 'signal',
        text: _('Signal(dBm)'),
        transform(val) {
          if (val === '') {
            return '--';
          }
          return val;
        },
      },
      {
        id: 'noise',
        text: _('Noise(dBm)'),
        transform(val) {
          if (val === '') {
            return '--';
          }
          return val;
        },
      },
      {
        id: 'txRate',
        text: _('Tx Rate'),
        transform(val) {
          if (val === '') {
            return '--';
          }
          return val + 'Mbps';
        },
      },
      {
        id: 'rxRate',
        text: _('Rx Rate'),
        transform(val) {
          if (val === '') {
            return '--';
          }
          return val + 'Mbps';
        },
      },
      {
        id: 'txBytes',
        text: _('Tx Bytes'),
        transform(val) {
          if (val === '') {
            return '--';
          }
          return flowRateFilter.transform(val);
        },
      },
      {
        id: 'rxBytes',
        text: _('Rx Bytes'),
        transform(val) {
          if (val === '') {
            return '--';
          }
          return flowRateFilter.transform(val);
        },
      },
      {
        id: 'txPackets',
        text: _('Tx Packets'),
        transform(val) {
          if (val === '') {
            return '--';
          }
          return val;
        },
      },
      {
        id: 'rxPackets',
        text: _('Rx Packets'),
        transform(val) {
          if (val === '') {
            return '--';
          }
          return val;
        },
      },
      {
        id: 'connectTime',
        text: _('Connect Time'),
        transform(val) {
          if (val === '') {
            return '--';
          }
          return that.changeUptimeToReadable(val);
        },
      },
      {
        id: 'ipAddr',
        text: _('IP'),
        transform(val) {
          if (val === '') {
            return '--';
          }
          return val;
        },
      },
    ]);
    const remoteApOption = fromJS([
      {
        id: 'deviceName',
        text: _('Device Name'),
        transform(val) {
          if (val === '') {
            return '--';
          }
          return val;
        },
      }, {
        id: 'softVersion',
        text: _('Soft Version'),
        transform(val) {
          if (val === '') {
            return '--';
          }
          return val;
        },
      }, {
        id: 'connectTime',
        text: _('Connect Time'),
        transform(val) {
          return that.changeUptimeToReadable(val);
        },
      }, {
        id: 'signal',
        text: _('Signal(dBm)'),
        transform(val) {
          if (val === '') {
            return '--';
          }
          return val;
        },
      }, {
        id: 'txBytes',
        text: _('Tx Bytes'),
        transform(val) {
          if (val === '') {
            return '--';
          }
          return flowRateFilter.transform(val);
        },
      }, {
        id: 'rxBytes',
        text: _('Rx Bytes'),
        transform(val) {
          if (val === '') {
            return '--';
          }
          return flowRateFilter.transform(val);
        },
      }, {
        id: 'txRate',
        text: _('Tx Rate'),
        transform(val) {
          if (val === '') {
            return '--';
          }
          return val + 'Mbps';
        },
      }, {
        id: 'rxRate',
        text: _('Rx Rate'),
        transform(val) {
          if (val === '') {
            return '--';
          }
          return val + 'Mbps';
        },
      }, {
        id: 'txPackets',
        text: _('Tx Packets'),
        transform(val) {
          if (val === '') {
            return '--';
          }
          return val;
        },
      }, {
        id: 'rxPackets',
        text: _('Rx Packets'),
        transform(val) {
          if (val === '') {
            return '--';
          }
          return val;
        },
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
    const {
      status, wirelessMode,
    } = this.props.store.get('curData').toJS();
    if (status === undefined) {
      return null;
    }
    const {
      deviceModel, deviceName, networkMode, security, version,
      systemTime, frequency, channelWidth, uptime, ap, channel,
      interfaces, station, wlan0Mac, protocol, lan0Mac, lan1Mac,
      ssid, distance, txPower, noise, ccq, chutil,
     } = status;
    let apMac; let clientNum; let staList; let signal;
    let apInfo = [];
    if (ap !== undefined) {
      apMac = ap.apMac;
      clientNum = ap.clientNum;
      staList = ap.staList;
    }
    if (station !== undefined) {
      signal = station.signal;
      const item = station.apInfo;
      apInfo.push(item);
    }
    // console.log(status, deviceModel);
    // curData = this.props.store.getIn(['curData']);
    // const {
    //   deviceModel,
    // } = this.props.store.getIn(['curData', 'status']).toJS();

    // const wirelessMode = this.props.store.getIn(['curData', 'wirelessMode']);
    return (
      <div className="">
      {
        this.props.app.get('fetching') ? (
          <div className="o-modal" role="message">
            <div className="o-modal__backdrop"></div>
            <div className="o-modal__message">
              <div className="o-modal__content">
                <div className="o-modal__clarbody">
                  <h3>Axilspot</h3>
                  <span className="fa fa-spinner fa-spin" style={{color: '#0093dd', marginLeft: '5px'}}></span>
                </div>
              </div>
            </div>
          </div>
        ) : null
      }
        <div className="stats-group">
          <div className="stats-group-cell">
            <h3>{_('System Status')}</h3>
          </div>
          <div className="stats-group-cell">
            <div className="row">
              <div className="cols col-5">
                <FormGroup
                  type="plain-text"
                  label={_('Device Model :')}
                  value={deviceModel}
                />
                <FormGroup
                  label={_('Network Mode :')}
                  type="plain-text"
                  value={networkMode}
                />
                <FormGroup
                  label={_('System Uptime :')}
                  id="uptime"
                  type="plain-text"
                  value={this.changeUptimeToReadable(uptime)}
                />
                <FormGroup
                  label={`${_('WLAN0 MAC')} :`}
                  type="plain-text"
                  value={wlan0Mac}
                />
                <FormGroup
                  label={`${_('LAN1 MAC')} :`}
                  type="plain-text"
                  value={lan1Mac}
                />

              </div>
              <div className="cols col-6">
                <FormGroup
                  label={_('Device Name :')}
                  type="plain-text"
                  value={deviceName}
                />
                <FormGroup
                  label={_('Firmware Version :')}
                  type="plain-text"
                  value={version}
                />
                <FormGroup
                  label={_('System Time :')}
                  id="systemtime"
                  type="plain-text"
                  value={this.changeSystemTimeToReadable(systemTime)}
                />
                <FormGroup
                  label={`${_('LAN0 MAC')} :`}
                  type="plain-text"
                  value={lan0Mac}
                />
                {
                  ap === undefined ? null : (
                    <FormGroup
                      label={_('Client Number :')}
                      id="userNumber"
                      type="plain-text"
                      value={this.props.store.getIn(['curData', 'status', 'ap', 'clientNum'])}
                    />
                  )
                }
              </div>
            </div>
          </div>
          <div className="stats-group-cell">
            <h3>{_('Radio')}</h3>
          </div>
          <div className="stats-group-cell">
            <div className="row">
              <div className="cols col-5">
                <FormGroup
                  label={_('Wireless Model :')}
                  type="plain-text"
                  value={wirelessMode === 'sta' ? 'station' : wirelessMode}
                />
                <FormGroup
                  label={_('SSID :')}
                  type="plain-text"
                  value={ssid}
                />
                <FormGroup
                  label={_('Protocol :')}
                  type="plain-text"
                  value={protocol}
                />
                <FormGroup
                  label={_('Channel/Frequency :')}
                  type="plain-text"
                  value={frequency}
                />
                <FormGroup
                  label={_('Channel Width :')}
                  type="plain-text"
                  value={channelWidth}
                />
                <FormGroup
                  label={_('Security Mode :')}
                  type="plain-text"
                  value={security}
                />
              </div>
              <div className="cols col-6">
                <FormGroup
                  label={_('Distance :')}
                  type="plain-text"
                  value={distance}
                  help="km"
                />
                <FormGroup
                  label={_('Tx Power :')}
                  type="plain-text"
                  value={txPower}
                  help="dBm"
                />
                <FormGroup
                  label={_('Signal :')}
                  type="plain-text"
                  value={status.signal}
                  help="dBm"
                />
                <FormGroup
                  label={_('Noise :')}
                  type="plain-text"
                  value={noise}
                  help="dBm"
                />
                <FormGroup
                  label={_('CCQ :')}
                  type="plain-text"
                  value={ccq}
                />
                <FormGroup
                  label={_('Channel Utilization :')}
                  type="plain-text"
                  value={chutil}
                />
              </div>
            </div>
          </div>
          <h3 className="stats-group-cell">{_('Interfaces')}</h3>
          <div className="stats-group-cell">
            <Table
              className="table"
              options={interfaceOptions}
              list={interfaces}
            />
          </div>
          {
            ap === undefined ? null : (
              <div className="clientListTable">
                <h3 className="stats-group-cell">{_('Clients')}</h3>
                <div className="stats-group-cell">
                  <Table
                    className="table"
                    options={clientOptions}
                    list={staList}
                  />
                </div>
              </div>
            )
          }
          {
            station === undefined ? null : (
              <div className="remoteApTable">
                <h3 className="stats-group-cell">{_('Remote AP Info')}</h3>
                <div className="stats-group-cell">
                  <Table
                    className="table"
                    options={remoteApOption}
                    list={apInfo}
                  />
                </div>
              </div>
            )
          }
        </div>
      </div>
    );
  }
}

SystemStatus.propTypes = propTypes;
SystemStatus.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    store: state.settings,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    utils.extend({}, appActions, sharedActions),
    dispatch
  );
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(SystemStatus);

export const systemstatus = reducer;
