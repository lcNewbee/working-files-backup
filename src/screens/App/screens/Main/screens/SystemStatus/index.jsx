import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { fromJS, Map } from 'immutable';
import { connect } from 'react-redux';
import { FormGroup } from 'shared/components';
import Table from 'shared/components/Table';
import Button from 'shared/components/Button';
import utils from 'shared/utils';
import * as sharedActions from 'shared/actions/settings';
import * as appActions from 'shared/actions/app';
import reducer from './reducer.js';

const propTypes = {
  store: PropTypes.instanceOf(Map),
  route: PropTypes.object,
  initSettings: PropTypes.func,
  fetchSettings: PropTypes.func,
};

const defaultProps = {};

const interfaceOptions = fromJS([
  {
    id: 'Name',
    text: _('Name'),
  }, {
    id: 'Ip',
    text: 'IP',
  }, {
    id: 'MTU',
    text: 'MTU',
  }, {
    id: 'TxBytes',
    text: 'Tx Bytes',
  }, {
    id: 'RxBytes',
    text: _('Rx Bytes'),
  }, {
    id: 'TxErrorPackets',
    text: _('TX Error'),
  }, {
    id: 'RxErrorPackets',
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

  componentWillMount() {
    // 必须要有初始化，因为要在settings中插入一个由该页面id命名的对象
    this.props.initSettings({
      settingId: this.props.route.id,
      fetchUrl: this.props.route.fetchUrl,
      defaultData: {},
    });
    this.props.fetchSettings();
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
      systemTime, channel, channelWidth, distance, uptime, ap,
      interfaces, station,
     } = status;
    let apMac;
    let clientNum;
    let staList;
    if (ap !== undefined) {
      apMac = ap.apMac;
      clientNum = ap.clientNum;
      staList = ap.staList;
    }
    // console.log(status, deviceModel);
    // curData = this.props.store.getIn(['curData']);
    // const {
    //   deviceModel,
    // } = this.props.store.getIn(['curData', 'status']).toJS();

    // const wirelessMode = this.props.store.getIn(['curData', 'wirelessMode']);
    return (
      <div>
        <div className="row">
          <h3>System Status</h3>
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
            <FormGroup
              label={_('Firmware Version:')}
              type="plain-text"
              value={version}
            />
          </div>
          <div className="cols col-6">
            <FormGroup
              label={_('System Time:')}
              type="plain-text"
              value={systemTime}
            />
            <FormGroup
              label={_('Channel/Frequency:')}
              type="plain-text"
              value={channel}
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
            <FormGroup
              label={_('System Uptime:')}
              type="plain-text"
              value={uptime}
            />
          </div>
        </div>
        <div className="row">
          <h3>{_('Radio')}</h3>
          <div className="cols col-6">
            <FormGroup
              label={_('Device Model:')}
            >
              sda
            </FormGroup>
            <FormGroup
              label={_('Device Name:')}
            >
              sda
            </FormGroup>
            <FormGroup
              label={_('Network Mode:')}
            >
              sda
            </FormGroup>
            <FormGroup
              label={_('Wireless Mode:')}
            >
              sda
            </FormGroup>
            <FormGroup
              label={_('Security Mode:')}
            >
              sda
            </FormGroup>
            <FormGroup
              label={_('Firmware Version:')}
            >
              sda
            </FormGroup>
          </div>
          <div className="cols col-6">
            <FormGroup
              label={_('System Time:')}
            >
              sda
            </FormGroup>
            <FormGroup
              label={_('Channel/Frequency:')}
            >
              sda
            </FormGroup>
            <FormGroup
              label={_('Channel Width:')}
            >
              sda
            </FormGroup>
            <FormGroup
              label={_('Distance:')}
            >
              sda
            </FormGroup>
            <FormGroup
              label={_('System Uptime:')}
            >
              sda
            </FormGroup>
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
          ap !== undefined ? null : (
            <div className="clientListTable">
              <h3>{_('Client Info')}</h3>
              <Table
                className="table"
                options={clientOptions}
                list={staList}
              />
            </div>
          )
        }
        <br /><br />
        <div className="remoteApTable">
          <h3>{_('Remote AP Info')}</h3>
          <Table
            className="table"
            options={remoteApOption}

          />
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
