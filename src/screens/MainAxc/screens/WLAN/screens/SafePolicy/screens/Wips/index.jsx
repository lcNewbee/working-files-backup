import React from 'react'; import PropTypes from 'prop-types';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { actions as appActions } from 'shared/containers/app';

const settingsFormOptions = fromJS([
  {
    id: 'enable',
    width: 60,
    label: __('Enable'),
    type: 'checkbox',
    dataType: 'number',
    value: '1',
  }, {
    id: 'apopermode',
    width: 120,
    label: __('AP Work Mode'),
    options: [
      {
        value: 1,
        label: __('Normal'),
      }, {
        value: 2,
        label: __('Monitor'),
      },
    ],
    defaultValue: 1,
    type: 'switch',
    dataType: 'number',
    value: 1,
  }, {
    id: 'scantype',
    label: __('Scan Type'),
    options: [
      {
        value: 2,
        label: __('Passive'),
      }, {
        value: 1,
        label: __('Initiative'),
      },
    ],
    type: 'switch',
    dataType: 'number',
    defaultValue: 1,
  },
  {
    id: 'scanSpectrum',
    label: __('Scanning Band'),
    type: 'checkboxs',
    required: true,
    options: [{ label: '5G', value: '5' }, { label: '2.4G', value: '2' }],
    defaultValue: '2,5',
    value: '2,5',
    boxStyle: { marginRight: '20px' },
  },
  {
    id: 'cycles',
    label: __('Scan Cycles Times'),
    min: 0,
    max: 255,
    type: 'number',
    help: '0~255',
    dataType: 'number',
    defaultValue: 1,
  },
  {
    id: 'rpttime',
    label: __('Channel Quality Report Cycle'),
    type: 'number',
    min: 1,
    max: 65535,
    dataType: 'number',
    defaultValue: 30,
    required: true,
    help: __('Seconds'),
  },
  {
    id: 'enable2g4chl',
    label: __('Auto Channel'),
    type: 'checkbox',
    linkId: 'enable5gchl',
    dataType: 'number',
    defaultValue: 0,
    value: 1,
  }, {
    id: 'enable2g4pwr',
    label: __('Auto Power'),
    type: 'checkbox',
    linkId: 'enable5gpwr',
    dataType: 'number',
    defaultValue: 0,
    value: 1,
  },
  {
    id: 'maxtxpwr',
    label: __('Max Power'),
    type: 'select',
    defaultValue: '100%',
    options: [
      {
        value: '3%',
        label: '3%',
      }, {
        value: '6%',
        label: '6%',
      }, {
        value: '12%',
        label: '12%',
      }, {
        value: '25%',
        label: '25%',
      }, {
        value: '50%',
        label: '50%',
      }, {
        value: '100%',
        label: '100%',
      },
    ],
    visible($$data) {
      return $$data.get('enable2g4pwr') === 1;
    },
  },
  // {
  //   id: 'adjafactor2g4',
  //   label: __('Neighbor Coefficient'),
  //   linkId: 'adjafactor5g',
  //   min: 1,
  //   max: 255,
  //   type: 'number',
  //   dataType: 'number',
  //   defaultValue: '1',
  // },
]);

const propTypes = {
  changeScreenActionQuery: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);
    utils.binds(this, [
      'onBeforeSave',
    ]);
  }
  onBeforeSave($$actionQuery, $$curSettings) {
    this.props.changeScreenActionQuery({
      enable: $$curSettings.get('enable'),
    });
  }
  render() {
    return (
      <AppScreen
        {...this.props}
        settingsFormOptions={settingsFormOptions}
        settingOnlyChanged
        hasSettingsSaveButton
        onBeforeSave={this.onBeforeSave}
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
    groupid: state.product.getIn(['group', 'selected', 'id']),
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
