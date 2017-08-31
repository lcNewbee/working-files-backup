import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DateRangePicker from 'shared/components/DateRangePicker';
import { FormGroup } from 'shared/components/Form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import utils from 'shared/utils';
import { actions as appActions } from 'shared/containers/app';
import { actions as settingActions } from 'shared/containers/settings';

const propTypes = {};

const defaultProps = {};

export default class NewFeatureTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ['2017-9-20', '2018-9-20'],
    };
    this.onChangeValue = this.onChangeValue.bind(this);
  }

  onChangeValue(data) {
    this.setState({ value: data.value });
  }

  render() {
    return (
      <FormGroup
        label="time range select"
        type="date-range"
        value={this.state.value}
        onChange={this.onChangeValue}
      />
    );
  }
}

NewFeatureTest.propTypes = propTypes;
NewFeatureTest.defaultProps = defaultProps;


function mapStateToProps(state) {
  return {
    app: state.app,
    store: state.settings,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    settingActions,
  ), dispatch);
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewFeatureTest);
