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
    id: 'ndpi_eth_bytes',
    text: _('Flow Bytes'),
  }, {
    id: 'ndpi_discarded_bytes',
    text: _('Discarded Bytes'),
  }, {
    id: 'ndpi_ip_packets',
    text: _('IP Packets'),
  }, {
    id: 'ndpi_ip_bytes',
    text: _('IP Bytes'),
  }, {
    id: 'ndpi_tcp_packets',
    text: _('TCP Packets'),
  }, {
    id: 'ndpi_udp_packets',
    text: _('UDP Packets'),
  }, {
    id: 'ndpi_vlan_packets',
    text: _('VLAN Packets'),
  }, {
    id: 'ndpi_mpls_packets',
    text: _('MPLS Packets'),
  }, {
    id: 'ndpi_pppoe_packets',
    text: _('PPPoE Packets'),
  }, {
    id: 'ndpi_fragmented_packets',
    text: _('Fragmented Packets'),
  }, {
    id: 'ndpi_ndpi_throughput',
    text: _('NDPI Throughput'),
  }, {
    id: 'ndpi_guessed_flow_protos',
    text: _('Guessed Flow Protos'),
  },
]);


export default class EthStatistic extends React.Component {
  constructor(props) {
    super(props);
    this.props.initScreen({
      id: this.props.route.id,
      formUrl: this.props.route.formUrl,
      path: this.props.route.path,
      isFetchInfinite: true,
      fetchIntervalTime: 5000,
    });
  }

  componentWillMount() {
    this.props.fetchScreenData();
  }

  render() {
    return (
      <div>
        <AppScreen
          {...this.props}
          listOptions={listOptions}
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
