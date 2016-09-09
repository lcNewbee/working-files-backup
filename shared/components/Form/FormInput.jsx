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
  theme: PropTypes.string,
  size: PropTypes.oneOf(['min', 'sm', 'md', 'lg', 'xl']),
  type: PropTypes.oneOf([
    // html4
    '', 'text', 'file', 'password', 'textarea', 'radio', 'checkbox',
    'select', 'reset', 'submit', 'hidden', 'search',

    // html5
    'date', 'datetime', 'datetime-local', 'month', 'week', 'time',
    'email', 'number', 'color', 'range', 'tel', 'url',

    // custom
    'ip', 'mac', 'switch', 'plain-text',
  ]),
  check: PropTypes.func,
  checkClear: PropTypes.func,
  checkClearValue: PropTypes.func,
  onChange: PropTypes.func,
  label: PropTypes.any,
  value: PropTypes.oneOfType([
    PropTypes.string, PropTypes.number,
    PropTypes.instanceOf(moment),
  ]),

  // Select Option
  clearable: PropTypes.bool,
  searchable: PropTypes.bool,
  showSecond: PropTypes.bool,

  // Time or Date
  format: PropTypes.string,
};

const defaultProps = {
  Component: 'input',
  type: 'text',
};

class FormInput extends React.Component {
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onFoucs = this.onFoucs.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onTimeChange = this.onTimeChange.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
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
  onDateChange(momentObj) {
    const formatOption = this.props.format || 'YYYY-MM-DD';
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

  handleChange(e) {
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

    data.value = val;

    // 数据更新
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(data, e);
    }

    // 数据验证
    if (typeof this.props.checkClearValue === 'function' && !e.target.disabled) {
      this.props.checkClearValue(val);
    }
  }

  render() {
    const {
      Component, type, clearable, className, searchable,
      size, value, showSecond,
    } = this.props;
    const inpputType = this.props.type;
    const inputProps = utils.extend({}, this.props);
    let MyComponent = Component;
    let classNames = className || '';
    let timeValue = value;
    let timeFormat = 'hmmss';

    if (size) {
      classNames = `${classNames} input-${size}`;
    }

    if (inpputType === 'plain-text') {
      return <span className="plain-text">{value}</span>;
    } else if (inpputType === 'select') {
      return (<Select
        {...inputProps}
        className={classNames}
        clearable={clearable || false}
        searchable={searchable || false}
      />);
    } else if (inpputType === 'switch') {
      return (
        <Switchs
          {...inputProps}
        />
      );
    } else if (inpputType === 'time') {
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
    } else if (inpputType === 'date') {
      if (!moment.isMoment(timeValue)) {
        timeValue = moment(timeValue);
      }

      return (
        <DatePicker
          {...inputProps}
          onChange={this.onDateChange}
          selected={timeValue}
        />
      );
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
