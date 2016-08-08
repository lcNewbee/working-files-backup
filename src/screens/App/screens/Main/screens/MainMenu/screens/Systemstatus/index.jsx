import React from 'react';
// import utils from 'shared/utils';
import { connect } from 'react-redux';
// import { fromJS, Map } from 'immutable';
// import PureRenderMixin from 'react-addons-pure-render-mixin';
import * as actions from './actions';
import reducer from './reducer';


export default class Systemstatus extends React.Component {

  componentWillMount() {
    console.log('mount');
    this.props.requestFetchStatus();
  }

  render() {
    return (
      <div>
        <p>{_('Wirelss Model: ')}<span>{this.props.data.get('WirelessMode')}</span></p>
        <p>{_('Device Name: ')}<input></input></p>
        <p>{_('Network Mode: ')}<span> Bridge</span></p>
        <p>{_('Wireless Mode: ')}<span>b/g/n</span></p>
        <p>{_('SSID: ')}<span>SSIDNAME</span></p>
        <p>{_('Security Mode: ')}<span>wpa/psk</span></p>
        <p>{_('Software Version: ')}<span>V1.0.0.1</span></p>
        <p>{_('Run Time: ')}<span></span></p>
        <p>{_('System Time: ')}<span></span></p>
        <p>{_('Channel/Frequency: ')}<span></span></p>
        <p>{_('Channel Width: ')}<span></span></p>
        <p>{_('Distance: ')}<span></span></p>
        <p>{_('RF Power: ')}<span></span></p>
        <p>{_('Antenna: ')}<span></span></p>
        <p>WLAN0 MAC: <span></span></p>
        <p>LAN0 MAC: <span></span></p>
        <p>LAN1 MAC: <span></span></p>
        <p>LAN0/LAN1: <span></span></p>
        <p>AP mac: <span></span></p>
        <p>{_('Online User: ')}<span></span></p>
        <p>{_('Background Noise: ')}<span></span></p>
        <p>{_('Transform CCQ: ')}<span></span></p>
        <p>{_('Singal Stength: ')}<span></span></p>
        <p>{_('TX/RX Rate: ')}<span></span></p>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const myState = state.systemstatus;
  console.log(myState.get('data').toJS());
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
