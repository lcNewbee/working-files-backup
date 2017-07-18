import React from 'react';
import PropTypes from 'prop-types';
import Calendar from 'rc-calendar';
import DatePicker from 'rc-calendar/lib/Picker';
import TimePickerPanel from 'rc-time-picker/lib/Panel';
import 'rc-calendar/assets/index.css';
import 'rc-time-picker/assets/index.css';

import moment from 'moment';

const format = 'YYYY-MM-DD HH:mm:ss';

function getFormat(showTime) {
  return showTime ? format : 'YYYY-MM-DD';
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
        style={{ zIndex: 1000 }}
        dateInputPlaceholder={placeholder}
        // disabledTime={props.showTime ? disabledTime : null}
        formatter={getFormat(showTime)}
        timePicker={showTime ? timePickerElement : null}
        showDateInput={showDateInput}
        disabledDate={() => !disablePastDays}
      />
    );
  }

  renderSelector() {
    const { value, disabled, showTime } = this.props;
    return (
      <input
        placeholder={__('please select')}
        disabled={disabled}
        readOnly
        className="ant-calendar-picker-input ant-inpue"
        value={(value && value.format(getFormat(showTime))) || ''}
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
          value={value}
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
