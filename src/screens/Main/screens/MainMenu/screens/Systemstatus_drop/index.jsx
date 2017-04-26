import React from 'react';
// import utils from 'shared/utils';
import { connect } from 'react-redux';
import * as actions from './actions';
import reducer from './reducer';

/*
const propTypes = {
  requestFetchStatus: PropTypes.func,
  data: PropTypes.object,
};

const defaultProps = {};
*/
export default class Systemstatus extends React.Component {

  componentWillMount() {
    // console.log('mount');
    this.props.fetchSystemStatus();
  }

  render() {
    const systemState = this.props.data.get('status');
    return (
      <div>
        <p>{__('Wirelss Model: ')}<span>{this.props.data.get('WirelessMode')}</span></p>
        <p>{__('Device Name: ')}<span>{systemState.get('DeviceName')}</span></p>
        <p>{__('Network Mode: ')}<span>{systemState.get('NetworkMode')}</span></p>
        <p>{__('Wireless Mode: ')}<span>b/g/n</span></p>
        <p>{__('SSID: ')}<span>{systemState.get('SSID')}</span></p>
        <p>{__('Security Mode: ')}<span>{systemState.get('Security')}</span></p>
        <p>{__('Software Version: ')}<span>{systemState.get('Version')}</span></p>
        <p>{__('Run Time: ')}<span>{systemState.get('Uptime')}</span></p>
        <p>{__('System Time: ')}<span>{systemState.get('SystemTime')}</span></p>
        <p>{__('Channel/Frequency: ')}<span>{systemState.get('Channel')}</span></p>
        <p>{__('Channel Width: ')}<span>{systemState.get('ChannelWidth')}</span></p>
        <p>{__('Distance: ')}<span>{systemState.get('Distance')}</span></p>
        <p>{__('RF Power: ')}<span>{systemState.get('TxPower')}</span></p>
        <p>{__('Antenna: ')}<span>{systemState.get('Atenna')}</span></p>
        <p>WLAN0 MAC: <span>{systemState.get('Wlan0Mac')}</span></p>
        <p>LAN0 MAC: <span>{systemState.get('Lan0Mac')}</span></p>
        <p>LAN1 MAC: <span>{systemState.get('Lan1Mac')}</span></p>
        <p>LAN0/LAN1: <span>{systemState.get('Security')}</span></p>
        <p>AP mac: <span>{systemState.get('Security')}</span></p>
        <p>{__('Online User: ')}<span>{systemState.get('Security')}</span></p>
        <p>{__('Background Noise: ')}<span>{systemState.get('Security')}</span></p>
        <p>{__('Transform CCQ: ')}<span>{systemState.get('Security')}</span></p>
        <p>{__('Singal Stength: ')}<span>{systemState.get('Security')}</span></p>
        <p>{__('TX/RX Rate: ')}<span>{systemState.get('Security')}</span></p>
      </div>
    );
  }
}

// Systemstatus.porpTypes = propTypes;
// Systemstatus.defaultProps = defaultProps;


function mapStateToProps(state) {
  const myState = state.systemstatus;
  // console.log(myState.get('data').toJS());
  return {
    fetching: myState.get('fetching'),
    query: myState.get('query'),
    data: myState.get('data'),
  };
}

export const Screen = connect(
  mapStateToProps,
  actions
)(Systemstatus);

export const systemstatus = reducer;
