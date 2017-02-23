import React, { PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Input from './atom/Input';

const propTypes = {
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  onChange: PropTypes.func,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

const defaultProps = {
  min: '',
  max: '',
};

class NumberInput extends React.Component {
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.onNumberChange = this.onNumberChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }
  onNumberChange(e, needRelace) {
    const { min, max, defaultValue } = this.props;
    const val = e.target.value;
    const numberVal = parseFloat(val, 10);
    let relaceValue;

    if (this.props.onChange) {
      // 为空，或 - 时不做处理
      if (val !== '' && val !== '-') {
        // 小于或等于最小值，则返回最小值
        if ((numberVal <= parseFloat(min, 10)) && needRelace) {
          relaceValue = min;

        // 大于或等于最大值，则返回最大值
        } else if (numberVal >= parseFloat(max, 10) && needRelace) {
          relaceValue = max;
        }

      // 为空时默认替换为 defaultValue 或 max
      } else if (needRelace && isNaN(numberVal)) {
        relaceValue = defaultValue !== undefined ? defaultValue : max;
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
