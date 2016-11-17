import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import utils from 'shared/utils';
import * as appActions from 'shared/actions/app';
import * as sharedActions from 'shared/actions/settings';
import { bindActionCreators } from 'redux';

const propTypes = {
  initSettings: PropTypes.func,
  route: PropTypes.object,
};

export default class SystemStatus extends Component {
  // constructor(props) {
  //   super(props);
  // }
  componentWillMount() {
    this.props.initSettings({
      settingId: this.props.route.id,
      fetchUrl: this.props.route.fetchUrl,
      defaultData: {},
    });
    console.log('in SystemStatus');
  }

  render() {
    return (
      <span>this is the first page</span>
    );
  }
}

SystemStatus.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    app: state.app,
    store: state.settings,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    sharedActions,
  ), dispatch);
}



export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SystemStatus);
