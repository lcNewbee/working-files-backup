import React from 'react'; import PropTypes from 'prop-types';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { Map, fromJS } from 'immutable';
import { bindActionCreators } from 'redux';

import { actions as appActions } from 'shared/containers/app';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import TIME_ZONE from 'shared/config/timeZone';
import validator from 'shared/validator';

const propTypes = {
  store: PropTypes.instanceOf(Map),
  app: PropTypes.instanceOf(Map),
};
const defaultProps = {};
const MY_TIME_ZONE = TIME_ZONE.map(
  (item) => {
    const prefix = item.label.split(')')[0].replace('(', '');
    const ret = item;

    ret.zoneCode = prefix;
    return ret;
  },
);
const settingsOptions = fromJS([
  {
    id: 'ac_onoff',
    label: __('Enable NTP Sync'),
    fieldset: 'acTime',
    legend: __('AC Time Synchronization Setting'),
    type: 'checkbox',
  },
  {
    id: 'ac_server_name',
    fieldset: 'acTime',
    label: __('NTP Server'),
    type: 'text',
    required: true,
    validator: validator({
      rules: 'ip',
    }),
  },
  {
    id: 'ac_referral_server',
    fieldset: 'acTime',
    label: __('Referral Server'),
    type: 'text',
    validator: validator({
      rules: 'ip',
    }),
  },
  {
    id: 'ac_TimeInterval',
    fieldset: 'acTime',
    label: __('Poll Interval'),
    type: 'number',
    required: true,
    help: __('Second'),
    min: '5',
    max: '50000',
    validator: validator({
      rules: 'num[5,50000]',
    }),
  },
  {
    id: 'ac_timezone',
    fieldset: 'acTime',
    label: __('Time Zone'),
    type: 'select',
    required: true,
    options: MY_TIME_ZONE,
    onChange(data) {
      const curZoneCode = data.zoneCode;
      const retData = data;

      retData.mergeData = {
        mysql_time_zone: curZoneCode,
      };

      return data;
    },
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
