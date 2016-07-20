import React, { PropTypes } from 'react';
import Input from './Input';

const propTypes = {
  className: PropTypes.string,
  value: PropTypes.string,
  options: PropTypes.object,
  id: PropTypes.string,
  size: PropTypes.oneOf(['lg', '2x', '3x', '4x', '5x']),
  rotate: PropTypes.oneOf(['45', '90', '135', '180', '225', '270', '315']),
  flip: PropTypes.oneOf(['horizontal', 'vertical']),
  fixedWidth: PropTypes.bool,
  spin: PropTypes.bool,
  pulse: PropTypes.bool,
  stack: PropTypes.oneOf(['1x', '2x']),
  inverse: PropTypes.bool,
  Component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
};

const defaultProps = {
  type: 'checkbox',
};

class Checkbox extends React.Component {
  render() {
    const options = this.props.options;
    let { value, id } = this.props;

    let label = options && options.label;

    value = value === undefined ? '1' : value;

    if (!id) {
      id = `checkbox_${Math.random()}`;
    }

    return (
      <div className="checkbox">
        <Input
          {...this.props}
          id={id}
          value={value}
        />
        <label htmlFor={id}>{label || ' '}</label>
      </div>
    );
  }
}

Checkbox.propTypes = propTypes;
Checkbox.defaultProps = defaultProps;

export default Checkbox;
