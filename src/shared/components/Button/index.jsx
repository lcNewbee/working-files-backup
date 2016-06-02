import './index.scss';
import React, {PropTypes} from 'react';
import Icon from '../Icon';

const propTypes = {
  iconName: PropTypes.string,
  icon: PropTypes.string,
  className: PropTypes.string,
  role: PropTypes.oneOf(['success', 'info', 'warning']),
  size: PropTypes.oneOf(['sm', 'lg']),
  inverse: PropTypes.bool,
  Component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
};

const defaultProps = {
  Component: 'button',
};

class Button extends React.Component {

  render() {
    let { Component, icon, size, role, className, loading} = this.props;
    
    let classNames = `btn`;
    
    if (size) {
      classNames = `${classNames} btn-${size}`;
    }
    
    if (role) {
      classNames = `${classNames} btn-${role}`;
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
        {
          loading ? (
            <Icon name="spinner" spin={true} style={{marginLeft: '3px'}}/>
          ) : <Icon name={icon} />
        }
        {this.props.text}
        
      </Component>
    );
  }
}

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;

export default Button;