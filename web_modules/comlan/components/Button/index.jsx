import './index.scss';
import React, {PropTypes} from 'react';
import Icon from '../Icon';

const propTypes = {
  iconName: PropTypes.string,
  role: PropTypes.string,
  className: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'lg']),
  inverse: PropTypes.bool,
  Component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
};

const defaultProps = {
  Component: 'button',
};

class Button extends React.Component {

  render() {
    let { Component, role, size, className} = this.props;
    
    let classNames = `btn`;
    
    if (size) {
      classNames = `${classNames} btn-${size}`;
    }
    
    if (className) {
      classNames = className + ' ' + classNames;
    }
    
    return (
      <Component 
        {...this.props}
        className={classNames}
        type="button"
      >
        <Icon name={role} />
        {this.props.text}
      </Component>
    );
  }
}

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;

export default Button;