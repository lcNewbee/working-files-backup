import React from 'react';
// import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
// import validator from 'shared/validator';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as appActions } from 'shared/containers/app';
import { AppScreen, actions as screenActions } from 'shared/containers/appScreen';

function generateFormOptions() {
  const options = fromJS([
    {
      id: 'aliStatus',
      label: __('Status'),
      fieldset: 'alipay',
      legend: __('Alipay Payment Settings'),
      type: 'checkbox',
    },
    {
      id: 'aliCooId',
      fieldset: 'alipay',
      disabled: item => item.get('aliStatus') !== '1',
      label: __('Cooperative ID'),
      required: true,
      type: 'text',
    },
    {
      id: 'aliSecurCode',
      fieldset: 'alipay',
      disabled: item => item.get('aliStatus') !== '1',
      label: __('Security Code'),
      required: true,
      type: 'text',
    },
    {
      id: 'wechatStatus',
      fieldset: 'wechat',
      legend: __('Wechat Payment Settings'),
      label: __('Status'),
      type: 'checkbox',
    },
    {
      id: 'appId',
      fieldset: 'wechat',
      disabled: item => item.get('wechatStatus') !== '1',
      label: __('AppID'),
      required: true,
      type: 'text',
    },
    {
      id: 'appSecret',
      fieldset: 'wechat',
      disabled: item => item.get('wechatStatus') !== '1',
      label: __('AppSecret'),
      required: true,
      type: 'text',
    },
    {
      id: 'wechatCooId',
      fieldset: 'wechat',
      disabled: item => item.get('wechatStatus') !== '1',
      label: __('Cooperative ID'),
      required: true,
      type: 'text',
    },
    {
      id: 'wechatSecurCode',
      fieldset: 'wechat',
      disabled: item => item.get('wechatStatus') !== '1',
      label: __('Security Code'),
      required: true,
      type: 'text',
    },
  ]);
  return options;
}

export default class PaymentSettings extends React.Component {

  render() {
    return (
      <AppScreen
        {...this.props}
        settingsFormOptions={generateFormOptions()}
        hasSettingsSaveButton
      />
    );
  }
}

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

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PaymentSettings);
