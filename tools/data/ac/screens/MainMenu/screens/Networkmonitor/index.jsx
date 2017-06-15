import React from 'react'; import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fromJS, List } from 'immutable';
import PureComponent from 'shared/components/Base/PureComponent';
import * as actions from './actions';
import reducer from './reducer';

import {
  Table,
} from 'shared/components';

const msg = {
  REMOTEAPINFO_TITLE: __('Remote AP Info'),
  REMOTESTAINFO_TITLE: __('Remote Station Info'),
  INTERFERENCE_TITLE: __('Interface'),
  LOGINFO_TITLE: __('Log Info'),
};

const propTypes = {
  remoteApInfo: PropTypes.instanceOf(List),
  remoteStaInfo: PropTypes.instanceOf(List),
  interfaceInfo: PropTypes.instanceOf(List),
  fetchMonitorStatus: PropTypes.func,
};

const defaultProps = {

};

export default class Networkmonitor extends PureComponent {
  constructor() {
    super();
  }

  componentWillMount() {
    // console.log('mount');
    this.props.fetchMonitorStatus();
  }

  render() {
    const remoteApInfoOptions = fromJS([
      {
        id: 'devicename',
        text: __('Device Name '),
      }, {
        id: 'devicemodel',
        text: __('Device Model'),
      }, {
        id: 'softwareversion',
        text: __('Software Version'),
      },
    ]);

    const remoteStaInfoOptions = fromJS([
      {
        id: 'mac',
        text: 'MAC',
      }, {
        id: 'devicename',
        text: __('Device Name '),
      }, {
        id: 'txstrength',
        text: __('TX Singal Strength'),
      }, {
        id: 'rxstrength',
        text: __('RX Singal Strength'),
      }, {
        id: 'noise',
        text: __('Background Noise'),
      },
    ]);

    const interfaceInfoOptions = fromJS([
      {
        id: 'interface',
        text: __('Interface'),
      }, {
        id: 'mac',
        text: 'MAC',
      }, {
        id: 'mtu',
        text: 'MTU',
      }, {
        id: 'ip',
        text: 'IP',
      }, {
        id: 'txflow',
        text: __('TX Flow'),
      }, {
        id: 'txerror',
        text: __('TX Errors'),
      }, {
        id: 'rxflow',
        text: __('RX Flow'),
      }, {
        id: 'rxerror',
        text: __('RX Errors'),
      },
    ]);

    return (
      <div>
        <div className="remoteApInfo">
          <h2>{msg.REMOTEAPINFO_TITLE}</h2>
          <Table
            className="table"
            options={remoteApInfoOptions}
            list={this.props.remoteApInfo}
          />
        </div>
        <div className="remoteStaInfo">
          <h2>{msg.REMOTESTAINFO_TITLE}</h2>
          <Table
            className="table"
            options={remoteStaInfoOptions}
            list={this.props.remoteStaInfo}
          />
        </div>
        <div className="interface">
          <h2>{msg.INTERFERENCE_TITLE}</h2>
          <Table
            className="table"
            options={interfaceInfoOptions}
            list={this.props.interfaceInfo}
          />
        </div>
        <div className="logInfo">
          <h2>{msg.LOGINFO_TITLE}</h2>
        </div>
      </div>
    );
  }
}

Networkmonitor.propTypes = propTypes;
Networkmonitor.defaultProps = defaultProps;

function mapStateToProps(state) {
  const myState = state.networkmonitor;

  return {
    fetching: myState.get('fetching'),
    query: myState.get('query'),
    remoteApInfo: myState.get('remoteApInfo'),
    remoteStaInfo: myState.get('remoteStaInfo'),
    interfaceInfo: myState.get('interfaceInfo'),
    logInfo: myState.get('logInfo'),
  };
}

export const Screen = connect(
  mapStateToProps,
  actions
)(Networkmonitor);

export const networkmonitor = reducer;
