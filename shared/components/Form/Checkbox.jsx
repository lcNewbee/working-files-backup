import React, { PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Input from './atom/Input';

const propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOf(['md', 'lg']),
  theme: PropTypes.oneOf(['square']),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  id: PropTypes.string,
  options: PropTypes.object,
  style: PropTypes.object,
  text: PropTypes.string,
};

const defaultProps = {
  type: 'checkbox',
};

class Checkbox extends React.Component {
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  render() {
    const { options, size, theme, className, style, text } = this.props;
    let { value, id } = this.props;
    let classNames = 'a-checkbox';

    let label = options && options.label;

    value = value === undefined ? '1' : value;

    if (!id) {
      id = `checkbox_${Math.random()}`;
    }

    if (size) {
      classNames = `${classNames} a-checkbox--${size}`;
    }

    if (theme) {
      classNames = `${classNames} a-checkbox--${theme}`;
    }

    if (className) {
      classNames = `${classNames} a-checkbox--${className}`;
    }

    return (
      <label htmlFor={id} className={classNames} style={style}>
        <Input
          {...this.props}
          className="a-checkbox__input"
          id={id}
          value={value}
        />
        <label htmlFor={id} />
        {
          text ? (
            <span className="a-checkbox__text">{text}</span>
          ) : null
        }
      </label>
    );
  }
}

Checkbox.propTypes = propTypes;
Checkbox.defaultProps = defaultProps;

export default Checkbox;
