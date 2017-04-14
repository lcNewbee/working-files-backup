import React from 'react'; import PropTypes from 'prop-types';
import utils, { immutableUtils } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';

import { actions as appActions } from 'shared/containers/app';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';

const listOptions = fromJS([
  {
    id: 'importTime',
    label: __('Import Time'),
    fieldset: 'status',
    legend: __('Signatures Status'),
    formProps: {
      type: 'plain-text',
    },
  }, {
    id: 'lastUpgradeTime',
    label: __('Last Upgrade Time'),
    fieldset: 'status',
    formProps: {
      type: 'plain-text',
    },
  }, {
    id: 'expire',
    label: __('Expiration'),
    fieldset: 'status',
    formProps: {
      type: 'plain-text',
    },
  }, {
    id: 'importUpgradeFile',
    label: __('Local Import'),
    fieldset: 'upgrade',
    legend: __('Upgrade'),
    formProps: {
      required: true,
      type: 'file',
    },
  }, {
    id: 'upgradeOnline',
    label: __('Upgrade Online'),
    fieldset: 'upgrade',
    formProps: {
      type: 'checkbox',
    },
  }, {
    id: 'autoUpgrade',
    label: __('Auto Upgrade'),
    fieldset: 'upgrade',
    formProps: {
      type: 'checkbox',
    },
  },
]);

const formOptions = immutableUtils.getFormOptions(listOptions);
const defaultFormData = immutableUtils.getDefaultData(listOptions);

const propTypes = {};
const defaultProps = {};

export default class View extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <AppScreen
        {...this.props}
        settingsFormOptions={formOptions}
        defaultSettingsData={defaultFormData}
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
