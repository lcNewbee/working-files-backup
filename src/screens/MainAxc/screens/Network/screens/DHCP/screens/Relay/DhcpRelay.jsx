import React from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';

import { actions as appActions } from 'shared/containers/app';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import validator from 'shared/validator';

const propTypes = {
};
const defaultProps = {};

const settingsOptions = fromJS([
  {
    id: 'relay_enable',
    label: __('Relay'),
    fieldset: 'relay_setting',
    legend: __('DHCP Relay'),
    defaultValue: '0',
    value: '1',
    required: true,
    type: 'checkbox',
    text: __('Enable'),
  }, {
    id: 'dhcp_server',
    label: __('DHCP Server'),
    fieldset: 'relay_setting',
    type: 'text',
    required: true,
    validator: validator({
      rules: 'ip',
    }),
  },
  {
    id: 'referral_server',
    label: __('Referral Server'),
    fieldset: 'relay_setting',
    type: 'text',
    validator: validator({
      rules: 'ip',
    }),
  },
  {
    id: 'option82_1',
    fieldset: 'relay_setting',
    label: __('Option82  field1'),
    type: 'text',
    required: true,
    validator: validator({
      rules: 'mac',
    }),
  },
  {
    id: 'option82_2',
    required: true,
    fieldset: 'relay_setting',
    label: __('Option82  field2'),
    type: 'text',
  },
]).groupBy(item => item.get('fieldset'))
.toList();

export default class View extends React.Component {
  render() {
    return (
      <AppScreen
        {...this.props}
        settingsFormOptions={settingsOptions}
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
