import React, { PropTypes } from 'react';
import utils, { immutableUtils } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import AppScreen from 'shared/components/Template/AppScreen';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';

const settingsFormOptions = fromJS([
  {
    id: 'enable',
    width: '60',
    label: _('Enable'),
    type: 'checkbox',
    dataType: 'number',
    value: '1',
  }, {
    id: 'apopermode',
    width: '120',
    label: _('AP Work Mode'),
    options: [
      {
        value: 1,
        label: _('Normal'),
      }, {
        value: 2,
        label: _('Monitor'),
      },
    ],
    defaultValue: '1',
    type: 'switch',
    dataType: 'number',
    value: '1',
  }, {
    id: 'scantype',
    label: _('Scan Type'),
    options: [
      {
        value: 2,
        label: _('Passive'),
      }, {
        value: 1,
        label: _('Initiative'),
      },
    ],
    type: 'switch',
    dataType: 'number',
    defaultValue: '1',
  }, {
    id: 'cycles',
    label: _('Scan Cycles Times'),
    min: 0,
    max: 255,
    type: 'number',
    help: '0~255',
    dataType: 'number',
    defaultValue: '1',
  }, {
    id: 'maxtxpwr',
    label: _('Max Power'),
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
  }, {
    id: 'rpttime',
    label: _('Channel Quality Report Cycle'),
    type: 'number',
    min: 1,
    dataType: 'number',
    defaultValue: '1',
    help: _('Seconds'),
  }, {
    id: 'chlnum',
    label: _('Channel Set'),
    help: _('e.g. %s', '1,5,8'),
    defaultValue: '',
  }, {
    id: 'enable2g4chl',
    label: _('Auto Channel'),
    type: 'checkbox',
    linkId: 'enable5gchl',
    dataType: 'number',
    defaultValue: '1',
    value: '1',
  }, {
    id: 'enable2g4pwr',
    label: _('Auto Power'),
    type: 'checkbox',
    linkId: 'enable5gpwr',
    dataType: 'number',
    defaultValue: '1',
    value: '1',
  }, {
    id: 'adjafactor2g4',
    label: _('Neighbor Coefficient'),
    linkId: 'adjafactor5g',
    min: 1,
    max: 255,
    type: 'number',
    dataType: 'number',
    defaultValue: '1',
  },
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
