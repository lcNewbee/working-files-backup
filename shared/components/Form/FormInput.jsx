import React, { PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import moment from 'moment';
import Select from '../Select';
import Checkbox from './Checkbox';
import Password from './Password';
import Range from './Range';
import Radios from './Radios';
import Input from './atom/Input';
import Switchs from '../Switchs';
import TimePicker from '../TimePicker';
import DatePicker from '../DatePicker';
import utils from '../../utils';

const propTypes = {
  disabled: PropTypes.bool,
  className: PropTypes.string,
  Component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  size: PropTypes.oneOf(['min', 'sm', 'md', 'lg', 'xl']),
  type: PropTypes.oneOf([
    // html4
    '', 'text', 'file', 'password', 'textarea', 'radio', 'checkbox',
    'select', 'reset', 'submit', 'hidden', 'search',

    // html5
    'date', 'datetime', 'datetime-local', 'month', 'week', 'time',
    'email', 'number', 'color', 'range', 'tel', 'url',

    // custom
    'ip', 'mac', 'switch', 'plain-text', 'date-range',
  ]),
  check: PropTypes.func,
  checkClear: PropTypes.func,
  checkClearValue: PropTypes.func,
  onChange: PropTypes.func,
  label: PropTypes.any,
  value: PropTypes.any,

  // Select Option
  clearable: PropTypes.bool,
  searchable: PropTypes.bool,
  showSecond: PropTypes.bool,

  // Time or Date
  format: PropTypes.string,
  displayFormat: PropTypes.string,
};

const defaultProps = {
  Component: 'input',
  type: 'text',
};

class FormInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focusedInput: null,
    };
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

    utils.binds(this, [
      'onBlur',
      'onFoucs',
      'handleChange',
      'onDateChange',
      'onDatesChange',
      'onTimeChange',
      'renderCustomInput',
      'onDateFocusChange',
    ]);
  }

  onBlur(e) {
    if (this.props.check) {
      this.props.check(e);
    }
  }

  onFoucs(e) {
    if (this.props.checkClear) {
      this.props.checkClear(e);
    }
  }
  onDateFocusChange(focusedInput) {
    if (typeof focusedInput === 'object' &&
        focusedInput !== null) {
      this.setState({
        focusedInput: focusedInput.focused,
      });
    } else {
      this.setState({ focusedInput });
    }
  }
  onDateChange(momentObj) {
    const formatOption = this.props.displayFormat || 'YYYY-MM-DD';
    const data = {
      label: this.props.label,
      value: momentObj.format(formatOption),
      momentObj,
    };

    // 数据更新
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(data);
    }

    // 值为空是进行数据验证
    if (typeof this.props.checkClearValue === 'function' && this.props.disabled &&
        data.value === '') {
      this.props.checkClearValue(data.value);
    }
  }

  onDatesChange(data) {
    const formatOption = this.props.displayFormat || 'YYYY-MM-DD';
    const newData = data;

    if (moment.isMoment(data.startDate)) {
      newData.startValue = data.startDate.format(formatOption);
    } else {
      newData.startValue = data.startDate;
    }

    if (moment.isMoment(data.endDate)) {
      newData.endValue = data.endDate.format(formatOption);
    } else {
      newData.endValue = data.endDate;
    }

    // 数据更新
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(data);
    }

    // 值为空是进行数据验证
    if (typeof this.props.checkClearValue === 'function' && this.props.disabled &&
        (!data.startValue || !data.endValue)) {
      this.props.checkClearValue(data.startValue);
      this.props.checkClearValue(data.endValue);
    }
  }

  onTimeChange(momentObj) {
    const formatOption = this.props.format || 'HH:mm:ss';
    const data = {
      label: this.props.label,
    };

    data.value = momentObj.format(formatOption);

    // 数据更新
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(data, momentObj);
    }

    // 值为空是进行数据验证
    if (typeof this.props.checkClearValue === 'function' && this.props.disabled &&
        data.value === '') {
      this.props.checkClearValue(data.value);
    }
  }

  handleChange(e, rawValue) {
    const elem = e.target;
    let val = elem.value;
    let checkedValue = '1';
    const data = {
      label: this.props.label,
    };

    if (elem.type === 'checkbox') {
      if (elem.value) {
        checkedValue = elem.value;
      }
      val = elem.checked ? checkedValue : '0';
    }

    data.value = rawValue || val;

    // 数据更新
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(data, e);
    }

    // 数据验证
    if (typeof this.props.checkClearValue === 'function' && !e.target.disabled) {
      this.props.checkClearValue(val);
    }
  }
  renderCustomInput(classNames) {
    const {
      clearable, searchable, value, showSecond,
    } = this.props;
    const inpputType = this.props.type;
    const inputProps = utils.extend({}, this.props);
    let timeValue = value;
    let timeFormat = 'hmmss';
    const monthFormat = inputProps.monthFormat;
    const displayFormat = inputProps.displayFormat || 'YYYY-MM-DD';

    switch (inpputType) {
      case 'plain-text':
        return (
          <span className="plain-text">
            {value}
          </span>
        );

      case 'select':
        return (<Select
          {...inputProps}
          className={classNames}
          clearable={clearable || false}
          searchable={searchable || false}
        />);
      case 'switch':
        return (
          <Switchs
            {...inputProps}
          />
        );

      case 'time':
        if (!showSecond) {
          timeFormat = 'hmm';
        }
        if (!moment.isMoment(timeValue)) {
          timeValue = moment(timeValue, timeFormat);
        }

        return (
          <TimePicker
            {...inputProps}
            onChange={this.onTimeChange}
          />
        );

      case 'date':
        if (!moment.isMoment(timeValue)) {
          timeValue = moment(timeValue);
        }
        if (!inputProps.id) {
          inputProps.id = `data${Math.random()}`;
        }
        return (
          <DatePicker.SingleDatePicker
            {...inputProps}
            numberOfMonths={inputProps.numberOfMonths || 1}
            date={timeValue}
            displayFormat={displayFormat}
            monthFormat={monthFormat}
            onFocusChange={this.onDateFocusChange}
            onDateChange={this.onDateChange}
            focused={!!this.state.focusedInput}
          />
        );

      case 'date-range':
        if (!moment.isMoment(timeValue)) {
          timeValue = moment(timeValue);
        }

        if (!inputProps.id) {
          inputProps.id = `data${Math.random()}`;
        }

        return (
          <DatePicker.DateRangePicker
            {...inputProps}
            displayFormat={displayFormat}
            monthFormat={monthFormat}
            onFocusChange={this.onDateFocusChange}
            onDatesChange={this.onDatesChange}
            focusedInput={this.state.focusedInput}
          />
        );

      default:
        return null;
    }
  }

  render() {
    const {
      Component, type, className, size, value,
    } = this.props;
    const inpputType = this.props.type;
    const inputProps = utils.extend({}, this.props);
    let MyComponent = Component;
    let classNames = className || '';
    let customRender = null;

    if (size) {
      classNames = `${classNames} input-${size}`;
    }

    customRender = this.renderCustomInput(classNames);

    if (customRender) {
      return customRender;
    }

    if (Component === 'input') {
      if (inpputType === 'password') {
        MyComponent = Password;
      } else if (inpputType === 'checkbox') {
        MyComponent = Checkbox;
      } else if (inpputType === 'radio') {
        MyComponent = Radios;
      } else if (inpputType === 'range') {
        MyComponent = Range;
      } else {
        MyComponent = Input;
      }
    }

    if (inpputType !== 'checkbox' && inpputType !== 'radio' &&
        inpputType !== 'range') {
      classNames = `${classNames} text`;
    }

    return (
      <MyComponent
        {...inputProps}
        type={type}
        value={value}
        className={classNames}
        onChange={this.handleChange}
        onBlur={this.onBlur}
      />
    );
  }
}

FormInput.propTypes = propTypes;
FormInput.defaultProps = defaultProps;

export default FormInput;
