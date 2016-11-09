import React, { PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Input from './atom/Input';

const propTypes = {
  unit: PropTypes.string,
  value: PropTypes.any,

  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  onChange: PropTypes.func,
};

const defaultProps = {
  min: -Number.MAX_VALUE,
  max: Number.MAX_VALUE,
};

class NumberInput extends React.Component {
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.onNumberChange = this.onNumberChange.bind(this);
  }
  onNumberChange(e) {
    const { min, max } = this.props;
    const val = e.target.value;

    if (this.props.onChange) {

      // 为空，或 - 时不做处理
      if (val !== '' && val !== '-') {

        // 小于或等于最小值，则返回最小值
        if (parseInt(val, 10) <= parseInt(min, 10)) {
          this.props.onChange(e, min);

        // 大于或等于最大值，则返回最大值
        } else if(parseInt(val, 10) >= parseInt(min, 10)) {
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
  render() {
    const { hasTextInput, unit, min } = this.props;
    return (
      <div className="a-input-number">
        <Input
          {...this.props}
          onChange={this.onNumberChange}
        />
      </div>
    );
  }
}

NumberInput.propTypes = propTypes;
NumberInput.defaultProps = defaultProps;

export default NumberInput;
