import React, { PropTypes } from 'react';
import utils, { immutableUtils } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import AppScreen from 'shared/components/Template/AppScreen';
import * as appActions from 'shared/actions/app';
import * as screenActions from 'shared/actions/screens';

const screenOptions = fromJS([
  {
    id: 'widsenable',
    text: _('Enable'),
    formProps: {
      type: 'checkbox',
      dataType: 'number',
      defaultValue: '0',
    },
  }, {
    id: 'attacttime',
    label: _('Harass Attact Time'),
    formProps: {
      min: 0,
      type: 'number',
      dataType: 'number',
      defaultValue: 1,
      help: _('Seconds'),
    },
  }, {
    id: 'attactcnt',
    label: _('Harass Number'),
    formProps: {
      min: 0,
      type: 'number',
      dataType: 'number',
      defaultValue: 1,
    },

  }, {
    id: 'dyaging',
    label: _('Dynamic Blacklists Release Time'),
    formProps: {
      min: 0,
      type: 'number',
      dataType: 'number',
      defaultValue: 3600,
      help: _('Seconds'),
    },
  },
]);

const settingsFormOptions = immutableUtils.getFormOptions(screenOptions);

const propTypes = {};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <AppScreen
        {...this.props}
        settingsFormOptions={settingsFormOptions}
        hasSettingsSaveButton
        noTitle
      />
    );
  }
}

View.propTypes = propTypes;
View.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    store: state.screens,
    groupid: state.product.getIn(['group', 'selected', 'id']),
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
)(View);
