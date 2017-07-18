import React from 'react'; import PropTypes from 'prop-types';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { Map, fromJS } from 'immutable';
import { bindActionCreators } from 'redux';

import { actions as appActions } from 'shared/containers/app';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { FormInput } from 'shared/components';
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
      rules: 'domainIP',
    }),
    disabled: item => item.get('ac_onoff') === '0',
  },
  {
    id: 'ac_referral_server',
    fieldset: 'acTime',
    label: __('Referral Server'),
    type: 'text',
    validator: validator({
      rules: 'domainIP',
    }),
    disabled: item => item.get('ac_onoff') === '0',
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
    disabled: item => item.get('ac_onoff') === '0',
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
    disabled: item => item.get('ac_onoff') === '0',
  },
  {
    id: 'ac_manual_time',
    fieldset: 'acTime',
    label: __('Manual Time'),
    type: 'datetime',
    showTime: true,
    // help: `${__('Example')}: 1970-1-1 10:10:10`,
    disabled: item => item.get('ac_onoff') === '1',
  },
]).groupBy(item => item.get('fieldset'))
.toList();

function onBeforeSave($$actionQuery, $$curSettings) {
  const fullTimeStr = $$curSettings.get('ac_manual_time');
  const fullTime = new Date(fullTimeStr);
  if (fullTime.toString() === 'Invalid Date') return __('Invalid Manual Time!');

  const date = fullTimeStr.split(/\s+/)[0];
  const time = fullTimeStr.split(/\s+/)[1];
  if (!date || !time) return __('Invalid Manual Time!');

  const dateArr = date.split('-');
  const timeArr = time.split(':');
  if (dateArr.length > 3 || timeArr.length > 3) return __('Invalid Manual Time!');

  const originYear = parseInt(dateArr[0].replace(/(^\s*)|(\s*$)/g, ''), 10);
  const originMonth = parseInt(dateArr[1].replace(/(^\s*)|(\s*$)/g, ''), 10);
  const originDay = parseInt(dateArr[2].replace(/(^\s*)|(\s*$)/g, ''), 10);
  const originHour = parseInt(timeArr[0].replace(/(^\s*)|(\s*$)/g, ''), 10);
  const originMinute = parseInt(timeArr[1].replace(/(^\s*)|(\s*$)/g, ''), 10);
  const originSecond = parseInt(timeArr[2].replace(/(^\s*)|(\s*$)/g, ''), 10);
  if (!(originYear && originMonth && originDay) || !(typeof originYear !== 'undefined' &&
        typeof originMinute !== 'undefined' && typeof originSecond !== 'undefined')) {
    return __('Invalid Manual Time!');
  }

  const year = fullTime.getFullYear();
  const month = fullTime.getMonth() + 1;
  const day = fullTime.getDate();
  const hour = fullTime.getHours();
  const minute = fullTime.getMinutes();
  const second = fullTime.getSeconds();

  if (!(originYear === year && originMonth === month && originDay === day &&
        originHour === hour && originMinute === minute && originSecond === second)) {
    return __('Invalid Manual Time!');
  }

  return '';
}

export default class View extends React.Component {

  render() {
    return (
      <AppScreen
        {...this.props}
        settingsFormOptions={settingsOptions}
        onBeforeSave={onBeforeSave}
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
