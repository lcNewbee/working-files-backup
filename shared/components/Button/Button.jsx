import React from 'react';
import PropTypes from 'prop-types';
import PureComponent from '../Base/PureComponent';
import Icon from '../Icon';
import utils from '../../utils';

// Styles
import '../../scss/01_atom/_a-button.scss';

const propTypes = {
  icon: PropTypes.string,
  className: PropTypes.string,
  theme: PropTypes.oneOf(['primary', 'secondary', 'success', 'info', 'warning', 'danger']),
  size: PropTypes.oneOf(['sm', 'lg', 'min']),
  type: PropTypes.oneOf(['button', 'reset', 'submit']),
  inverse: PropTypes.bool,
  Component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  loading: PropTypes.bool,
  text: PropTypes.string,
  onClick: PropTypes.func,
};

const defaultProps = {
  Component: 'button',
  theme: 'secondary',
  role: 'button',
};

class Button extends PureComponent {
  constructor(props) {
    super(props);

    utils.binds(this, ['onClick']);
    this.state = {
      clicked: false,
    };
  }
  componentWillUnmount() {
    clearTimeout(this.clickTimeout);
  }

  onClick(e) {
    // loading 状态不响应点击事件
    if (!this.props.loading && this.props.onClick) {
      this.props.onClick(e);
      this.setState({
        clicked: true,
      });
      this.clickTimeout = setTimeout(() => {
        this.setState({
          clicked: false,
        });
      }, 500);
    }
  }

  render() {
    const { Component, icon, size, theme, className, loading, text, type, inverse } = this.props;
    const componentProps = utils.extend({}, this.props);
    const myIcon = icon ? <Icon name={icon} /> : null;

    let classNames = 'a-btn';

    if (size) {
      classNames = `${classNames} a-btn--${size}`;
    }

    if (theme) {
      classNames = `${classNames} a-btn--${theme}`;
    }

    if (!text) {
      classNames = `${classNames} a-btn--no-text`;
    }

    if (className) {
      classNames = `${classNames} ${className}`;
    }
    if (inverse) {
      classNames = `${classNames} a-btn--inverse`;
    }
    if (loading) {
      classNames = `${classNames} a-btn--loading`;
    }

    if (this.state.clicked) {
      classNames = `${classNames} a-btn--clicked`;
    }

    if (Component === 'button' || Component === 'input') {
      delete componentProps.text;
      delete componentProps.savedText;
      delete componentProps.savingText;
      delete componentProps.Component;
      delete componentProps.loading;
      delete componentProps.theme;
      delete componentProps.actionName;
      delete componentProps.needConfirm;

      componentProps.type = type;
    }

    return (
      <Component
        {...componentProps}
        className={classNames}
        onClick={this.onClick}
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
