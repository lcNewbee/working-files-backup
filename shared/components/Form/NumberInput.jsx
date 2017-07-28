import React from 'react';
import PropTypes from 'prop-types';
import PureComponent from '../Base/PureComponent';
import Input from './atom/Input';

const propTypes = {
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

const defaultProps = {
  min: '',
  max: '',
};

class NumberInput extends PureComponent {
  constructor(props) {
    super(props);

    this.onNumberChange = this.onNumberChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }
  onNumberChange(e, needRelace) {
    const { min, max, defaultValue, required } = this.props;
    const val = e.target.value;
    const numberVal = parseFloat(val, 10);
    const relaceDefValue = defaultValue !== undefined ? defaultValue : (max || min);
    let relaceValue;

    if (this.props.onChange) {
      // 需要替换值
      if (needRelace) {
        // 默认不为空才考虑替换值
        if (val !== '') {
          // 小于或等于最小值，则返回最小值
          if ((numberVal <= parseFloat(min, 10))) {
            relaceValue = min;

          // 大于或等于最大值，则返回最大值
          } else if (numberVal >= parseFloat(max, 10)) {
            relaceValue = max;
          // 不能转换为数字时，替换为 defaultValue || max || min
          } else if (isNaN(numberVal)) {
            relaceValue = relaceDefValue;
          }

        // 如果是必填项，为空时也要替换
        } else if (required) {
          relaceValue = relaceDefValue;
        }
      }

      this.props.onChange(e, relaceValue);
    }
  }
  onBlur(e) {
    this.onNumberChange(e, true);
  }
  render() {
    let myClassName = 'a-input-number';

    if (this.props.className) {
      myClassName = `${myClassName} ${this.props.className}`;
    }
    return (
      <Input
        {...this.props}
        className={myClassName}
        onChange={this.onNumberChange}
        onBlur={this.onBlur}
      />
    );
  }
}

NumberInput.propTypes = propTypes;
NumberInput.defaultProps = defaultProps;

export default NumberInput;
