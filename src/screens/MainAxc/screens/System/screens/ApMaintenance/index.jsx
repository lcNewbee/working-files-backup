import React from 'react';
import PropTypes from 'prop-types';
import utils from 'shared/utils';
import validator from 'shared/validator';
import { connect } from 'react-redux';
import { Map, fromJS } from 'immutable';
import { bindActionCreators } from 'redux';

import { countryOptions } from 'shared/config/axcRadio';
import { actions as appActions } from 'shared/containers/app';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';

const settingsFormOptions = fromJS([
  {
    id: 'countrycode',
    label: __('Country'),
    fieldset: 'retainDays',
    type: 'select',
    options: countryOptions,
    searchable: true,
  }, {
    id: 'discoverycnt',
    label: __('Number of Re-joins'),
    fieldset: 'retainDays',
    defaultValue: '7',
    type: 'number',
    dataType: 'number',
    min: '1',
    max: '365',
  }, {
    id: 'echotime',
    label: __('Heartbeat Time-out'),
    fieldset: 'retainDays',
    defaultValue: '60',
    maxLength: '12',
    type: 'number',
    dataType: 'number',
    min: '30',
    help: __('Seconds'),
  }, {
    id: 'statistime',
    label: __('Data Reporting Interval'),
    fieldset: 'retainDays',
    defaultValue: '120',
    maxLength: '12',
    type: 'number',
    min: '0',
    validator: validator({
      rules: 'num:[30, 999999999999]',
      exclude: 0,
    }),
    dataType: 'number',
    help: __('Seconds') + ` (${__('0 means disabled')})`,
  }, {
    id: 'autoap',
    label: __('Automatically Approve APs'),
    fieldset: 'retainDays',
    type: 'checkbox',
    dataType: 'number',
    value: 1,
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

export default class ApMaintenance extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <AppScreen
        {...this.props}
        settingsFormOptions={settingsFormOptions}
        hasSettingsSaveButton
        noTitle
      />
    );
  }
}


ApMaintenance.propTypes = propTypes;
ApMaintenance.defaultProps = defaultProps;

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
)(ApMaintenance);
