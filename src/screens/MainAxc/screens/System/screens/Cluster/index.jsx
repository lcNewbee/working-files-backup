import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';

import { actions as appActions } from 'shared/containers/app';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';

const formOptions = fromJS([
  {
    id: 'enable',
    label: __('Access Control'),
    text: __('Enable'),
    type: 'checkbox',
  }, {
    lable: __('Rules Group'),
    type: 'select',
  },
]);
const propTypes = {};
const defaultProps = {};

export default class ActiveStandby extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultData: {
        enable: '1',
      },
    };
  }
  render() {
    return (
      <AppScreen
        {...this.props}
        settingsFormOptions={formOptions}
        defaultSettingData={this.state.defaultData}
      />
    );
  }
}

ActiveStandby.propTypes = propTypes;
ActiveStandby.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    store: state.screens,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    screenActions,
  ), dispatch);
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActiveStandby);
