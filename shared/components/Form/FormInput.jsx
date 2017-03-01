import React, { PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import moment from 'moment';
import Select from '../Select';
import Checkbox from './Checkbox';
import Password from './Password';
import RangeInput from './Range';
import Radios from './Radios';
import Input from './atom/Input';
import NumberInput from './NumberInput';
import FileInput from './File';
import Checkboxs from './Checkboxs';
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
    'switch', 'plain-text', 'date-range', 'checkboxs',
  ]),
  dataType: PropTypes.oneOf(['string', 'number', 'ip', 'mac']),
  dataFormat: PropTypes.object,
  check: PropTypes.func,
  checkClear: PropTypes.func,
  checkClearValue: PropTypes.func,
  filter: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  onChange: PropTypes.func,
  label: PropTypes.any,
  value: PropTypes.any,

  // Select Option
  clearable: PropTypes.bool,
  searchable: PropTypes.bool,

  // Time or Date
  formatter: PropTypes.string,
  displayFormat: PropTypes.string,
};

const defaultProps = {
  Component: 'input',
  type: 'text',
  dataType: 'string',
  dataFormat: null,
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
    const formatOption = this.props.formatter || 'HH:mm:ss';
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

  filterValue(val) {
    const { filter } = this.props;
    let ret = val;

    if (utils.isFunc(filter)) {
      ret = this.props.filter(val);
    }

    return ret;
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

    data.value = rawValue !== undefined ? rawValue : val;

    if (this.props.dataType === 'number' && data.value !== '') {
      data.value = Number(data.value, 10);
    }

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
      clearable, searchable, value,
    } = this.props;
    const inpputType = this.props.type;
    const inputProps = utils.extend({}, this.props);
    let timeValue = value;
    const monthFormat = inputProps.monthFormat;
    const displayFormat = inputProps.displayFormat || 'YYYY-MM-DD';

    inputProps.value = this.filterValue(value);

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

      case 'checkboxs':
        return (
          <Checkboxs
            {...inputProps}
          />
        );

      case 'time':
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
      Component, type, className, size, value, ...restProps
    } = this.props;
    const inpputType = this.props.type;
    const inputProps = utils.extend({}, this.props);
    let MyComponent = Component;
    let classNames = className || '';
    let customRender = null;

    inputProps.value = this.filterValue(value);

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
        MyComponent = RangeInput;
      } else if (inpputType === 'number') {
        MyComponent = NumberInput;
      } else if (inpputType === 'file') {
        MyComponent = FileInput;
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
