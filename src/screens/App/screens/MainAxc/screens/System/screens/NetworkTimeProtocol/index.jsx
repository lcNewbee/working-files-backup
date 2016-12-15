import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { Map, fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import AppScreen from 'shared/components/Template/AppScreen';
import * as appActions from 'shared/actions/app';
import * as screenActions from 'shared/actions/screens';
import TIME_ZONE from 'shared/config/timeZone';
import validator from 'shared/utils/lib/validator';

const propTypes = {
  store: PropTypes.instanceOf(Map),
  app: PropTypes.instanceOf(Map),
};
const defaultProps = {};

const settingsOptions = fromJS([
  {
    id: 'ac_onoff',
    label: _('Enable NTP Sync'),
    fieldset: 'acTime',
    legend: _('AC Time Synchronization Setting'),
    type: 'checkbox',

  },
  {
    id: 'ac_server_name',
    fieldset: 'acTime',
    label: _('Synchronization Server'),
    type: 'text',
    required: 'true',
    validator: validator({
      rules: 'ip',
    }),
  },
  {
    id: 'ac_referral_server',
    fieldset: 'acTime',
    label: _('Referral Server'),
    type: 'text',
    validator: validator({
      rules: 'ip',
    }),
  },
  {
    id: 'ac_TimeInterval',
    fieldset: 'acTime',
    label: _('Synchronization Time Interval'),
    type: 'number',
    required: 'true',
    help: _('Second'),
    min: '5',
    max: '50000',
    maxLength: '15',
    validator: validator({
      rules: 'num',
    }),
  },
  {
    id: 'ac_timezone',
    fieldset: 'acTime',
    label: _('Synchronization Time Zone'),
    type: 'select',
    required: 'true',
    options: TIME_ZONE,
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
