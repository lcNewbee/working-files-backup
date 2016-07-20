import React, { PropTypes } from 'react';
import Input from './Input';

const propTypes = {
  className: PropTypes.string,
  value: PropTypes.string,
  options: PropTypes.object,
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
