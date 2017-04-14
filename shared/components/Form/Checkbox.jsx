import React from 'react'; import PropTypes from 'prop-types';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Input from './atom/Input';

const propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOf(['md', 'lg']),
  theme: PropTypes.oneOf(['square']),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  id: PropTypes.string,
  options: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  style: PropTypes.object,
  text: PropTypes.string,
};

const defaultProps = {
  type: 'checkbox',
  onValue: 1,
  offValue: 0,
};

class Checkbox extends React.Component {
  constructor(props) {
    const { id } = props;
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

    if (!id) {
      this.id = `checkbox_${Math.random()}`;
    } else {
      this.id = id;
    }
  }
  render() {
    const { options, size, theme, className, style, text, ...restProps } = this.props;
    const label = options && options.label;
    const id = this.id;
    let { value } = this.props;
    let classNames = 'a-checkbox';

    value = value === undefined ? '1' : value;

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
          {...restProps}
          className="a-checkbox__input"
          id={id}
          value={value}
          style={style}
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
