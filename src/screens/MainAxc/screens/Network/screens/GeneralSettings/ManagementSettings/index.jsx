import React from 'react';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as appActions } from 'shared/containers/app';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';

const propTypes = {};
const defaultProps = {};

const settingsFormOptions = fromJS([
  {
    id: 'deviceName',
    type: 'text',
    fieldset: 'generalsettings',
    label: __('Device Name'),
  },
  {
    id: 'ipSupport',
    type: 'switch',
    fieldset: 'generalsettings',
    label: __('IP Support'),
    options: [
      { label: __('IPv4'), value: 'v4' },
      { label: __('IPv6'), value: 'v6' },
      { label: __('IPv4 & IPv6'), value: 'v46' },
    ],
  },
  /** *****IPv4 settings********** */
  {
    id: 'ipv4Type',
    type: 'text',
    fieldset: 'ipv4settings',
    fieldsetOption: {
      className: 'fl',
    },
    label: __('IP'),
    legend: __('IPv4 Management Interface'),
    visible(item) {
      return item.get('ipSupport') === 'v4' || item.get('ipSupport') === 'v46';
    },
  },
  {
    id: 'ipv4Mask',
    type: 'text',
    fieldset: 'ipv4settings',
    label: __('Subnet Mask'),
    disabled: item => item.get('ipv4Type') === 'dhcp',
    visible(item) {
      return item.get('ipSupport') === 'v4' || item.get('ipSupport') === 'v46';
    },
  },
  {
    id: 'ipv4Vlan',
    type: 'number',
    fieldset: 'ipv4settings',
    label: __('Access VLAN'),
    visible(item) {
      return item.get('ipSupport') === 'v4' || item.get('ipSupport') === 'v46';
    },
  },
  /** ***IPv6 settings********* */
  {
    id: 'ipv6Ip',
    type: 'text',
    fieldset: 'ipv6settings',
    fieldsetOption: {
      className: 'fl',
    },
    label: __('IP'),
    disabled: item => item.get('ipv6Type') === 'auto',
    legend: __('IPv6 Management Interface'),
    visible(item) {
      return item.get('ipSupport') === 'v6' || item.get('ipSupport') === 'v46';
    },
  },
  {
    id: 'ipv6Prefix',
    type: 'text',
    fieldset: 'ipv6settings',
    label: __('Prefix Length'),
    disabled: item => item.get('ipv6Type') === 'auto',
    visible(item) {
      return item.get('ipSupport') === 'v6' || item.get('ipSupport') === 'v46';
    },
  },
]).groupBy(item => item.get('fieldset'))
  .toList();

export default class ManagementSettings extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <AppScreen
        {...this.props}
        settingsFormOptions={settingsFormOptions}
        hasSettingsSaveButton
      />
    );
  }
}

ManagementSettings.propTypes = propTypes;
ManagementSettings.defaultProps = defaultProps;

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
)(ManagementSettings);

