import React from 'react';
// import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
// import PureRenderMixin from 'react-addons-pure-render-mixin';
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
        <p>{_('Wirelss Model: ')}<span>{this.props.data.get('WirelessMode')}</span></p>
        <p>{_('Device Name: ')}<span>{systemState.get('DeviceName')}</span></p>
        <p>{_('Network Mode: ')}<span>{systemState.get('NetworkMode')}</span></p>
        <p>{_('Wireless Mode: ')}<span>b/g/n</span></p>
        <p>{_('SSID: ')}<span>{systemState.get('SSID')}</span></p>
        <p>{_('Security Mode: ')}<span>{systemState.get('Security')}</span></p>
        <p>{_('Software Version: ')}<span>{systemState.get('Version')}</span></p>
        <p>{_('Run Time: ')}<span>{systemState.get('Uptime')}</span></p>
        <p>{_('System Time: ')}<span>{systemState.get('SystemTime')}</span></p>
        <p>{_('Channel/Frequency: ')}<span>{systemState.get('Channel')}</span></p>
        <p>{_('Channel Width: ')}<span>{systemState.get('ChannelWidth')}</span></p>
        <p>{_('Distance: ')}<span>{systemState.get('Distance')}</span></p>
        <p>{_('RF Power: ')}<span>{systemState.get('TxPower')}</span></p>
        <p>{_('Antenna: ')}<span>{systemState.get('Atenna')}</span></p>
        <p>WLAN0 MAC: <span>{systemState.get('Wlan0Mac')}</span></p>
        <p>LAN0 MAC: <span>{systemState.get('Lan0Mac')}</span></p>
        <p>LAN1 MAC: <span>{systemState.get('Lan1Mac')}</span></p>
        <p>LAN0/LAN1: <span>{systemState.get('Security')}</span></p>
        <p>AP mac: <span>{systemState.get('Security')}</span></p>
        <p>{_('Online User: ')}<span>{systemState.get('Security')}</span></p>
        <p>{_('Background Noise: ')}<span>{systemState.get('Security')}</span></p>
        <p>{_('Transform CCQ: ')}<span>{systemState.get('Security')}</span></p>
        <p>{_('Singal Stength: ')}<span>{systemState.get('Security')}</span></p>
        <p>{_('TX/RX Rate: ')}<span>{systemState.get('Security')}</span></p>
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
