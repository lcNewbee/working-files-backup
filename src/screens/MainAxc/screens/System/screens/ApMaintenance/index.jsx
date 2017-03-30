import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { Map, fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import AppScreen from 'shared/components/Template/AppScreen';
import { countryOptions } from 'shared/config/axcRadio';
import { actions as appActions } from 'shared/containers/app';
import { actions as screenActions } from 'shared/containers/appScreen';

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
    label: __('AP Number of Re-joins'),
    fieldset: 'retainDays',
    defaultValue: '7',
    type: 'number',
    min: '1',
    max: '365',
  }, {
    id: 'echotime',
    label: __('AP Heartbeat Time'),
    fieldset: 'retainDays',
    defaultValue: '60',
    maxLength: '12',
    type: 'number',
    min: '30',
    help: __('Seconds'),
  }, {
    id: 'statistime',
    label: __('AP Data Reporting Time'),
    fieldset: 'retainDays',
    defaultValue: '120',
    maxLength: '12',
    type: 'number',
    min: '30',
    help: __('Seconds'),
  }, {
    id: 'autoap',
    label: __('Allow Automatic Add AP'),
    fieldset: 'retainDays',
    type: 'checkbox',
    value: '1',
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

export default class View extends React.PureComponent {
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
