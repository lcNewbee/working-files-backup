import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { fromJS, Map } from 'immutable';
import { connect } from 'react-redux';
import { FormGroup, Button } from 'shared/components';
import Table from 'shared/components/Table';
import utils from 'shared/utils';
import { actions as sharedActions } from 'shared/containers/settings';
import { actions as appActions } from 'shared/containers/app';
import * as selfActions from './actions.js';
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
  changeFirstRefresh: PropTypes.func,
};
let a;

const defaultProps = {
  firstRefresh: true,
};

const interfaceOptions = fromJS([
  {
    id: 'name',
    text: __('Name'),
    transform(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
    width: '152px',
  }, {
    id: 'mac',
    text: __('MAC'),
    transform(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
    width: '152px',
  }, {
    id: 'txBytes',
    text: __('Tx Data'),
    transform(val) {
      if (val === '') {
        return '--';
      }
      return flowRateFilter.transform(val);
    },
    width: '144px',
  }, {
    id: 'rxBytes',
    text: __('Rx Data'),
    transform(val) {
      if (val === '') {
        return '--';
      }
      return flowRateFilter.transform(val);
    },
    width: '144px',
  }, {
    id: 'txPackets',
    text: __('Tx Packets'),
    transform(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
    width: '144px',
  }, {
    id: 'rxPackets',
    text: __('Rx Packets'),
    transform(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
    width: '144px',
  }, {
    id: 'txErrorPackets',
    text: __('Tx Errors'),
    transform(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
    width: '144px',
  }, {
    id: 'rxErrorPackets',
    text: __('Rx Errors'),
    transform(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
    width: '144px',
  }, {
    id: 'status',
    text: __('Status'),
    transform(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
  },
]);

const vapInterfaceOptions = fromJS([
  {
    id: 'name',
    text: __('Name'),
    transform(val, item) {
      const ssid = item.get('ssid');
      if (val === '') {
        return '--(' + ssid + ')';
      }
      return val + '(' + ssid + ')';
    },
    width: '152px',
  }, {
    id: 'mac',
    text: __('MAC'),
    transform(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
    width: '152px',
  }, {
    id: 'txBytes',
    text: __('Tx Data'),
    transform(val) {
      if (val === '') {
        return '--';
      }
      return flowRateFilter.transform(val);
    },
    width: '144px',
  }, {
    id: 'rxBytes',
    text: __('Rx Data'),
    transform(val) {
      if (val === '') {
        return '--';
      }
      return flowRateFilter.transform(val);
    },
    width: '144px',
  }, {
    id: 'txPackets',
    text: __('Tx Packets'),
    transform(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
    width: '144px',
  }, {
    id: 'rxPackets',
    text: __('Rx Packets'),
    transform(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
    width: '144px',
  }, {
    id: 'txErrorPackets',
    text: __('Tx Errors'),
    transform(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
    width: '144px',
  }, {
    id: 'rxErrorPackets',
    text: __('Rx Errors'),
    transform(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
    width: '144px',
  }, {
    id: 'ccq',
    text: __('CCQ'),
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
    this.props.fetchSettings().then(() => {
      this.props.changeFirstRefresh(false);
    });
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
    this.props.changeFirstRefresh(true);
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
        text: __('Device Name'),
        transform(val) {
          if (val === '' || val === undefined) {
            return '--';
          }
          return val;
        },
      },
      {
        id: 'signal',
        text: __('Signal(dBm)'),
        transform(val) {
          if (val === '' || val === undefined) {
            return '--';
          }
          return val;
        },
      },
      {
        id: 'noise',
        text: __('Noise(dBm)'),
        transform(val) {
          if (val === '' || val === undefined) {
            return '--';
          }
          return val;
        },
      },
      {
        id: 'txRate',
        text: __('Tx Rate'),
        transform(val) {
          if (val === '' || val === undefined) {
            return '--';
          }
          return val + 'Mbps';
        },
      },
      {
        id: 'rxRate',
        text: __('Rx Rate'),
        transform(val) {
          if (val === '' || val === undefined) {
            return '--';
          }
          return val + 'Mbps';
        },
      },
      {
        id: 'txBytes',
        text: __('Tx Data'),
        transform(val) {
          if (val === '' || val === undefined) {
            return '--';
          }
          return flowRateFilter.transform(val);
        },
      },
      {
        id: 'rxBytes',
        text: __('Rx Data'),
        transform(val) {
          if (val === '' || val === undefined) {
            return '--';
          }
          return flowRateFilter.transform(val);
        },
      },
      {
        id: 'txPackets',
        text: __('Tx Packets'),
        transform(val) {
          if (val === '' || val === undefined) {
            return '--';
          }
          return val;
        },
      },
      {
        id: 'rxPackets',
        text: __('Rx Packets'),
        transform(val) {
          if (val === '' || val === undefined) {
            return '--';
          }
          return val;
        },
      },
      {
        id: 'connectTime',
        text: __('Connect Time'),
        transform(val) {
          if (val === '' || val === undefined) {
            return '--';
          }
          return that.changeUptimeToReadable(val);
        },
      },
      {
        id: 'ipAddr',
        text: __('IP'),
        transform(val) {
          if (val === '' || val === undefined) {
            return '--';
          }
          return val;
        },
      },
    ]);
    const connectionInfoOption = fromJS([
      {
        id: 'status',
        text: __('Connection Status'),
        transform(val) {
          if (val === '' || val === undefined) {
            return '--';
          }
          return val;
        },
      }, {
        id: 'connectTime',
        text: __('Connect Time'),
        transform(val) {
          if (val === '' || val === undefined) {
            return '--';
          }
          return that.changeUptimeToReadable(val);
        },
      }, {
        id: 'txrate',
        text: __('Tx Rate'),
        transform(val) {
          if (val === '' || val === undefined) {
            return '--';
          }
          return val + 'Mbps';
        },
      }, {
        id: 'rxrate',
        text: __('Rx Rate'),
        transform(val) {
          if (val === '' || val === undefined) {
            return '--';
          }
          return val + 'Mbps';
        },
      }, {
        id: 'ip',
        text: __('Peer IP'),
        transform(val) {
          if (val === '' || val === undefined) {
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
      interfaces, vap_interfaces, station, wlan0Mac, protocol,
      lan0Mac, lan1Mac, ssid, distance, txPower, noise, ccq, chutil,
     } = status;
    const vapInterfacesList = (wirelessMode === 'sta') ? [vap_interfaces[0]] : vap_interfaces;
    let apMac; let clientNum; let staList; let signal;
    let connectInfo = [];
    if (ap !== undefined) {
      apMac = ap.apMac;
      clientNum = ap.clientNum;
      staList = ap.staList;
    }
    if (station !== undefined) {
      console.log('station', station);
      const obj = station;
      obj['ip'] = station.apInfo.ip;
      obj['apInfo'] = undefined;
      connectInfo.push(obj);
      console.log('connectInfo', connectInfo);
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
        this.props.app.get('fetching') && this.props.selfState.get('firstRefresh') ? (
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
            <h3>{__('System Status')}</h3>
          </div>
          <div className="stats-group-cell">
            <div className="row">
              <div className="cols col-5">
                <FormGroup
                  type="plain-text"
                  label={__('Device Model :')}
                  value={deviceModel}
                />
                <FormGroup
                  label={__('Network Mode :')}
                  type="plain-text"
                  value={networkMode}
                />
                <FormGroup
                  label={__('System Uptime :')}
                  id="uptime"
                  type="plain-text"
                  value={this.changeUptimeToReadable(uptime)}
                />
                <FormGroup
                  label={__('WLAN0 MAC :')}
                  type="plain-text"
                  value={wlan0Mac}
                />
                <FormGroup
                  label={__('LAN1 MAC :')}
                  type="plain-text"
                  value={lan1Mac}
                />

              </div>
              <div className="cols col-6">
                <FormGroup
                  label={__('Device Name :')}
                  type="plain-text"
                  value={deviceName}
                />
                <FormGroup
                  label={__('Firmware Version :')}
                  type="plain-text"
                  value={version}
                />
                <FormGroup
                  label={__('System Time :')}
                  id="systemtime"
                  type="plain-text"
                  value={systemTime}
                />
                <FormGroup
                  label={__('LAN0 MAC :')}
                  type="plain-text"
                  value={lan0Mac}
                />
                {
                  ap === undefined ? null : (
                    <FormGroup
                      label={__('Client Number :')}
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
            <h3>{__('Radio')}</h3>
          </div>
          <div className="stats-group-cell">
            <div className="row">
              <div className="cols col-5">
                <FormGroup
                  label={__('Wireless Model :')}
                  type="plain-text"
                  value={wirelessMode === 'sta' ? 'station' : wirelessMode}
                />
                <FormGroup
                  label={__('SSID :')}
                  type="plain-text"
                  value={ssid}
                />
                <FormGroup
                  label={__('Protocol :')}
                  type="plain-text"
                  value={protocol}
                />
                <FormGroup
                  label={__('Channel/Frequency :')}
                  type="plain-text"
                  value={frequency}
                />
                <FormGroup
                  label={__('Channel Width :')}
                  type="plain-text"
                  value={channelWidth}
                />
                <FormGroup
                  label={__('Security Mode :')}
                  type="plain-text"
                  value={security}
                />
              </div>
              <div className="cols col-6">
                <FormGroup
                  label={__('Distance :')}
                  type="plain-text"
                  value={distance}
                  help="km"
                />
                <FormGroup
                  label={__('Tx Power :')}
                  type="plain-text"
                  value={txPower}
                  help="dBm"
                />
                <FormGroup
                  label={__('Signal :')}
                  type="plain-text"
                  value={status.signal}
                  help="dBm"
                />
                <FormGroup
                  label={__('Noise :')}
                  type="plain-text"
                  value={noise}
                  help="dBm"
                />
                <FormGroup
                  label={__('Channel Utilization :')}
                  type="plain-text"
                  value={chutil}
                />
              </div>
            </div>
          </div>
          <h3 className="stats-group-cell">{__('Wired Interfaces')}</h3>
          <div className="stats-group-cell">
            <Table
              className="table"
              options={interfaceOptions}
              list={interfaces}
            />
          </div>
          <h3 className="stats-group-cell">{__('Wireless Interfaces')}</h3>
          <div className="stats-group-cell">
            <Table
              className="table"
              options={vapInterfaceOptions}
              list={vapInterfacesList}
            />
          </div>
          {
            ap === undefined ? null : (
              <div className="clientListTable">
                <h3 className="stats-group-cell">{__('Clients')}</h3>
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
                <h3 className="stats-group-cell">{__('Connection Info')}</h3>
                <div className="stats-group-cell">
                  <Table
                    className="table"
                    options={connectionInfoOption}
                    list={connectInfo}
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
    selfState: state.systemstatus,
    app: state.app,
    store: state.settings,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    utils.extend({}, appActions, sharedActions, selfActions),
    dispatch
  );
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(SystemStatus);

export const systemstatus = reducer;
