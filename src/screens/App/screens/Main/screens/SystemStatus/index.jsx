import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { fromJS, Map } from 'immutable';
import { connect } from 'react-redux';
import { FormGroup } from 'shared/components';
import Table from 'shared/components/Table';
import Button from 'shared/components/Button/Button';
import utils from 'shared/utils';
import * as sharedActions from 'shared/actions/settings';
import * as appActions from 'shared/actions/app';
import reducer from './reducer.js';

const propTypes = {
  store: PropTypes.instanceOf(Map),
  route: PropTypes.object,
  initSettings: PropTypes.func,
  fetchSettings: PropTypes.func,

  updateItemSettings: PropTypes.func,
  leaveSettingsScreen: PropTypes.func,
};
let a;

const defaultProps = {};

const interfaceOptions = fromJS([
  {
    id: 'name',
    text: _('Name'),
  }, {
    id: 'ip',
    text: 'IP',
  }, {
    id: 'mtu',
    text: 'MTU',
  }, {
    id: 'txBytes',
    text: 'Tx Bytes',
  }, {
    id: 'rxBytes',
    text: _('Rx Bytes'),
  }, {
    id: 'txErrorPackets',
    text: _('TX Error'),
  }, {
    id: 'rxErrorPackets',
    text: _('RX Error'),
  },
]);

const clientOptions = fromJS([
  {
    id: 'mac',
    text: 'Mac',
  },
  {
    id: 'deviceName',
    text: _('Device Name'),
  },
  {
    id: 'txSignal',
    text: _('TX Singal'),
  },
  {
    id: 'rxSignal',
    text: _('RX Signal'),
  },
  {
    id: 'noise',
    text: _('Noise'),
  },
  {
    id: 'txRate',
    text: _('TX Rate'),
  },
  {
    id: 'rxRate',
    text: _('RX Rate'),
  },
  {
    id: 'ccq',
    text: _('CCQ'),
  },
  {
    id: 'connectTime',
    text: _('Connect Time'),
  },
  {
    id: 'ipAddr',
    text: _('IP'),
  },
  /*
  {
    id: 'operate',
    text: _('Action'),
    transform(val, item) {
      const curMac = item.get('Mac');
      return (
        <Button
          icon="remove"
          title="kick out"
          size="sm"
          onClick={() => this.onKickUser(curMac)}
        />
      );
    },
  },
  */
]);

const remoteApOption = fromJS([
  {
    id: 'DeviceName',
    text: _('Device Name'),
  }, {
    id: 'DeviceMode',
    text: 'Device Mode',
  }, {
    id: 'SoftVersion',
    text: _('Soft Version'),
  }, {
    id: 'ConnectTime',
    text: _('Connect Time'),
  }, {
    id: 'RxSignal',
    text: _('Rx Signal'),
  }, {
    id: 'TxSignal',
    text: _('Tx Signal'),
  }, {
    id: 'Tx Rate',
    text: _('Tx Rate'),
  }, {
    id: 'RxRate',
    text: _('Rx Rate'),
  }, {
    id: 'TxPackets',
    text: _('Tx Packets'),
  }, {
    id: 'RxPackets',
    text: _('Rx Packets'),
  },
]);

export default class SystemStatus extends React.Component {

  constructor(props) {
    super(props);
    this.changeSystemTimeToReadable = this.changeSystemTimeToReadable.bind(this);
    this.changeUptimeToReadable = this.changeUptimeToReadable.bind(this);
  }


  componentWillMount() {
    window.clearInterval(a);
    // 必须要有初始化，因为要在settings中插入一个由该页面id命名的对象
    this.props.initSettings({
      settingId: this.props.route.id,
      fetchUrl: this.props.route.fetchUrl,
      defaultData: {},
    });
    this.props.fetchSettings();
    a = setInterval(this.props.fetchSettings, 5000);
  }

  componentWillUnmount() {
    window.clearInterval(a);
    this.props.leaveSettingsScreen();
  }

/*
  componentDidMount() {
    window.clearInterval(a);
    const that = this;
    // const oldProps = this.props;

    a = setInterval(() => {
      let status = that.props.store.getIn(['curData', 'status']);
      // console.log(oldProps === that.props);
      // console.log(this === that);
      if (status === undefined) { return; }
      // console.log('old = ', status);
      status = status.toJS();
      const systemTime = status.systemTime;
      const uptime = status.uptime;
      const newSystemTime = (parseInt(systemTime, 10) + 5000).toString();
      const newUptime = (parseInt(uptime, 10) + 5).toString();
      const newStatus = utils.extend(
                            {},
                            { ...status },
                            { 'systemTime': newSystemTime, 'uptime': newUptime }
                        );
      that.props.updateItemSettings({
        status: newStatus,
      });
    }, 5000);
  }
*/

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
      timeStr = hours + 'd ' + minutes + 'm ' + seconds + 's ';
    } else if (minutes > 0) {
      timeStr = minutes + 'm ' + seconds + 's ';
    }
    return timeStr;
  }

  render() {
    const {
      status, wirelessMode,
    } = this.props.store.get('curData').toJS();
    if (status === undefined) {
      return null;
    }
    const {
      deviceModel, deviceName, networkMode, security, version,
      systemTime, frequency, channelWidth, distance, uptime, ap,
      interfaces, station,
     } = status;
    let apMac; let clientNum; let staList; let signal;
    let apInfo = [];
    if (ap !== undefined) {
      apMac = ap.apMac;
      clientNum = ap.clientNum;
      staList = ap.staList;
    }
    if (station !== undefined) {
      signal = station.singal;
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
      <div>
        <h3>{_('System Status')}</h3>
        <div className="row">
          <div className="cols col-6">
            <FormGroup
              type="plain-text"
              label={_('Device Model:')}
              value={deviceModel}
            />
            <FormGroup
              label={_('Device Name:')}
              type="plain-text"
              value={deviceName}
            />
            <FormGroup
              label={_('Firmware Version:')}
              type="plain-text"
              value={version}
            />
          </div>
          <div className="cols col-6">
            <FormGroup
              label={_('System Time:')}
              id="systemtime"
              type="plain-text"
              value={this.changeSystemTimeToReadable(systemTime)}
            />
            <FormGroup
              label={_('System Uptime:')}
              id="uptime"
              type="plain-text"
              value={this.changeUptimeToReadable(uptime)}
            />
            {
              ap === undefined ? null : (
                <FormGroup
                  label={_('Client Number:')}
                  id="userNumber"
                  type="plain-text"
                  value={this.props.store.getIn(['curData', 'status', 'ap', 'clientNum'])}
                />
              )
            }
          </div>
        </div>
        <h3>{_('Radio')}</h3>
        <div className="row">
          <div className="cols col-6">
            <FormGroup
              label={_('Network Mode:')}
              type="plain-text"
              value={networkMode}
            />
            <FormGroup
              label={_('Wireless Mode:')}
              type="plain-text"
              value={wirelessMode}
            />
            <FormGroup
              label={_('Security Mode:')}
              type="plain-text"
              value={security}
            />
          </div>
          <div className="cols col-6">
            <FormGroup
              label={_('Channel/Frequency:')}
              type="plain-text"
              value={frequency}
            />
            <FormGroup
              label={_('Channel Width:')}
              type="plain-text"
              value={channelWidth}
            />
            <FormGroup
              label={_('Distance:')}
              type="plain-text"
              value={distance}
            />
          </div>
        </div>
        <div className="interfaceTable">
          <h3>{_('Interfaces')}</h3>
          <Table
            className="table"
            options={interfaceOptions}
            list={interfaces}
          />
        </div>
        <br /><br />
        {
          ap === undefined ? null : (
            <div className="clientListTable">
              <h3>{_('Clients')}</h3>
              <Table
                className="table"
                options={clientOptions}
                list={staList}
              />
            </div>
          )
        }
        <br /><br />
        {
          station === undefined ? null : (
            <div className="remoteApTable">
              <h3>{_('Remote AP Info')}</h3>
              <Table
                className="table"
                options={remoteApOption}
                list={apInfo}
              />
            </div>
          )
        }
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
