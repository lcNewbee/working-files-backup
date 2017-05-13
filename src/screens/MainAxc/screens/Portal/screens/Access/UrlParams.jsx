import React from 'react'; import PropTypes from 'prop-types';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { Map, fromJS } from 'immutable';
import { bindActionCreators } from 'redux';

import { actions as appActions } from 'shared/containers/app';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import validator from 'shared/validator';

const propTypes = {
  store: PropTypes.instanceOf(Map),
  app: PropTypes.instanceOf(Map),
};
const defaultProps = {};

const settingsOptions = fromJS([
  {
    id: 'basname',
    label: __('Bas Name'),
    fieldset: 'url_setting',
    type: 'text',
    legend: __('URL Parameter'),
    validator: validator({
      rules: 'utf8Len:[1,255]',
    }),
  },
  {
    id: 'userip',
    label: __('User IP'),
    fieldset: 'url_setting',
    type: 'text',
    required: true,
    validator: validator({
      rules: 'utf8Len:[1,32]',
    }),
  },
  {
    id: 'usermac',
    fieldset: 'url_setting',
    label: __('User Mac'),
    type: 'text',
    validator: validator({
      rules: 'utf8Len:[1,32]',
    }),
  },
  {
    id: 'url',
    fieldset: 'url_setting',
    label: __('URL'),
    type: 'text',
    validator: validator({
      rules: 'utf8Len:[1,128]',
    }),
  },
  {
    id: 'basip',
    required: true,
    fieldset: 'url_setting',
    label: __('Bas IP'),
    type: 'text',
    validator: validator({
      rules: 'utf8Len:[1,32]',
    }),
  },
  {
    id: 'ssid',
    fieldset: 'url_setting',
    label: __('SSID'),
    type: 'text',
    validator: validator({
      rules: 'utf8Len:[1,255]',
    }),
  },
  {
    id: 'apmac',
    fieldset: 'url_setting',
    label: __('Access Point MAC Address'),
    type: 'text',
    validator: validator({
      rules: 'utf8Len:[1,255]',
    }),
  },
  {
    id: 'apip',
    fieldset: 'url_setting',
    label: __('AP IP'),
    type: 'text',
    validator: validator({
      rules: 'utf8Len:[1,255]',
    }),
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
