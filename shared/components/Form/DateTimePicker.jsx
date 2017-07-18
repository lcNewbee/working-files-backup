import React from 'react';
import PropTypes from 'prop-types';
import Calendar from 'rc-calendar';
import DatePicker from 'rc-calendar/lib/Picker';
import TimePickerPanel from 'rc-time-picker/lib/Panel';
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/en-gb';
import 'rc-calendar/assets/index.css';
import 'rc-time-picker/assets/index.css';
import zhCN from 'rc-calendar/lib/locale/zh_CN';
import enUS from 'rc-calendar/lib/locale/en_US';
import Input from './atom/Input';

const now = moment();
if (window.b28n.getLang() === 'cn') {
  now.locale('zh-cn').utcOffset(8);
} else {
  now.locale('en-gb').utcOffset(0);
}

const format = 'YYYY-MM-DD HH:mm:ss';

function getFormat(showTime) {
  return showTime ? format : 'YYYY-MM-DD';
}

function disablePast(current) {
  if (!current) {
    return false;
  }

  const date = moment();
  date.hour(0);
  date.minute(0);
  date.second(0);
  // can not select days before today
  return current.valueOf() < date.valueOf();
}

function enableAllDate() {
  return false;
}

const propTypes = {
  showTime: PropTypes.bool,
  showDateInput: PropTypes.bool,
  disabled: PropTypes.bool,
  disablePastDays: PropTypes.bool,
  placeholder: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
};

const defaultProps = {
  placeholder: __('please input'),
  showDateInput: true,
};

const timePickerElement = <TimePickerPanel defaultValue={moment('00:00:00', 'HH:mm:ss')} />;

export default class DateTimePicker extends React.Component {
  constructor(props) {
    super(props);
    this.renderCalendar = this.renderCalendar.bind(this);
    this.renderSelector = this.renderSelector.bind(this);
  }

  renderCalendar() {
    const { placeholder, showTime, showDateInput, disablePastDays } = this.props;
    return (
      <Calendar
        style={{ zIndex: 9999 }}
        dateInputPlaceholder={placeholder}
        locale={window.b28n.getLang() === 'cn' ? zhCN : enUS}
        formatter={getFormat(showTime)}
        timePicker={showTime ? timePickerElement : null}
        showDateInput={showDateInput}
        disabledDate={disablePastDays ? disablePast : enableAllDate}
      />
    );
  }

  renderSelector() {
    const { value, disabled, showTime } = this.props;
    return (
      <Input
        placeholder={__('please select')}
        disabled={disabled}
        readOnly
        className="ant-calendar-picker-input ant-inpue"
        value={(value && moment(value).format(getFormat(showTime))) || ''}
      />
    );
  }

  render() {
    const { disabled, value, onChange } = this.props;
    return (
      <div>
        <DatePicker
          animation="slide-up"
          disabled={disabled}
          calendar={this.renderCalendar()}
          defaultValue={now}
          value={moment(value)}
          onChange={onChange}
        >
          { this.renderSelector }
        </DatePicker>
      </div>
    );
  }
}

DateTimePicker.propTypes = propTypes;
DateTimePicker.defaultProps = defaultProps;
