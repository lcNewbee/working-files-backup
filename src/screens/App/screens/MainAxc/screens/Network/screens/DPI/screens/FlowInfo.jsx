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
    id: 'flowid',
    text: __('Flow Id'),
  }, {
    id: 'lower_ip',
    text: __('Lower IP'),
  }, {
    id: 'upper_ip',
    text: __('Upper IP'),
  }, {
    id: 'lower_port',
    text: __('Lower Port'),
  }, {
    id: 'upper_port',
    text: __('Upper Port'),
  }, {
    id: 'protocol',
    text: __('Protocol'),
  }, {
    id: 'detected_protocol',
    text: __('Detected Protocol'),
  }, {
    id: 'packets',
    text: __('Packets'),
  },
]);


export default class FlowInfo extends React.Component {
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
          listTitle={__('Statistics Within 30 Seconds')}
        />
      </div>
    );
  }
}

FlowInfo.propTypes = propTypes;

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
)(FlowInfo);
