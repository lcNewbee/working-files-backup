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
    id: 'flowid',
    text: _('Flow Id'),
  }, {
    id: 'lower_ip',
    text: _('Lower IP'),
  }, {
    id: 'upper_ip',
    text: _('Upper IP'),
  }, {
    id: 'lower_port',
    text: _('Lower Port'),
  }, {
    id: 'upper_port',
    text: _('Upper Port'),
  }, {
    id: 'protocol',
    text: _('Protocol'),
  }, {
    id: 'detected_protocol',
    text: _('Detected Protocol'),
  }, {
    id: 'packets',
    text: _('Packets'),
  }, {
    id: 'bytes',
    text: _('Bytes'),
  }, {
    id: 'host_servername',
    text: _('Host Servername'),
  },
]);


export default class FlowInfo extends React.Component {
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
          searchable
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
