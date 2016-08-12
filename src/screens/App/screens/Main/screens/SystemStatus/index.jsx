import React, { PropTypes } from 'react';
import { fromJS } from 'immutable';
import { connect } from 'react-redux';
import { FormGroup } from 'shared/components';
import Table from 'shared/components/Table';
import Button from 'shared/components/Button';
import * as actions from './actions.js';
import reducer from './reducer.js';

const propTypes = {
  data: PropTypes.object,
  fetchSystemStatus: PropTypes.func,
  kickUser: PropTypes.func,
};

const defaultProps = {};


export default class SystemStatus extends React.Component {

  componentWillMount() {
    this.props.fetchSystemStatus();
  }

  onKickUser(mac) {
    this.props.kickUser(mac);
  }

  render() {
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
        id: 'Mac',
        text: 'Mac',
      },
      {
        id: 'DeviceName',
        text: _('Device Name'),
      },
      {
        id: 'TxSignal',
        text: _('TX Singal'),
      },
      {
        id: 'RxSignal',
        text: _('RX Signal'),
      },
      {
        id: 'Noise',
        text: _('Noise'),
      },
      {
        id: 'TxRate',
        text: _('TX Rate'),
      },
      {
        id: 'RxRate',
        text: _('RX Rate'),
      },
      {
        id: 'CCQ',
        text: _('CCQ'),
      },
      {
        id: 'ConnectTime',
        text: _('Connect Time'),
      },
      {
        id: 'IpAddr',
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

    function getApInfoList(data) {
      return fromJS([data.toJS()]);
    }

    return (
      <div>
        <div className="row">
          <h3>System Status</h3>
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
            list={this.props.data.getIn(['status', 'interfaces'])}
            // loading={this.props.fetching}
          />
        </div>
        <br /><br />
        <div className="clientListTable">
          <h3>{_('Client Info')}</h3>
          <Table
            className="table"
            options={clientOptions}
            list={this.props.data.getIn(['status', 'ap', 'StaList'])}
            // loading={this.props.fetching}
          />
        </div>
        <br /><br />
        <div className="remoteApTable">
          <h3>{_('Remote AP Info')}</h3>
          <Table
            className="table"
            options={remoteApOption}
            list={getApInfoList(this.props.data
                      .getIn(['status', 'station', 'ApInfo']))}
          />
        </div>
      </div>
    );
  }
}

SystemStatus.propTypes = propTypes;
SystemStatus.defaultProps = defaultProps;

function mapStateToProps(state) {
  const myState = state.systemstatus;

  return {
    data: myState.get('data'),
  };
}

export const Screen = connect(
  mapStateToProps,
  actions
)(SystemStatus);

export const systemstatus = reducer;
