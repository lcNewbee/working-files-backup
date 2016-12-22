import React, { PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Input from './atom/Input';

const propTypes = {
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  onChange: PropTypes.func,
};

const defaultProps = {
  min: -9007199254740991,
  max: 9007199254740991,
};

class NumberInput extends React.Component {
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.onNumberChange = this.onNumberChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }
  onNumberChange(e, needMin) {
    const { min, max } = this.props;
    const val = e.target.value;

    if (this.props.onChange) {
      // 为空，或 - 时不做处理
      if (val !== '' && val !== '-') {
        // 小于或等于最小值，则返回最小值
        if ((parseInt(val, 10) <= parseInt(min, 10)) && needMin) {
          this.props.onChange(e, min);

        // 大于或等于最大值，则返回最大值
        } else if (parseInt(val, 10) >= parseInt(max, 10)) {
          this.props.onChange(e, max);

        // 在范围内
        } else {
          this.props.onChange(e);
        }
      } else {
        this.props.onChange(e);
      }
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
