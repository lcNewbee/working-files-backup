import React, {PropTypes} from 'react';
import Icon from 'components/Icon';

const propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'lg']),
};


class Button extends React.Component {

  render() {
    let {size, className} = this.props;
    
    let classNames = `btn`;
    
    if (size) {
      classNames = `${classNames} btn-${size}`;
    }
    
    if (className) {
      classNames = className + ' ' + classNames;
    }
    
    return (
      <div className={classNames}>
      </div>
    );
  }
}

Button.propTypes = propTypes;

export default Button;