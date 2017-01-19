import React, { PropTypes } from 'react';
import { fromJS, Map, List } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import utils from 'shared/utils';
import AppScreen from 'shared/components/Template/AppScreen';
import * as appActions from 'shared/actions/app';
import * as actions from 'shared/actions/screens';

const propTypes = fromJS({
  route: PropTypes.object,
  initScreen: PropTypes.func,
});

const listOptions = fromJS([
  {
    id: 'ethx_name',
    text: _('Name'),
  }, {
    id: 'eth_bytes',
    text: _('Flow Bytes'),
  }, {
    id: 'discarded_bytes',
    text: _('Discarded Bytes'),
  }, {
    id: 'ip_packets',
    text: _('IP Packets'),
  }, {
    id: 'ip_bytes',
    text: _('IP Bytes'),
  }, {
    id: 'tcp_packets',
    text: _('TCP Packets'),
  }, {
    id: 'udp_packets',
    text: _('UDP Packets'),
  }, {
    id: 'vlan_packets',
    text: _('VLAN Packets'),
  }, {
    id: 'mpls_packets',
    text: _('MPLS Packets'),
  }, {
    id: 'pppoe_packets',
    text: _('PPPoE Packets'),
  }, {
    id: 'fragmented_packets',
    text: _('Fragmented Packets'),
  }, {
    id: 'ndpi_throughput',
    text: _('NDPI Throughput'),
  }, {
    id: 'guessed_flow_protos',
    text: _('Guessed Flow Protos'),
  },
]);


export default class EthStatistic extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <AppScreen
          {...this.props}
          listOptions={listOptions}
          initOption={{
            isFetchInfinite: true,
            fetchIntervalTime: 5000,
          }}
        />
      </div>
    );
  }
}

EthStatistic.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    app: state.app,
    store: state.screens,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    actions,
  ), dispatch);
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(EthStatistic);
