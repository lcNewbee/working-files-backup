import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { Map, fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import AppScreen from 'shared/components/Template/AppScreen';
import * as appActions from 'shared/actions/app';
import * as screenActions from 'shared/actions/screens';
import validator from 'shared/validator';

const propTypes = {
  store: PropTypes.instanceOf(Map),
  app: PropTypes.instanceOf(Map),
};
const defaultProps = {};

const settingsOptions = fromJS([
  {
    id: 'relay_enable',
    label: _('Relay'),
    fieldset: 'relay_setting',
    defaultValue: '0',
    value: '1',
    required: true,
    type: 'checkbox',
    text: _('Enable'),
  }, {
    id: 'dhcp_server',
    label: _('DHCP Server'),
    fieldset: 'relay_setting',
    type: 'text',
    required: true,
    validator: validator({
      rules: 'ip',
    }),
  },
  {
    id: 'referral_server',
    label: _('Referral Server'),
    fieldset: 'relay_setting',
    type: 'text',
    validator: validator({
      rules: 'ip',
    }),
  },
  {
    id: 'option82_1',
    fieldset: 'relay_setting',
    label: _('Option82  field1'),
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
    label: _('Option82  field2'),
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
