import React, { PropTypes } from 'react';
import utils, { immutableUtils } from 'shared/utils';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import AppScreen from 'shared/components/Template/AppScreen';
import * as appActions from 'shared/actions/app';
import * as screenActions from 'shared/actions/screens';

const listOptions = fromJS([
  {
    id: 'importTime',
    label: _('Import Time'),
    fieldset: 'status',
    legend: _('Signatures Status'),
    formProps: {
      type: 'plain-text',
    },
  }, {
    id: 'lastUpgradeTime',
    label: _('Last Upgrade Time'),
    fieldset: 'status',
    formProps: {
      type: 'plain-text',
    },
  }, {
    id: 'expire',
    label: _('Expiration'),
    fieldset: 'status',
    formProps: {
      type: 'plain-text',
    },
  }, {
    id: 'importUpgradeFile',
    label: _('Local Import'),
    fieldset: 'upgrade',
    legend: _('Upgrade'),
    formProps: {
      required: true,
      type: 'file',
    },
  }, {
    id: 'upgradeOnline',
    label: _('Upgrade Online'),
    fieldset: 'upgrade',
    formProps: {
      type: 'checkbox',
    },
  }, {
    id: 'autoUpgrade',
    label: _('Auto Upgrade'),
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

export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
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
