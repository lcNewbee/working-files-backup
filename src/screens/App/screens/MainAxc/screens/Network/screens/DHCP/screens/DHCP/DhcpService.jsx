import React from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import AppScreen from 'shared/components/Template/AppScreen';
import * as appActions from 'shared/actions/app';
import * as screenActions from 'shared/actions/screens';
import validator from 'shared/validator';

const propTypes = {
};
const defaultProps = {};

const settingsOptions = fromJS([
  {
    id: 'dhcp_service',
    label: _('DHCP Service'),
    fieldset: 'service_setting',
    defaultValue: '0',
    value: '1',
    required: true,
    type: 'checkbox',
    text: _('Enable'),
  }, {
    id: 'isLease',
    label: _('Backup Lease'),
    fieldset: 'service_setting',
    defaultValue: '0',
    value: '1',
    required: true,
    type: 'checkbox',
    text: _('Enable'),
  },
  {
    id: 'ping_delay',
    label: _('PING Delay'),
    fieldset: 'service_setting',
    type: 'number',
    help: _('Second'),
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