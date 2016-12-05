import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { Map, fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import AppScreen from 'shared/components/Template/AppScreen';
import * as appActions from 'shared/actions/app';
import * as screenActions from 'shared/actions/screens';

const propTypes = {
  store: PropTypes.instanceOf(Map),
  app:  PropTypes.instanceOf(Map),
};
const defaultProps = {};

const settingsOptions = fromJS([
  {
    id: 'ac_onoff',
    label: _('Service'),
    fieldset: 'acTime',
    legend: _('AC Time Synchronization Setting'),
    type: 'checkbox',
  },
  {
    id: 'ac_server_name',
    fieldset: 'acTime',
    label: _('Synchronization Server'),
    type: 'text',

  },
  {
    id: 'ac_referral_server',
    fieldset: 'acTime',
    label: _('Referral Server'),
    type: 'text',
  },
  {
    id: 'ac_TimeInterval',
    fieldset: 'acTime',
    label: _('Synchronization Time Interval'),
    type: 'text',
  },
  {
    id: 'ac_timezone',
    fieldset: 'acTime',
    label: _('Synchronization Time Zone'),
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
