import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { Map, fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import AppScreen from 'shared/components/Template/AppScreen';
import * as appActions from 'shared/actions/app';
import * as screenActions from 'shared/actions/screens';
import validator from 'shared/utils/lib/validator';

const propTypes = {
  store: PropTypes.instanceOf(Map),
  app: PropTypes.instanceOf(Map),
};
const defaultProps = {};

const settingsOptions = fromJS([
  {
    id: 'basname',
    label: _('Bas Name'),
    fieldset: 'url_setting',
    type: 'text',
    legend: 'Url Parameter',
    required: true,
  },
  {
    id: 'userip',
    label: _('User IP'),
    fieldset: 'url_setting',
    type: 'text',
    required: true,
    validator: validator({
      rules: 'ip',
    }),
  },
  {
    id: 'usermac',
    fieldset: 'url_setting',
    label: _('User Mac'),
    type: 'text',
    required: true,
    validator: validator({
      rules: 'mac',
    }),
  },
  {
    id: 'url',
    required: true,
    fieldset: 'url_setting',
    label: _('Url'),
    type: 'text',
  },
  {
    id: 'basip',
    required: true,
    fieldset: 'url_setting',
    label: _('Bas IP'),
    type: 'text',
    validator: validator({
      rules: 'ip',
    }),
  },
  {
    id: 'ssid',
    required: true,
    fieldset: 'url_setting',
    label: _('SSID'),
    type: 'text',
  },
  {
    id: 'apmac',
    required: true,
    fieldset: 'url_setting',
    label: _('AP Mac'),
    type: 'text',
    validator: validator({
      rules: 'mac',
    }),
  }
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
