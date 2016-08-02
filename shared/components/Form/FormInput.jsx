import React, { PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Select from '../Select';
import Checkbox from './Checkbox';
import Password from './Password';
import Input from './atom/Input';
import utils from '../../utils';

const propTypes = {
  className: PropTypes.string,
  Component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  size: PropTypes.oneOf(['min', 'sm', 'md', 'lg', 'xl']),
  type: PropTypes.oneOf([undefined, '', 'text', 'password', 'radio', 'checkbox',
    'date', 'email', 'number', 'color', 'select']),
  check: PropTypes.func,
  checkClear: PropTypes.func,
  checkClearValue: PropTypes.func,
  onChange: PropTypes.func,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  clearable: PropTypes.bool,
  searchable: PropTypes.bool,
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
      size, value,
    } = this.props;
    const inpputType = this.props.type;
    const inputProps = utils.extend({}, this.props);
    let MyComponent = Component;
    let classNames = className || '';

    if (size) {
      classNames = `${classNames} input-${size}`;
    }

    if (inpputType === 'select') {
      return (<Select
        {...inputProps}
        className={classNames}
        clearable={clearable || false}
        searchable={searchable || false}
      />);
    }

    if (Component === 'input') {
      if (inpputType === 'password') {
        MyComponent = Password;
      } else if (inpputType === 'checkbox') {
        MyComponent = Checkbox;
      } else {
        MyComponent = Input;
      }
    }

    if (inpputType !== 'checkbox' && inpputType !== 'radio') {
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
