import React, { PropTypes } from 'react';
import { fromJS, Map, List } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import utils from 'shared/utils';
import AppScreen from 'shared/components/Template/AppScreen';
import * as appActions from 'shared/actions/app';
import * as actions from 'shared/actions/screens';

const flowRateFilter = utils.filter('flowRate');
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
    transform(val) {
      if (val === '' || val === undefined) {
        return '--';
      }
      return flowRateFilter.transform(val / 1024);
    },
  }, {
    id: 'discarded_bytes',
    text: _('Discarded Bytes'),
    transform(val) {
      if (val === '' || val === undefined) {
        return '--';
      }
      return flowRateFilter.transform(val / 1024);
    },
  }, {
    id: 'ip_packets',
    text: _('IP Packets'),
    transform(val) {
      if (val === '' || val === undefined) {
        return '--';
      }
      return val;
    },
  }, {
    id: 'ip_bytes',
    text: _('IP Bytes'),
    transform(val) {
      if (val === '' || val === undefined) {
        return '--';
      }
      return flowRateFilter.transform(val / 1024);
    },
  }, {
    id: 'tcp_packets',
    text: _('TCP Packets'),
    transform(val) {
      if (val === '' || val === undefined) {
        return '--';
      }
      return val;
    },
  }, {
    id: 'udp_packets',
    text: _('UDP Packets'),
    transform(val) {
      if (val === '' || val === undefined) {
        return '--';
      }
      return val;
    },
  }, {
    id: 'vlan_packets',
    text: _('VLAN Packets'),
    transform(val) {
      if (val === '' || val === undefined) {
        return '--';
      }
      return val;
    },
  }, {
    id: 'mpls_packets',
    text: _('MPLS Packets'),
    transform(val) {
      if (val === '' || val === undefined) {
        return '--';
      }
      return val;
    },
  }, {
    id: 'pppoe_packets',
    text: _('PPPoE Packets'),
    transform(val) {
      if (val === '' || val === undefined) {
        return '--';
      }
      return val;
    },
  }, {
    id: 'fragmented_packets',
    text: _('Fragmented Packets'),
    transform(val) {
      if (val === '' || val === undefined) {
        return '--';
      }
      return val;
    },
  }, {
    id: 'ndpi_throughput',
    text: _('NDPI Throughput'),
    transform(val) {
      if (val === '' || val === undefined) {
        return '--';
      }
      return val;
    },
  }, {
    id: 'guessed_flow_protos',
    text: _('Guessed Flow Protos'),
    transform(val) {
      if (val === '' || val === undefined) {
        return '--';
      }
      return val;
    },
  }, {
    id: 'active_eth',
    text: _('Active Status'),
    actionName: 'active',
    type: 'switch',
    transform(val) {
      if (val === '' || val === undefined) {
        return '--';
      }
      return val;
    },
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
          actionable
          addable={false}
          editable={false}
          deleteable={false}
          listKey="ethx_name"
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
