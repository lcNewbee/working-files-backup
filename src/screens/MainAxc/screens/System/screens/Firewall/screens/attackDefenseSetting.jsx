import React from 'react'; import PropTypes from 'prop-types';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { Map, fromJS } from 'immutable';
import { bindActionCreators } from 'redux';

import { actions as appActions } from 'shared/containers/app';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import TIME_ZONE from 'shared/config/timeZone';
import validator from 'shared/validator';

const settingsOptions = fromJS([
  {
    id: 'xdos_enable',
    label: __('Enable Attack Defense'),
    type: 'checkbox',
    required: true,
  },
  {
    id: 'tcp_sys_dos_enable',
    label: __('Enable TCP System DOS'),
    type: 'checkbox',
    required: true,
  },
  {
    id: 'tcp_syn_limit_per',
    label: __('TCP Package Quantity'),
    defaultValue: '10',
    type: 'number',
    required: true,
    validator: validator({
      rules: 'number',
    }),
  },
  {
    id: 'icmp_echo_dos_enable',
    label: __('Enable ICMP DOS'),
    type: 'checkbox',
    required: true,
  },
  {
    id: 'icmp_echo_request_limit_per',
    label: __('ICMP Package Quantity'),
    defaultValue: '10',
    type: 'number',
    required: true,
  },
  {
    id: 'udp_limit_dos_enable',
    label: __('Enable UDP DOS'),
    type: 'checkbox',
    required: true,
  },
  {
    id: 'udp_limit_per',
    fieldset: 'attackDefense',
    label: __('UDP Package Quantity'),
    defaultValue: '600',
    type: 'number',
    required: true,
  },
]);

const propTypes = {
  app: PropTypes.instanceOf(Map),
  route: PropTypes.object,
  save: PropTypes.func,
  fetch: PropTypes.func,
  createModal: PropTypes.func,
  closeModal: PropTypes.func,
  changeModalState: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.Component {
  render() {
    return (
      <AppScreen
        {...this.props}
        settingsFormOptions={settingsOptions}
        hasSettingsSaveButton
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
