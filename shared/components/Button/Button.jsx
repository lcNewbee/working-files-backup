import React, { PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Icon from '../Icon';
import utils from '../../utils';
import '../../scss/01_atom/_a-button.scss';

const propTypes = {
  icon: PropTypes.string,
  className: PropTypes.string,
  role: PropTypes.oneOf(['default', 'primary', 'success', 'info', 'warning', 'danger']),
  size: PropTypes.oneOf(['sm', 'lg']),
  inverse: PropTypes.bool,
  Component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  loading: PropTypes.bool,
  text: PropTypes.string,
};

const defaultProps = {
  Component: 'button',
  role: 'default',
};

class Button extends React.Component {
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    const { Component, icon, size, role, className, loading, text } = this.props;
    const componentProps = utils.extend({}, this.props);
    const myIcon = icon ? <Icon name={icon} /> : null;

    let classNames = 'a-btn';

    if (size) {
      classNames = `${classNames} a-btn--${size}`;
    }

    if (role) {
      classNames = `${classNames} a-btn--${role}`;
    }

    if (!text) {
      classNames = `${classNames} a-btn--no-text`;
    }

    if (className) {
      classNames = `${classNames} ${className}`;
    }

    if (Component === 'button' || Component === 'input') {
      delete componentProps.text;
      delete componentProps.Component;
      delete componentProps.loading;
    }

    return (
      <Component
        {...componentProps}
        className={classNames}
        type="button"
      >
        {
          loading ? (
            <Icon name="spinner" spin />
          ) : myIcon
        }
        {text}
      </Component>
    );
  }
}

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;

export default Button;
