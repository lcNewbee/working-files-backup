import React, { PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Input from './atom/Input';

const propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOf(['md', 'lg']),
  theme: PropTypes.oneOf(['square']),
  value: PropTypes.any,
  id: PropTypes.string,
  options: PropTypes.object,
  style: PropTypes.object,
  text: PropTypes.string,
};

const defaultProps = {
  type: 'radio',
};

class Radios extends React.Component {
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  render() {
    const { options, size, theme, className, style, text } = this.props;
    let { value, id } = this.props;
    let classNames = 'a-radio';

    let label = options && options.label;

    value = value === undefined ? '1' : value;

    if (!id) {
      id = `radio_${Math.random()}`;
    }

    if (size) {
      classNames = `${classNames} a-radio--${size}`;
    }

    if (theme) {
      classNames = `${classNames} a-radio--${theme}`;
    }

    if (className) {
      classNames = `${classNames} a-radio--${className}`;
    }

    return (
      <label htmlFor={id} className={classNames} style={style}>
        <Input
          {...this.props}
          className="a-radio__input"
          id={id}
          value={value}
        />
        <label htmlFor={id} />
        {
          text ? (
            <span className="a-radio__text">{text}</span>
          ) : null
        }
      </label>
    );
  }
}

Radios.propTypes = propTypes;
Radios.defaultProps = defaultProps;

export default Radios;
