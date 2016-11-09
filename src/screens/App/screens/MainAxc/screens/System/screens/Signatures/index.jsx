import React, { PropTypes } from 'react';
import utils, { immutableUtils } from 'shared/utils';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { Map, fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import AppSettings from 'shared/components/Template/AppSettings';
import * as appActions from 'shared/actions/app';
import * as actions from 'shared/actions/settings';

const screenOptions = fromJS([
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

const formOptions = immutableUtils.getFormOptions(screenOptions);
const defaultFormData = immutableUtils.getDefaultData(screenOptions);

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  render() {
    return (
      <AppSettings
        {...this.props}
        formOptions={formOptions}
        defaultFormData={defaultFormData}
        defaultQuery={defaultFormData}
        hasSaveButton
      />
    );
  }
}

View.propTypes = propTypes;
View.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    store: state.settings,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    actions
  ), dispatch);
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(View);
